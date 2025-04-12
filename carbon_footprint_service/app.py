from flask import Flask, request, jsonify

app = Flask(__name__)

# Mock carbon values (you can tweak these later)
DESTINATION_MULTIPLIER = {
    "Manali": 50,
    "Bali": 150,
    "Paris": 200,
    "Local": 20
}

ACTIVITY_MULTIPLIER = {
    "Skiing": 30,
    "Snowboarding": 35,
    "Sightseeing": 10,
    "Snorkeling": 25,
    "Paragliding": 40,
    "Local Food Tour": 5
}


@app.route('/carbon/estimate', methods=['POST'])
def estimate_carbon():
    data = request.get_json()

    destination = data.get("destination", "Local")
    activities = data.get("activities", [])
    duration = data.get("duration_days", 1)

    dest_factor = DESTINATION_MULTIPLIER.get(destination, 20)
    activity_factor = sum([ACTIVITY_MULTIPLIER.get(act, 5) for act in activities])

    # Simple formula
    carbon_kg = (dest_factor + activity_factor) * duration

    return jsonify({
        "estimated_carbon_kg": carbon_kg,
        "destination": destination,
        "duration_days": duration
    }), 200


if __name__ == '__main__':
    app.run(port=5002, debug=True)
