from flask import Flask, request, jsonify
from flask_cors import CORS
from db import packages_collection  # Import from db.py

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

from bson import ObjectId

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


if __name__ == '__main__':
    app.run(port=5001, debug=True)
