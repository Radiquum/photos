import json
import boto3.session
from flask import Flask, render_template, request
from dotenv import load_dotenv
import os
import boto3

load_dotenv()
app = Flask(__name__)

session = boto3.session.Session()
s3 = session.client(
    service_name='s3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    endpoint_url=os.getenv('AWS_ENDPOINT'),
)

@app.route('/')
def Home():
    # objects = s3.list_objects(Bucket=os.getenv("AWS_BUCKET"))['Contents']
    # return render_template("Index.html", objects=objects)
    return render_template("Index.html", page_title="Home")

@app.route('/upload/')
def Upload():
    return render_template("Upload.html", page_title="Upload")

@app.route('/api/upload/', methods=['POST'])
def ApiUpload():
    print(request.files['file'])
    print(request.form)
    return {"status": "ok", "message": "Uploaded"}