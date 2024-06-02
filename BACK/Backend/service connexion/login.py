# login_service.py
from flask import Flask, jsonify, request
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Utilisateurs enregistrés (simulés pour cet exemple)
with open('users.json', 'r') as f:
    users = json.load(f)

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
