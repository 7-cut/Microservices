from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

ADMIN_URL = "http://localhost:5001/packages"


@app.route("/recommend", methods=["POST"])
def recommend_packages():
    data = request.get_json()
    preferences = data.get("preferences", {})
    liked_destinations = preferences.get("liked_destinations", [])
    preferred_activities = preferences.get("preferred_activities", [])

    try:
        packages = requests.get(ADMIN_URL).json()
        recommended = []

        for pkg in packages:
            destination_match = pkg["destination"] in liked_destinations
            activity_match = any(act in pkg["activities"] for act in preferred_activities)

            if destination_match or activity_match:
                recommended.append(pkg)

        return jsonify({"recommended_packages": recommended}), 200

    except Exception as e:
        return jsonify({"error": "Recommendation failed", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5004, debug=True)
