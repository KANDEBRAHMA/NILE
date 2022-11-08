from crypt import methods
import json
from sqlite3 import Cursor
from crypt import methods
from email import message
from unittest import result
from flask_mail import Mail, Message
from flask import Flask, jsonify, request
from flaskext.mysql import MySQL
from datetime import datetime
from flask_cors import CORS
from pymysql.cursors import DictCursor
from dotenv import load_dotenv
import os,smtplib
import random as rd
import geopy.geocoders
from geopy.geocoders import Nominatim
import certifi
import ssl

load_dotenv()
app = Flask(__name__)
cors = CORS(app)
mysql = MySQL(cursorclass=DictCursor)

#mysql configuration
app.config['MYSQL_DATABASE_USER'] = os.getenv('MYSQL_DATABASE_USER')
app.config['MYSQL_DATABASE_PASSWORD'] = os.getenv('MYSQL_DATABASE_PASSWORD')
app.config['MYSQL_DATABASE_DB'] = os.getenv('MYSQL_DATABASE_DB')
app.config['MYSQL_DATABASE_HOST'] = os.getenv('MYSQL_DATABASE_HOST')

# #email configuration
app.config['MAIL_SERVER']= os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)
mysql.init_app(app)

def lat_lon(address):
    ctx = ssl.create_default_context(cafile=certifi.where())
    geopy.geocoders.options.default_ssl_context = ctx
    geolocator = Nominatim(user_agent="myGeocoder")
    location = geolocator.geocode(address)
    return {"lat":location.latitude,"lon":location.longitude}

def generate_otp():
  otp = 0
  for _ in range(6):
    otp = rd.randint(1,9)+(otp*10)
  return otp

