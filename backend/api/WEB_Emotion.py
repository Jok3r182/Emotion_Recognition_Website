from fastapi import FastAPI, UploadFile
import requests

app = FastAPI()

@app.get('/')
def index():
    return "sveiki"
