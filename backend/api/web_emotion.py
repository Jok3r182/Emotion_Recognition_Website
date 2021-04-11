from fastapi import FastAPI, UploadFile
import requests
from backend.db import database

app = FastAPI()
db = database.Database('root', "", 'fast_api_emotion_detection', '78.31.188.217')
db.start()

@app.get('/')
def index():
    return "sveiki"
