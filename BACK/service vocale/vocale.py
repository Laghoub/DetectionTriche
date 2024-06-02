# audio_surveillance_service.py
from flask import Flask, jsonify
import pyaudio
import wave
import whisper
import nltk
import warnings
import threading
from nltk import word_tokenize, download
from nltk.stem import WordNetLemmatizer
from datetime import datetime
import os

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

# Téléchargement des ressources NLTK
download('punkt')
download('wordnet')
download('omw-1.4')

# Configuration de l'audio
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
RECORD_SECONDS = 15
WAVE_OUTPUT_FILENAME = './Fraud/Audio.wav'

# Fonction de surveillance vocale
def audio_surveillance():
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    while True:
        frames = []
        for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
            data = stream.read(CHUNK)
            frames.append(data)

        wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))
        wf.close()

        model = whisper.load_model('base')
        result = model.transcribe(WAVE_OUTPUT_FILENAME)
        text = result["text"]

        with open("./Fraud/AudioScript.txt", "a", encoding='UTF8') as file:
            file.write(text + '\n')

        forbid_word = ["comment faire", "exercice", "aide", "réponse", "question", "solution", "toi", "tu", "ton"]
        lemmatizer = WordNetLemmatizer()
        with open('./Fraud/log.txt', 'a+', encoding='UTF8') as logfile:
            tokens = word_tokenize(text)
            for token in tokens:
                lemma = lemmatizer.lemmatize(token, pos='v')
                if any(word.lower() in lemma.lower() for word in forbid_word):
                    now = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
                    logfile.write(f"A forbidden word has been detected! {token} at {now}\n")
                    break

@app.route('/audio-surveillance', methods=['GET'])
def start_audio_surveillance():
    audio_thread = threading.Thread(target=audio_surveillance)
    audio_thread.start()
    return jsonify({"message": "Audio surveillance started"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5003)
