# video_surveillance_service.py
from flask import Flask, jsonify
import cv2
import face_recognition
import os
from datetime import datetime
from generate_encoding import knownFaces
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Chargement des visages connus
known_faces = knownFaces()
classes = []
with open('coco.names', 'r') as file_object:
    for class_name in file_object.readlines():
        class_name = class_name.strip()
        classes.append(class_name)

# Chargement du modèle YOLOv4
net = cv2.dnn.readNet('yolov4.weights', 'yolov4.cfg')
model = cv2.dnn_DetectionModel(net)
model.setInputParams(size=(320, 320), scale=1/255)

@app.route('/surveillance', methods=['GET'])
def surveillance():
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

if __name__ == '__main__':
    app.run(debug=True, port=5002)
