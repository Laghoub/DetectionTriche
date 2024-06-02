# log_management_service.py
from flask import Flask, jsonify
from datetime import datetime
import re
import os

app = Flask(__name__)
CORS(app)

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
    app.run(debug=True, port=5004)
