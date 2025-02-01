from flask import Flask, render_template, request, redirect
import passwords
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient(passwords.passwords["MongoURI"])
db = client["Secretary"]
users = db["Users"]
classes = db["Classes"]


@app.route("/")
def index():
    return"<h1><a href=\"/signup\">signup</a></h1><h1><a href=\"/login\">login</a></h1>"


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")
    else:
        username = request.form["username"]
        password = request.form["password"]
        
        results = users.find({"$and": [{"username": username}, {"password": password}]}).to_list()
        
        if len(results) == 1:
            return 200
        else:
            return 400


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "GET":
        return render_template("signup.html")
    else:
        username = request.form["username"]
        password = request.form["password"]
        
        results = users.find({"username": username}).to_list()
         
        # #check if user already exists
        if len(results) == 0:
            users.insert_one({"username": username, "password": password})
            return 200
        else:
            return 400
