# face_recognition_service.py
from flask import Flask, jsonify, request
import face_recognition
import cv2
import os
import json
from flask_cors import CORS
from generate_encoding import knownFaces

app = Flask(__name__)
CORS(app)

# Chargement des visages connus
known_faces = knownFaces()

@app.route('/verify-identity', methods=['POST'])
def verify_identity():
    data = request.get_json()
    username = data.get('username')
    cam = cv2.VideoCapture(0)
    ret, frame = cam.read()
    cam.release()
    
    if not ret:
        return jsonify({"message": "Failed to capture image"}), 500
    
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    face_locations = face_recognition.face_locations(small_frame)
    face_encodings = face_recognition.face_encodings(small_frame, face_locations)
    face_names = []
    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(known_faces, face_encoding)
        name = "Unknown"
        for i in range(len(matches)):
            if matches[i]:
                name = os.path.splitext(os.listdir('./known_faces')[i])[0]
                if (name == username):
                    return jsonify({"message": "validée", "names": name}), 200
                else:
                    return jsonify({"message": "échouée", "names": name}), 200
    return jsonify({"message": "Identity verified", "names": face_names}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)
