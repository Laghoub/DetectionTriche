from flask import Flask, jsonify, request
import face_recognition
import cv2
import os
from datetime import datetime
from generate_encoding import knownFaces
import json
from flask_cors import CORS
import pyaudio
import wave
import whisper
import nltk
import warnings
import threading
from nltk import word_tokenize, download
from nltk.stem import WordNetLemmatizer

warnings.filterwarnings("ignore")

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

app = Flask(__name__)
CORS(app)

cam = None
classes = []
with open('coco.names', 'r') as file_object:
    for class_name in file_object.readlines():
        class_name = class_name.strip()
        classes.append(class_name)

# Chargement du modèle YOLOv4
net = cv2.dnn.readNet('yolov4.weights', 'yolov4.cfg')
model = cv2.dnn_DetectionModel(net)
model.setInputParams(size=(320, 320), scale=1/255)

# Utilisateurs enregistrés (simulés pour cet exemple)
with open('users.json', 'r') as f:
    users = json.load(f)

# Chargement des visages connus
known_faces = knownFaces()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Vérifier les informations d'identification
    if username in users and users[username]["password"] == password:
        user_info = {
            "username": username,
            "nom": users[username]["nom"],
            "prenom": users[username]["prenom"],
            "date_naissance": users[username]["date_naissance"]
        }
        return jsonify({"message": "Login successful", "user": user_info}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@app.route('/verify-identity', methods=['POST'])
def verify_identity():
    data = request.get_json()
    username = data.get('username')
    # Capture d'une seule image de la vidéo
    cam = cv2.VideoCapture(0)
    ret, frame = cam.read()
    cam.release()
    
    if not ret:
        return jsonify({"message": "Failed to capture image"}), 500
    
    # Redimensionner l'image pour accélérer le traitement de la reconnaissance faciale
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    # Recherche des emplacements et encodages des visages dans l'image
    face_locations = face_recognition.face_locations(small_frame)
    face_encodings = face_recognition.face_encodings(small_frame, face_locations)
    face_names = []
    for face_encoding in face_encodings:
        # Comparaison avec les visages connus
        matches = face_recognition.compare_faces(known_faces, face_encoding)
        name = "Unknown"
        for i in range(len(matches)):
            if matches[i]:
                # Récupération du nom du visage à partir du nom du fichier
                name = os.path.splitext(os.listdir('./known_faces')[i])[0]
                if (name == username):
                    return jsonify({"message": "validée", "names": name}), 200
                else:
                    return jsonify({"message": "échouée", "names": name}), 200
    return jsonify({"message": "Identity verified", "names": face_names}), 200

@app.route('/surveillance', methods=['GET'])
def surveillance():
    global known_faces
    cam = cv2.VideoCapture(0)
    face_locations = []
    face_names = []
    process_this_frame = True
    fraud_detected = False
    currentframe = 0

    while True:
        ret, frame = cam.read()
        if not ret:
            break
        else:
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            if process_this_frame:
                face_locations = face_recognition.face_locations(small_frame)
                face_encodings = face_recognition.face_encodings(small_frame, face_locations)
                face_names = []
                for face_encoding in face_encodings:
                    matches = face_recognition.compare_faces(known_faces, face_encoding)
                    name = "Unknown"
                    for i in range(len(matches)):
                        if matches[i]:
                            name = os.path.splitext(os.listdir('./known_faces')[i])[0]
                            break
                    face_names.append(name)
            process_this_frame = not process_this_frame

            for (top, right, bottom, left), name in zip(face_locations, face_names):
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4
                cv2.rectangle(frame, (left, top), (right, bottom), (102, 102, 0), 2)
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (102, 102, 0), cv2.FILLED)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

            if len(face_names) > 1:
                cv2.imwrite(f'./Fraud/PersonUnknown{currentframe}.jpg', frame)
                with open('./Fraud/log.txt', 'a+') as file:
                    now = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
                    file.write(f"Person detected! at {now}\n")
                fraud_detected = True
                currentframe += 1
            elif len(face_names) < 1:
                cv2.imwrite('./Fraud/PersonUnknown' + str(currentframe) + '.jpg', frame)
                with open('./Fraud/log.txt', 'a+') as file:
                    now = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
                    file.write(f"Hidden camera detected! at {now}\n")
                fraud_detected = True
                currentframe += 1

    cam.release()
    cv2.destroyAllWindows()

    return jsonify({"message": "Surveillance complete", "names": face_names}), 200

@app.route('/stoprecord', methods=['GET'])
def stop_record():
    global cam
    if cam is None:
        return jsonify({"message": "La caméra n'est pas en train d'enregistrer"}), 400
    
    cam.release()
    cam = None
    return jsonify({"message": "Enregistrement de la caméra arrêté avec succès"}), 200

@app.route('/fraudObject', methods=['GET'])
def fraud_object():
    Verif()
    Prog()
    return jsonify({"message": "Fraud Object Complete"}), 200

def Verif():
    username = 'nassim'
    password = 'nassim'
    url = f"rtsp://{username}:{password}@192.168.196.101:8080/h264_ulaw.sdp"
    global vs
    vs = cv2.VideoCapture(url)
    if vs.isOpened():
        return True
    return False

def Prog():
    global vs
    global class_name
    global classes
    currentframe = 0
    while True:
        success, frame = vs.read()
        if not success:
            break
        else:
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            class_ids, scores, bboxes = model.detect(small_frame)
            for class_id, score, bbox in zip(class_ids, scores, bboxes):
                x, y, w, h = bbox
                class_name = classes[class_id]
                cv2.putText(small_frame, class_name, (x, y - 5), cv2.FONT_HERSHEY_PLAIN, 1, (200, 0, 50), 2)
                cv2.rectangle(small_frame, (x, y), (x+w, y+h), (200, 0, 50), 3)
            if "cell phone" in class_name or "backpack" in class_name or "person" in class_name:
                cv2.imwrite('./Fraud/ObjectUnknown' + str(currentframe) + '.jpg', frame)
                with open('./Fraud/log.txt', 'a+') as file:
                    now = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
                    file.write(f"Object detected! {class_name} at {now}\n")
                currentframe += 1

    vs.release()
    cv2.destroyAllWindows()

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


import re

def count_fraud_by_second():
    log_file_path = 'Fraud/log.txt'
    counts_per_second = {}

    with open(log_file_path, 'r', encoding='UTF8') as file:
        for line in file:
            if "Hidden camera detected!" in line or "Person detected!" in line:
                # Extraire le timestamp
                timestamp_str = line.split(" at ")[1].strip()
                # Convertir en datetime
                timestamp = datetime.strptime(timestamp_str, "%d/%m/%Y %H:%M:%S")
                # Utiliser seulement jusqu'à la seconde
                timestamp_key = timestamp.strftime("%d/%m/%Y %H:%M:%S")
                # Utiliser la partie de la phrase avant "at"
                phrase_before_at = re.search(r'^(.*?) at', line).group(1).strip()
                key = f"{timestamp_key} - {phrase_before_at}"
                if key in counts_per_second:
                    counts_per_second[key] += 1
                else:
                    counts_per_second[key] = 1

    return counts_per_second




# Route pour retourner le nombre de détections par seconde
@app.route('/fraudCounts', methods=['GET'])
def fraud_counts():
    counts = count_fraud_by_second()
    return jsonify(counts)

if __name__ == '__main__':
    app.run(debug=True)
