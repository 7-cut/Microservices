import requests

url = "http://127.0.0.1:5002/carbon/estimate"

payload = {
    "destination": "Manali",
    "activities": ["Skiing", "Sightseeing"],
    "duration_days": 5
}

res = requests.post(url, json=payload)

print("Status Code:", res.status_code)
print("Response:", res.json())
