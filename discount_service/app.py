from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Define months for seasonal discounts
SEASONAL_DISCOUNT_MONTHS = [4, 6, 12]  # May, June, December

@app.route("/discount/calculate", methods=["POST"])
def calculate_discount():
    data = request.get_json()
    dob_str = data.get("dob")        # format: YYYY-MM-DD
    today_str = data.get("today")    # optional override for today's date

    try:
        # Parse the DOB and today dates
        dob = datetime.strptime(dob_str, "%Y-%m-%d")
        today = datetime.strptime(today_str, "%Y-%m-%d") if today_str else datetime.today()

        discount = 0
        reason = []

        # Check if it's the user's birthday
        if dob.day == today.day and dob.month == today.month:
            discount += 20  # 20% discount for birthday
            reason.append("Birthday 🎂")

        # Check for seasonal discounts
        if today.month in SEASONAL_DISCOUNT_MONTHS:
            discount += 10  # 10% seasonal discount
            reason.append("Seasonal ❄️")

        # Format reason
        discount_reason = " and ".join(reason) if reason else "No discount"

        # Return discount percentage and reason
        return jsonify({
            "discount_percent": discount,
            "reason": discount_reason
        }), 200

    except Exception as e:
        return jsonify({"error": "Invalid date format", "details": str(e)}), 400


if __name__ == '__main__':
    app.run(port=5003, debug=True)
