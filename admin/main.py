import json
import PIL
import PIL.Image
import boto3.session
from flask import Flask, render_template, request, Response
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import os
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError, SSLError
import firebase_admin
from firebase_admin import firestore, credentials, exceptions

load_dotenv()
UPLOAD_FOLDER = "./temp"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

s3 = boto3.client(
    service_name="s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    endpoint_url=os.getenv("AWS_ENDPOINT"),
    config=Config(s3={"request_checksum_calculation": "when_required"}),
)

cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT"))
firebase_admin.initialize_app(cred)
db = firestore.client()


@app.route("/")
def Home():
    from urllib.request import urlopen

    print(urlopen("https://www.howsmyssl.com/a/check").read())
    # objects = s3.list_objects(Bucket=os.getenv("AWS_BUCKET"))['Contents']
    # return render_template("Index.html", objects=objects)
    return render_template("Index.html", page_title="Home")


@app.route("/upload/")
def Upload():
    return render_template("Upload.html", page_title="Upload")


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_file(file, bucket, key, mimetype) -> bool | Exception:
    CHUNK_SIZE = 1024 * 1024 * 4
    uploaded_parts = []
    try:
        __upload = s3.create_multipart_upload(
            ACL="public-read",
            Bucket=bucket,
            Key=key,
            ContentType=mimetype,
        )
        isFileRead = False
        part_num = 1
        while not isFileRead:
            chunk = file.read(CHUNK_SIZE)
            if len(chunk) == 0:
                isFileRead = True
                s3.complete_multipart_upload(
                    Bucket=bucket,
                    Key=key,
                    UploadId=__upload["UploadId"],
                    MultipartUpload={"Parts": uploaded_parts},
                )
                break

            try:
                part = s3.upload_part(
                    Bucket=bucket,
                    Key=key,
                    PartNumber=part_num,
                    ContentLength=len(chunk),
                    UploadId=__upload["UploadId"],
                    Body=chunk,
                )
                uploaded_parts.append({"ETag": part["ETag"], "PartNumber": part_num})
                part_num += 1
            except (ClientError, SSLError) as e:
                s3.abort_multipart_upload(
                    Bucket=bucket,
                    Key=key,
                    UploadId=__upload["UploadId"],
                )
                return e
    except (ClientError, SSLError) as e:
        return e

    return True


@app.route("/api/upload/", methods=["POST"])
def ApiUpload():
    tags = request.form.get("tags").split(",")
    urls = []
    for url in request.form.get("urls").split(";"):
        if url == "":
            continue
        urls.append(json.loads(url))

    file = request.files.get("file")

    if file.filename == "":
        return Response(
            '{"status": "error", "message": "FLASK ERR: GET FILE ERROR"}', 500
        )
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
    else:
        return Response(
            '{"status": "error", "message": "FLASK ERR: UNSUPPORTED EXTENSION"}', 500
        )

    Image = PIL.Image.open(os.path.join(app.config["UPLOAD_FOLDER"], filename))
    TMP_FILE = open(os.path.join(app.config["UPLOAD_FOLDER"], filename), "rb")
    file_path = filename.split(".")[0]
    file_ext = filename.split(".")[-1]

    s3OrigFileResponse = upload_file(
        TMP_FILE, os.getenv("AWS_BUCKET"), f"{file_path}/{filename}", file.mimetype
    )
    if s3OrigFileResponse is not True:
        return Response(
            json.dumps({"status": "error", "message": f"S3 ERR: {s3OrigFileResponse}"}),
            500,
        )

    try:
        db.collection(os.getenv("PREFIX")).add(
            {
                "mimetype": file.mimetype,
                "width": Image.width,
                "height": Image.height,
                "date": int(request.form.get("date")),
                "alt": request.form.get("alt") or "",
                "tags": tags or [],
                "urls": urls or [],
            },
            request.files["file"].filename,
        )
    except exceptions.CONFLICT:
        return Response(
            '{"status": "error", "message": "FIRESTORE ERR: CONFLICT"}', 400
        )

    return {"status": "ok", "message": "Uploaded"}
