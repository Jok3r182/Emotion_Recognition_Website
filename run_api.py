from fastapi import FastAPI, UploadFile, Depends, HTTPException, File, Body
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette import status
from starlette.requests import Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from core.db.database import User, DB
from passlib.hash import bcrypt
from core.edetection.emotion_detection import EmotionDetector
from configparser import ConfigParser
import cv2
import numpy as np
import jwt
import json


config = ConfigParser()
config.read('config.ini')

JWT_SECRET_KEY = config["DEFAULT"]["JWT_SECRET_KEY"]
ALGORITHM = config["DEFAULT"]["ALGORITHM"]

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')
emotion_detector = EmotionDetector()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="static/templates")

# 78.31.188.217
database = DB(app, 
    config["database"]["username"], 
    config["database"]["password"], 
    config["database"]["host"], 
    config["database"]["port"], 
    config["database"]["db_name"])


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        user = await User.get(id=payload.get('id'))
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid username or password'
        )
    return await DB.User_Pydantic.from_tortoise_orm(user)


@app.get('/')
def index(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.get('/register')
def index(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})


@app.get('/main')
def index(request: Request):
    return templates.TemplateResponse("main.html", {"request": request})


@app.get('/guest')
def index(request: Request):
    return templates.TemplateResponse("main-guest.html", {"request": request})


@app.get('/profile')
def index(request: Request):
    return templates.TemplateResponse("profile.html", {"request": request})


@app.post('/token')
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await database.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid username or password'
        )
    user_obj = await database.User_Pydantic.from_tortoise_orm(user)
    token = jwt.encode(user_obj.dict(), JWT_SECRET_KEY)
    return {'access_token': token, 'token_type': 'bearer'}


@app.get('/token/decode', response_model=database.User_Pydantic)
async def get_user(user: database.User_Pydantic = Depends(get_current_user)):
    return user


@app.post('/user/create')
async def create_user(user: database.User_Pydantic):
    user_obj = User(username=user.username, password_hash=bcrypt.hash(user.password_hash), email=user.email)
    await user_obj.save()
    user_auth = await database.User_Pydantic.from_tortoise_orm(user_obj)
    token = jwt.encode(user_auth.dict(), JWT_SECRET_KEY)
    return {'access_token': token, 'token_type': 'bearer'}


@app.post("/api/member/predict")
async def predict_image(predict_image: UploadFile = File(...), user: database.User_Pydantic = Depends(get_current_user)):
    if user: 
        contents = predict_image.file.read()
        img_np = cv2.imdecode(np.frombuffer(contents, np.uint8), -1)
        faces = emotion_detector.getAllEmotionsFromPicture(img_np)
        faces_to_send = []
        if not faces:
            return {'processed_faces': "No faces found", 'process_status': "Failure"}
        for face in faces:
            faces_to_send.append(face.__dict__)
        return {'processed_faces': json.dumps(faces_to_send), 'process_status': "Success"}
    return {'processed_faces':"Bad token", 'process_status':"Failure"}


@app.post("/api/guest/predict")
def guest_predict_image(predict_image: UploadFile = File(...)):
    contents = predict_image.file.read()
    image = cv2.imdecode(np.frombuffer(contents, np.uint8), -1)
    if image.shape[0] < int(config["DEFAULT"]["guest_image_height"]) and image.shape[1] < int(config["DEFAULT"]["guest_image_width"]):
        faces = emotion_detector.getAllEmotionsFromPicture(image)
        faces_to_send = []
        for face in faces:
            faces_to_send.append(face.__dict__)
        return {'processed_faces': json.dumps(faces_to_send), 'process_status': "Success"}
    return {'processed_faces': "Dimensions needs to be no more than 480 x 720", 'process_status': "Failure"}