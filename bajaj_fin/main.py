from flask import Flask, request, jsonify
import re

app = Flask(__name__)

# Replace with your details
FULL_NAME = "fardin_khan"
DOB = "08062003"
EMAIL = "22bai71309@cuchd.in"
ROLL_NUMBER = "22bai71309"

@app.route('/bfhl', methods=['POST'])
def process_data():
    try:
        data = request.json.get("data", [])
        if not isinstance(data, list):
            return jsonify({"is_success": False, "error": "Invalid input format"}), 400
        
        numbers = [item for item in data if re.match(r'^\d+$', str(item))]
        alphabets = [item for item in data if isinstance(item, str) and item.isalpha()]
        highest_alphabet = max(alphabets, key=str.upper) if alphabets else []
        
        response = {
            "is_success": True,
            "user_id": f"{FULL_NAME}_{DOB}",
            "email": EMAIL,
            "roll_number": ROLL_NUMBER,
            "numbers": numbers,
            "alphabets": alphabets,
            "highest_alphabet": [highest_alphabet] if highest_alphabet else []
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"is_success": False, "error": str(e)}), 500

@app.route('/bfhl', methods=['GET'])
def get_operation_code():
    return jsonify({"operation_code": 1}), 200

if __name__ == '__main__':
    app.run(debug=True)
