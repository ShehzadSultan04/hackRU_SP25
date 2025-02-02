from flask import Flask, render_template, request, redirect, jsonify, session
from flask_cors import CORS
import passwords
from pymongo import MongoClient
import googlemaps
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.secret_key = passwords.secret_key

client = MongoClient(passwords.passwords["MongoURI"])
db = client["Secretary"]
users = db["Users"]
classes = db["Classes"]
departments = db["Departments"]
buildings = db["Buildings"]


@app.route("/")
def index():
    return"<h1><a href=\"/signup\">signup</a></h1><h1><a href=\"/login\">login</a></h1>"

@app.post('/map')
def map():
    index1 = request.json["index1"]
    index2 = request.json["index2"]

    class1Loc = classes.find({"index": index1}).to_list()[0]["location"].split("-")[0]
    class2Loc = classes.find({"index": index2}).to_list()[0]["location"].split("-")[0]

    l1 = buildings.find({"Code": class1Loc.upper()}).to_list()[0]["Address"]
    l2 = buildings.find({"Code": class2Loc.upper()}).to_list()[0]["Address"]


    gmaps = googlemaps.Client(key=passwords.passwords["GoogleAPIKey"])
    now = datetime.now()
    directions_result = gmaps.directions(l1,
                                     l2,
                                     mode="walking",
                                     departure_time=now)

    # l1 = "607 Allison Rd, Piscataway, NJ 08854".replace(" ", "+")
    # l2 = "599 Taylor Rd, Piscataway, NJ 08854".replace(" ", "+")
    mapurl = "https://maps.googleapis.com/maps/api/staticmap?scale=2&size=400x400&markers="+ l1.replace(" ", "+") +"%7C" + l2.replace(" ", "+") + "&path=enc:" + directions_result[0]["overview_polyline"]["points"] + "&key=" + passwords.passwords["GoogleAPIKey"]

    return jsonify({"mapurl": mapurl})

@app.post("/login")
def login():
    username = request.json["username"]

    results = users.find({"username": username}).to_list()

    if len(results) == 1:
        session["username"] = username
        return jsonify({"status": 200})
    else:
        users.insert_one({"username": username})
        session["username"] = username
        return jsonify({"status": 200, "username": username})


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

@app.get("/checkAuth")
def checkAuth():
    if "username" in session:
        return jsonify({"status": 200, "username": session["username"]})
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
            results[x["name"]] = [x["credits"], x["times"]]
        else:
            results[x["name"]].append(x["times"])

    if len(results) != 0:
        return jsonify(results)
    else:
        return jsonify({"status": 400})

@app.post("/getSectionFromClass")
def getSectionFromClass():
    className = request.json["class"]

    allClasses = classes.find({"name": className}).to_list()
    results = {}

    for x in allClasses:
        results[x["section"]] = [x["index"], x["times"], x["professor"], x["location"]]

    if len(results) != 0:
        return jsonify(results)
    else:
        return jsonify({"status": 400})

if __name__ == "__main__":
    app.run(debug=True)
