from flask import Flask, render_template, request, redirect, jsonify
from flask_cors import CORS
import passwords
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient(passwords.passwords["MongoURI"])
db = client["Secretary"]
users = db["Users"]
classes = db["Classes"]
departments = db["Departments"]


@app.route("/")
def index():
    return"<h1><a href=\"/signup\">signup</a></h1><h1><a href=\"/login\">login</a></h1>"


@app.post("/login")
def login():
    username = request.json["username"]
    password = request.json["password"]
    
    results = users.find({"$and": [{"username": username}, {"password": password}]}).to_list()
    
    if len(results) == 1:
        return jsonify({"status": 200, "username": username})
    else:
        return jsonify({"status": 400})


@app.post("/signup")
def signup():
    
    username = request.json["username"]
    password = request.json["password"]
    
    results = users.find({"username": username}).to_list()
        
    # #check if user already exists
    if len(results) == 0:
        users.insert_one({"username": username, "password": password})
        return jsonify({"status": 200})
    else:
        return jsonify({"status": 400})

@app.get("/getDeps")
def getDeps():
    deps = dict([(x["departmentName"], x["departmentCode"]) for x in departments.find({}).to_list()])
    return jsonify(deps)

@app.post("/getClassFromDep")
def getClassFromDep():
    depName = request.json["dep"]
    
    allClasses = classes.find({"department": depName}).to_list()
    results = {}
    
    for x in allClasses:
        if x["name"] not in results.keys():
            results[x["name"]] = x["credits"]
    
    if len(results) != 0:
        return jsonify(results)
    else:
        return jsonify({"status": 400})

if __name__ == "__main__":
    app.run(debug=True)