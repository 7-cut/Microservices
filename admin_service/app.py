from flask import Flask, request, jsonify
from flask_cors import CORS
from db import packages_collection, users_collection  # Ensure both collections are imported correctly
from datetime import datetime
from bson import ObjectId

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

@app.route('/')
def home():
    return jsonify(message="Admin Service is running")

# POST route to add a holiday package
@app.route('/packages', methods=['POST'])
def add_package():
    data = request.json

    # Basic validation
    required_fields = ["destination", "price", "duration", "activities"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Insert into MongoDB
    result = packages_collection.insert_one(data)
    return jsonify({"message": "Package added", "package_id": str(result.inserted_id)}), 201

@app.route('/packages', methods=['GET'])
def get_all_packages():
    packages = list(packages_collection.find())
    for pkg in packages:
        pkg["_id"] = str(pkg["_id"]) # convert ObjectId to string
    return jsonify(packages), 200

@app.route('/packages/<package_id>', methods=['DELETE'])
def delete_package(package_id):
    result = packages_collection.delete_one({'_id': ObjectId(package_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Package deleted"}), 200
    return jsonify({"error": "Package not found"}), 404

@app.route('/admin', methods=['GET'])
def get_user():
    username = request.args.get('username')
    if username:
        # Fetch user data (including birthday message)
        user = users_collection.find_one({"username": username})
        if user:
            # Check birthday
            today = datetime.now()
            # Ensure 'dob' is in the correct format, and handle potential parsing issues
            try:
                dob = datetime.strptime(user['dob'], '%Y-%m-%d')
                birthday_today = today.month == dob.month and today.day == dob.day
                birthday_wish = f"🎉 Happy Birthday, {username}!" if birthday_today else ""
                return jsonify({"birthday_wish": birthday_wish, "username": username})
            except Exception as e:
                return jsonify({"error": f"Error parsing date of birth: {str(e)}"}), 400
        else:
            return jsonify({"error": "User not found"}), 404
    return jsonify({"error": "Username is required"}), 400

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5001, debug=True)
