from fastapi import FastAPI, UploadFile
from backend.db.database import DB
import requests

app = FastAPI()
db = DB.getFirstInstance('root', "", 'fast_api_emotion_detection', '78.31.188.217')
db.start()

@app.get('/')
def index():
    return "sveiki"