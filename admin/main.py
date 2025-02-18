import json
import PIL
import PIL.Image
import boto3.session
from flask import Flask, render_template, request, Response, redirect, url_for
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import os
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError, SSLError
import firebase_admin
from firebase_admin import firestore, credentials
from firebase_admin import exceptions as FB_EXCEPTION
from google.api_core import exceptions as GOOGLE_EXCEPTION
from datetime import datetime

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
    objects = []

    tag = request.args.get("tag")
    if tag:
        db_objects = (
            db.collection(os.getenv("PREFIX"))
            .where("tags", "array_contains", tag)
            .order_by("date", direction=firestore.Query.DESCENDING)
            .stream()
        )
    else:
        db_objects = (
            db.collection(os.getenv("PREFIX"))
            .order_by("date", direction=firestore.Query.DESCENDING)
            .stream()
        )

    for object in db_objects:
        name = object.id
        path = name.split(".")[0]
        ext = name.split(".")[-1]
        img = f"{path}/{path}-512.{ext}"

        obj = object.to_dict()
        date = datetime.fromtimestamp(float(float(str(obj["date"])[:10]))).strftime(
            "%d/%m/%Y"
        )

        objects.append({"name": name, "img": img, **obj, "date": date})

    return render_template(
        "Index.html",
        objects=objects,
        page_title="Home",
        s3_endpoint=os.getenv("AWS_ENDPOINT"),
        s3_bucket=os.getenv("AWS_BUCKET"),
    )


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
    tags = request.form.get("tags").split(",") or []
    if not tags or tags == "" or tags[0] == "":
        tags = []
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
    except (
        FB_EXCEPTION.ConflictError,
        FB_EXCEPTION.AlreadyExistsError,
        GOOGLE_EXCEPTION.AlreadyExists,
    ) as e:
        Image.close()
        os.remove(os.path.join(app.config["UPLOAD_FOLDER"], filename))
        return Response(
            json.dumps({"status": "error", "message": f"FIRESTORE ERR: {e}"}), 400
        )

    file_path = filename.split(".")[0]
    file_ext = filename.split(".")[-1]

    temp_file = open(os.path.join(app.config["UPLOAD_FOLDER"], filename), "rb")
    s3OrigFileResponse = upload_file(
        temp_file, os.getenv("AWS_BUCKET"), f"{file_path}/{filename}", file.mimetype
    )
    if s3OrigFileResponse is not True:
        return Response(
            json.dumps({"status": "error", "message": f"S3 ERR: {s3OrigFileResponse}"}),
            500,
        )
    temp_file.close()

    size = 512, 512
    Image.thumbnail(size, PIL.Image.Resampling.LANCZOS)
    Image.save(os.path.join(app.config["UPLOAD_FOLDER"], f"{file_path}-512.{file_ext}"))
    Image.close()

    temp_file = open(
        os.path.join(app.config["UPLOAD_FOLDER"], f"{file_path}-512.{file_ext}"), "rb"
    )
    s3BlurFileResponse = upload_file(
        temp_file,
        os.getenv("AWS_BUCKET"),
        f"{file_path}/{file_path}-512.{file_ext}",
        file.mimetype,
    )
    if s3BlurFileResponse is not True:
        db.collection(os.getenv("PREFIX")).document(
            request.files["file"].filename
        ).delete()
        s3.delete_object(Bucket=os.getenv("AWS_BUCKET"), Key=f"{file_path}/{filename}")
        s3.delete_object(
            Bucket=os.getenv("AWS_BUCKET"),
            Key=f"{file_path}/{file_path}-512.{file_ext}",
        )
        s3.delete_object(Bucket=os.getenv("AWS_BUCKET"), Key=f"{file_path}/")
        return Response(
            json.dumps({"status": "error", "message": f"S3 ERR: {s3BlurFileResponse}"}),
            500,
        )
    temp_file.close()

    os.remove(os.path.join(app.config["UPLOAD_FOLDER"], filename))
    os.remove(os.path.join(app.config["UPLOAD_FOLDER"], f"{file_path}-512.{file_ext}"))

    return {"status": "ok", "message": "Uploaded"}


@app.route("/edit/<string:id>", methods=["GET"])
def Edit(id):
    document = db.collection(os.getenv("PREFIX")).document(id).get()
    if document.exists:
        name = document.id
        path = name.split(".")[0]
        ext = name.split(".")[-1]
        img = f"{path}/{path}-512.{ext}"

        obj = document.to_dict()
        tags = obj["tags"]
        if not tags or tags == "" or tags[0] == "":
            tags = []
        urls = obj["urls"]
        date = datetime.fromtimestamp(float(float(str(obj["date"])[:10]))).strftime(
            "%d/%m/%Y"
        )
        alt = obj["alt"]
        return render_template(
            "edit.html",
            name=name,
            img=img,
            tags=":".join(tags),
            urls=urls,
            date=date,
            alt=alt,
            page_title=f"Edit - {name}",
            s3_endpoint=os.getenv("AWS_ENDPOINT"),
            s3_bucket=os.getenv("AWS_BUCKET"),
        )
    else:
        return redirect(url_for("Home"))


@app.route("/api/delete/<string:file>", methods=["DELETE"])
def ApiDelete(file):
    file_name = file.split(".")[0]
    file_ext = file.split(".")[-1]

    db.collection(os.getenv("PREFIX")).document(file).delete()
    s3.delete_object(Bucket=os.getenv("AWS_BUCKET"), Key=f"{file_name}/{file}")
    s3.delete_object(
        Bucket=os.getenv("AWS_BUCKET"), Key=f"{file_name}/{file_name}-512.{file_ext}"
    )
    s3.delete_object(Bucket=os.getenv("AWS_BUCKET"), Key=f"{file_name}/")
    return Response(json.dumps({"status": "ok", "message": f"deleted {file}"}), 200)


@app.route("/api/edit/<string:file>", methods=["PUT"])
def ApiUpdate(file):
    tags = request.form.get("tags").split(",") or []
    if not tags or tags == "" or tags[0] == "":
        tags = []
    urls = []
    for url in request.form.get("urls").split(";"):
        if url == "":
            continue
        urls.append(json.loads(url))

    db.collection(os.getenv("PREFIX")).document(file).update(
        {
            "alt": request.form.get("alt"),
            "date": int(request.form.get("date")),
            "tags": tags,
            "urls": urls,
        }
    )
    return Response(json.dumps({"status": "ok", "message": f"updated {file}"}), 200)