def send_email(message, email_id,subject):
    smtpserver = smtplib.SMTP(app.config['MAIL_SERVER'], 587)
    smtpserver.ehlo()
    smtpserver.starttls()
    smtpserver.ehlo()
    smtpserver.login(app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
    print(email_id)
    msg = Message(subject, sender = app.config['MAIL_USERNAME'], recipients = [email_id])
    msg.html = message
    mail.send(msg)
    return "Message sent!"

def db_connect():
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    return conn,cursor

def generateUserId(firstname, lastname):
    conn,cursor = db_connect()
    userid = (firstname[:3]+lastname[-3:]).lower()
    cursor.execute("SELECT * from USERS where userid = %s",(userid))
    data = cursor.fetchall()
    if data:
        for i in range(len(firstname)):
            userid = (firstname[i]+lastname[:5]).lower()
            cursor.execute("SELECT * from USERS where userid = %s",(userid))
            data = cursor.fetchall()
            if len(data) == 0:
                conn.close()
                return userid
    else:
        conn.close()
        return userid

@app.route('/')
@app.route('/profile')
def my_profile():
    response_body = {
        "name": "Nile",
        "about" :"This is my login page"
    }
    return response_body


@app.route('/register',methods =['GET', 'POST'])
def register():
    # print("Here")
    try:
        if request.method == 'POST':
            timestamp = datetime.now()
            userid = generateUserId(request.json['firstname'],request.json['lastname'])
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM USERS where Username = %s",(request.json['email']))
            data = cursor.fetchall()
            if data:
                conn.close()
                return jsonify({'response':205,'message': 'User already exists. Please login!'})
            else:
                # print(username,password)
                cursor.execute("INSERT INTO USERS(FirstName,LastName,Username,Password,Role,TimeStamp,UserId,SecurityQuestion,Answer) VALUES(%s, %s,%s,%s,%s,%s,%s,%s,%s)",
                (request.json['firstname'],request.json['lastname'],request.json['email'],request.json['password'],request.json['role'],timestamp,userid,request.json['securityquestion'],request.json['answer']))
                if request.json['role'] in ('Admin', 'Driver'):
                    cursor.execute("INSERT INTO EMPLOYEES(FullName,Role,email) VALUES(%s,%s,%s)",(request.json['firstname']+" "+request.json['lastname'], request.json['role'],request.json['email']))
                cursor.close()
                message = "<p>"+"Dear "+request.json['firstname']+","+"<br><br>"+"Welcome to Nile Delivery Service!. Your Username/Userid is <b>"+userid+"</b></p>"
                send_email(message,request.json['email'],"Welcome!")
                conn.close()
                return jsonify({'response':200,'userid':userid,'message' : 'User registered successfully'})
    except Exception as e:
        return jsonify(e)


@app.route('/login',methods = ['POST'])
def login():
    try:
        if request.method == 'POST':
            username = request.json['email']
            password = request.json['password']
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM USERS where username = %s or userid = %s",(username,username))
            data = cursor.fetchall()
            # print(data)
            if data:
                cursor.execute("SELECT username,role FROM USERS where (username = %s OR userid = %s) AND password = %s",(username,username,password))
                data = cursor.fetchall()
                # print(data)
                cursor.close()
                if data:
                    result = {}
                    for row in data:
                        result['role'] = row['role']
                        username = row['username']
                    result['msg'] = "User exists"
                    result['username'] = username
                    result['response'] = 200
                    otp = generate_otp()
                    result['otp'] = otp
                    message = "<p>"+"Dear "+username+","+"<br><br>"+"Welcome to Nile Delivery Service!. Your OTP for login is <b>"+str(otp)+"</b></p>"
                    send_email(message,username,"Login OTP!")
                    conn.close()
                    return result
                else:
                    conn.close()
                    return jsonify({'response':205,'message': 'Password is Wrong'})
            else:
                conn.close()
                return jsonify({'response':205,'message':'User does not exist. Please register!'})
    except Exception as e:
        return jsonify(e)

@app.route('/forgotpassword/<string:username>',methods = ['GET','POST'])
def forgotpassword(username : str):
    if request.method == 'GET':
        conn,cursor = db_connect()
        cursor.execute("SELECT SecurityQuestion from USERS where username = %s OR userid = %s",(username,username))
        data = cursor.fetchall()
        cursor.close()
        if data:
            result = {}
            for row in data:
                result['SecurityQuestion'] = row['SecurityQuestion']
            result['username'] = username
            result['response'] = 200
            conn.close()
            return result
        else:
            conn.close()
            return jsonify({'response':205,'username':username,'msg':'User not exists'})
    elif request.method == 'POST':
        question = request.json['question']
        answer = request.json['answer']
        conn,cursor = db_connect()
        cursor.execute("SELECT * from USERS where username = %s OR userid = %s",(username,username))
        data = cursor.fetchall()
        if data:
            cursor.execute("SELECT * from USERS where (username = %s OR userid = %s) and SecurityQuestion =%s and Answer=%s",(username,username,question,answer))
            data = cursor.fetchall()
            if data:
                conn.close()
                return jsonify({'response':200,'msg':'Answer is correct'})  
            else:
                conn.close()
                return jsonify({'response':205,'msg':'Answer is incorrect'})
        else:
            conn.close()
            return jsonify({'response':205,'msg':'User doesnot exist'})    


@app.route('/updatepassword/<string:username>',methods=['POST'])
def update_password(username: str):
    try:
        if request.method == 'POST':
            newpassword = request.json['newpassword']
            conn,cursor = db_connect()
            cursor.execute("SELECT * from USERS where username = %s OR userid = %s",(username,username))
            data = cursor.fetchall()
            if data:
                cursor.execute("SELECT * from USERS where (username = %s OR userid = %s) AND password = %s",(username,username, newpassword))
                data = cursor.fetchall()
                print(data)
                if data:
                    cursor.close()
                    conn.close()
                    return jsonify({'response':205,'msg':"You are changing it with the same password"})
                else:
                    cursor.execute("UPDATE USERS set password = %s where username = %s OR userid = %s",(newpassword, username, username))
                    cursor.close()
                    conn.close()
                    return jsonify({'response':200,'username':username,'msg':'Password updated successfully.'})
            else:
                conn.close()
                return jsonify({'response':205,'username':username,'msg':'User not exists'})
    except Exception as e:
        return jsonify(e)

@app.route("/email")
def index():
    return send_email("Welcome to Nile Delivery Service",'harishanker.kande@gmail.com','Welcome!')

@app.route('/searchEmployees',methods=["GET"])
def searchEmployees():
    try:
        conn,cursor = db_connect()
        cursor.execute("SELECT * from Employees")
        data = cursor.fetchall()
        if data:
            conn.close()
            return jsonify(data),200
        else:
            conn.close()
            return jsonify({'message':"No Employees"}),205
    except Exception as e:
        print(e)
        
@app.route('/availableDrivers',methods=["GET"])
def availableDrivers():
    try:
        conn,cursor = db_connect()
        cursor.execute("SELECT * from Employees where available=%s and role='Driver'",("yes"))
        data = cursor.fetchall()
        if(data):
            conn.close()
            return jsonify(data),200
        else:
            conn.close()
            return jsonify({'message':'No availabe drivers'}),206
    except Exception as e:
        print(e)
        
        
@app.route('/getAllOrders',methods=["GET"])
def getAllOrders():
    try:
        conn,cursor = db_connect()
        cursor.execute("Select * from NILE.ORDERS as O, NILE.AssignedOrders as A WHERE O.OrderId=A.OrderId AND A.DeliveryDriver is NULL")
        data = cursor.fetchall()
        if(data):
            conn.close()
            return jsonify(data),200
        else:
            conn.close()
            return jsonify({'message':'No orders'}),207
    except Exception as e:
        print(e)
        
@app.route('/assignDriver',methods=["POST"])
def assignDriver():
    try:
        print(request.json)
        conn,cursor = db_connect()
        cursor.execute("Select * from AssignedOrders WHERE OrderId=%s",(request.json['OrderId']))
        data = cursor.fetchall()
        print(data)
        if(data):
            cursor.execute("Update AssignedOrders SET DeliveryDriver=%s WHERE OrderId=%s",(request.json['drivername'],request.json['OrderId']))
            conn.close()
            return jsonify({"message":"Updated Successsfully"}),200
        else:
            conn.close()
            return jsonify({'message':'Failed'}),208
    except Exception as e:
        print(e)
        
@app.route('/getAssignedOrders/<string:driveremail>',methods=["GET"])
def getAssignedOrders(driveremail:str):
    try:
        conn,cursor = db_connect()
        cursor.execute("select * from NILE.AssignedOrders a, NILE.Orders o, NILE.Employees e WHERE a.OrderId=o.OrderId and a.DeliveryDriver=e.FullName and email=%s",(driveremail))
        data = cursor.fetchall()
        if(data):
            conn.close()
            return jsonify(data),200
        else:
            conn.close()
            return jsonify({'message':'No orders'}),209
    except Exception as e:
        print(e)

@app.route('/getAdminDetails',methods = ['GET','POST'])
def getAdminDetails():
    try:
        if request.method == 'GET':
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM AdminDetails where role=%s and verified is null",('admin'))
            data = cursor.fetchall()
            conn.close()
            return jsonify({'result':data,'status code':200})
    except Exception as e:
        print(e)

@app.route('/deleteAdmin', methods = ['POST'])
def deleteAdmin():
    try:
        if request.method == 'POST':
            username = request.json['username']
            conn,cursor = db_connect()
            cursor.execute("DELETE FROM USERS where username = %s and role = %s",(username,'admin'))
            cursor.close()
            conn.close()
            return jsonify({'msg':'Delete successful'})
    except Exception as e:
        print(e)

@app.route('/verifyAdmin', methods = ['POST'])
def verifyAdmin():
    try:
        if request.method == 'POST':
            username = request.json['username']
            conn,cursor = db_connect()
            print(username)
            cursor.execute("UPDATE AdminDetails set verified = %s where username = %s and role = %s and verified is NULL",('verified',username,'admin'))
            cursor.close()
            conn.close()
            return jsonify({'msg':'Verify successful'})
    except Exception as e:
        print(e)


@app.route("/updateUserProfile/<string:username>",methods=["GET","POST"])
def updateUserProfile(username:str):
    # print(request.method)
    if request.method == 'GET':
        conn,cursor = db_connect()
        # print(username)
        cursor.execute("SELECT * FROM USERS where username = %s",(username))
        data = cursor.fetchall()
        if data:
            conn.close()
            if len(data)==1:
                data = data.pop()
            return jsonify({'user':data}),200
        else:
            conn.close()
            return jsonify({'response':205,'username':username,'msg':'User not exists'})
    elif request.method == "POST":
        # print("here in post")
        # print(request.json)
        conn,cursor = db_connect()
        cursor.execute("SELECT * FROM USERS where username = %s",(username))
        data = cursor.fetchall()
        # print(data)
        if data:
            if request.json['password'] is None:
                cursor.execute("UPDATE USERS set FirstName = %s, LastName = %s, Username =%s,ProfilePic=%s where username=%s",(request.json['firstname'],request.json['lastname'],request.json['email'],request.json['profilepic'],username))
                conn.close()
                return jsonify({"message":"Update Successful"}),200
            else:
                cursor.execute("UPDATE USERS set FirstName = %s, LastName = %s, Username =%s,Password=%s,ProfilePic=%s where username=%s",(request.json['firstname'],request.json['lastname'],request.json['email'],request.json['password'],request.json['profilepic'],username));
                conn.close()
                return jsonify({"message":"Update Successful"}),200
        else:
            conn.close()
            return jsonify({'response':205,'username':username,'message':'User not exists'})
        
@app.route('/addService',methods=["POST"])
def addService():
    try:
        conn,cursor = db_connect()
        cursor.execute("SELECT * from Deliveryservices where ServiceName = %s",(request.json["name"]))
        data = cursor.fetchall()
        if data:
            conn.close()
            return jsonify({"message":"Service already in database"}),205
        else:
            cursor.execute("INSERT INTO Deliveryservices Values(%s,%s,%s,%s,%s)",(request.json["name"],request.json["price"],request.json["duration"],request.json["description"],request.json["picture"]))
            conn.close()
            return jsonify({"message":"Service Added."}),200
    except Exception as e:
        print(e)

@app.route('/getServices',methods=["GET"])
def getServices():
    try:
        if request.method == 'GET':
            conn,cursor = db_connect()
            cursor.execute("SELECT * from Deliveryservices")
            data = cursor.fetchall()
            if data:
                conn.close()
                return data,200
            else:
                conn.close()
                return jsonify({"message":"No Services Found"}),205
    except Exception as e:
        print(e)

@app.route('/updateServicePrice',methods=["POST"])
def updateServicePrice():
    try:
        if request.method == 'POST':
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM Deliveryservices where Servicename = %s",(request.json["name"]))
            data = cursor.fetchall()
            if data:
                cursor.execute("UPDATE Deliveryservices set Price=%s where ServiceName = %s",(request.json['price'],request.json["name"]))
                cursor.execute("SELECT * from Deliveryservices")
                data = cursor.fetchall()
                conn.close()
                return data,200
            else:
                conn.close()
                return jsonify({"message":"Delivery Service not found"}),205
    except Exception as e:
        print(e)

@app.route('/getLatLon')
def getLatLon():
    return lat_lon('Bloomington,Indiana')

@app.route('/getDeliveredOrders')
def getDeliveredOrders():
    try:
        conn,cursor = db_connect()
        cursor.execute("SELECT * FROM ORDERS where status='Delivered'")
        data = cursor.fetchall()
        if data:
            conn.close()
            return data,200
        else:
            conn.close()
            return jsonify({'message':'No delivered Orders'}),205
    except Exception as e:
        print(e)

@app.route('/deleteServices',methods=["POST"])
def deleteServices():
    try:
        if request.method == "POST":
            print(request.json["serviceName"])
            conn,cursor = db_connect()
            cursor.execute("DELETE FROM Deliveryservices where Servicename = %s",(request.json["serviceName"]))
            data = cursor.fetchall()
            if data:
                conn.close()
                return jsonify({"message":"Service Deleted"}),200
            else:
                conn.close()
                return jsonify({"message":"No Service found"}),205
    except Exception as e:
        print(e)


if __name__ == "__main__":
    app.run()