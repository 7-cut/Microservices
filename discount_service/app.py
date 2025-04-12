# discount_service/app.py

from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

SEASONAL_DISCOUNT_MONTHS = [5, 6, 12]  # May, June, December

@app.route("/discount/calculate", methods=["POST"])
def calculate_discount():
    data = request.get_json()
    dob_str = data.get("dob")        # format: YYYY-MM-DD
    today_str = data.get("today")    # optional override

    try:
        dob = datetime.strptime(dob_str, "%Y-%m-%d")
        today = datetime.strptime(today_str, "%Y-%m-%d") if today_str else datetime.today()

        discount = 0
        reason = ""

        if dob.day == today.day and dob.month == today.month:
            discount += 20
            reason += "Birthday 🎂 "

        if today.month in SEASONAL_DISCOUNT_MONTHS:
            discount += 10
            reason += "Seasonal ❄️"

        return jsonify({
            "discount_percent": discount,
            "reason": reason.strip() if reason else "No discount"
        }), 200

    except Exception as e:
        return jsonify({"error": "Invalid date format", "details": str(e)}), 400


if __name__ == '__main__':
    app.run(port=5003, debug=True)
