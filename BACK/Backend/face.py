import face_recognition
from generate_encoding import knownFaces
import cv2
import os

# Chargement des visages connus
known_faces = knownFaces()

def recognition_face():
    cam = cv2.VideoCapture(0)
    while True:
        # Capture d'une seule image de la vidéo
        ret, frame = cam.read()
        if not ret:
            break
        else:
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
                face_names.append(name)
            # Affichage des résultats
            for (top, right, bottom, left), name in zip(face_locations, face_names):
                # Dessiner un rectangle autour du visage
                cv2.rectangle(frame, (left * 4, top * 4), (right * 4, bottom * 4), (102, 102, 0), 2)
                # Afficher le nom du visage
                cv2.putText(frame, name, (left * 4 + 6, bottom * 4 - 6), cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), 1)
            # Affichage de l'image avec les visages détectés
            cv2.imshow('Video', frame)
            # Quitter la boucle si la touche 'q' est enfoncée
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    # Libérer la capture de la caméra et fermer les fenêtres
    cam.release()
    cv2.destroyAllWindows()

# Appeler la fonction pour démarrer la reconnaissance faciale
recognition_face()
