from pymongo import MongoClient

# Use the Docker container's hostname or IP if services are inside Docker network
# For local development (outside of Docker), 'localhost' is fine if the container is exposing the port
client = MongoClient("mongodb://localhost:27017/")

# Database and collection
db = client["mmt"]  # this is your 'mmt' database
packages_collection = db["packages"]
users_collection = db["users"]  # if you plan to add user auth later
discounts_collection = db["discounts"]