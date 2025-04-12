import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from db import users_collection

app = Flask(__name__)
CORS(app)

ADMIN_URL = "http://127.0.0.1:5001/packages"
CARBON_URL = "http://127.0.0.1:5002/carbon/estimate"

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    userType = data.get("userType", "user")  # default role is 'user'
    dob = data.get("dob")  # Extract DOB from the request data

    if not username or not password or not dob:
        return jsonify({"error": "Username, password, and DOB are required"}), 400

    # Check if user already exists
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already taken"}), 409

    # Save to DB
    new_user = {"username": username, "password": password, "userType": userType, "dob": dob}
    users_collection.insert_one(new_user)

    return jsonify({"message": "Registration successful"}), 201

@app.route('/user/packages', methods=['GET'])
def get_packages():
    try:
        res = requests.get(ADMIN_URL)
        res.raise_for_status()
        return jsonify(res.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route('/user/select', methods=['POST'])
def select_package():
    data = request.get_json()
    package_id = data.get("package_id")
    user_id = data.get("user_id")
    custom_activities = data.get("custom_activities", [])
    custom_dates = data.get("custom_dates")

    # Step 1: Fetch package details from Admin service
    try:
        all_packages = requests.get(ADMIN_URL).json()
        selected = next((pkg for pkg in all_packages if pkg["_id"] == package_id), None)
    except Exception as e:
        return jsonify({"error": "Failed to fetch package data", "details": str(e)}), 500

    if not selected:
        return jsonify({"error": "Package not found"}), 404

    # Step 2: Estimate Carbon Footprint
    try:
        carbon_payload = {
            "destination": selected["destination"],
            "activities": custom_activities or selected["activities"],
            "duration_days": int(selected["duration"].split()[0])  # "5 days" => 5
        }

        carbon_res = requests.post(CARBON_URL, json=carbon_payload)
        carbon_data = carbon_res.json()

    except Exception as e:
        return jsonify({"error": "Carbon estimation failed", "details": str(e)}), 500

    # Fetch package info from admin_service as you're already doing
    package_price = selected.get("price", 0)

    # Simulated user DOB (in real case, would come from user profile)
    user_dob = "2000-04-09"

    # Call discount service
    try:
        discount_response = requests.post(
            "http://localhost:5003/discount/calculate",
            json={"dob": user_dob}
        )
        discount_data = discount_response.json()
        discount_percent = discount_data.get("discount_percent", 0)
        discount_reason = discount_data.get("reason", "")

        final_price = package_price * (1 - discount_percent / 100)

    except Exception as e:
        discount_percent = 0
        discount_reason = "Discount service unavailable"
        final_price = package_price

    # Final response
    response = {
    "user_id": user_id,
    "package_id": package_id,
    "custom_dates": custom_dates,
    "custom_activities": custom_activities,
    "carbon_estimate": carbon_data,
    "original_price": package_price,
    "discount_percent": discount_percent,
    "discount_reason": discount_reason,
    "final_price": final_price,
    "notes": "Package customized, evaluated, and priced."
}

    return jsonify(response), 200

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = users_collection.find_one({"username": username})

    if user and user["password"] == password:
        return jsonify({"message": "Login successful", "userType": user["userType"]}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route("/user/<username>", methods=["GET"])
def get_user_info(username):
    user = users_collection.find_one({"username": username}, {"_id": 0, "dob": 1})
    if user:
        return jsonify(user), 200
    return jsonify({"error": "User not found"}), 404

if __name__ == '__main__':
    app.run(port=5005, debug=True)
