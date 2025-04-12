import requests

url = "http://127.0.0.1:5005/user/select"

payload = {
    "user_id": "u456",
    "package_id": "67f6af95c33a80190f81001a",  # your actual ID
    "custom_dates": "2025-06-01 to 2025-06-06",
    "custom_activities": ["Paragliding", "Skiing"]
}

res = requests.post(url, json=payload)

print("Status Code:", res.status_code)
print("Response:", res.json())
