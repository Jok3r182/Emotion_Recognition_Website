from re import template
from fastapi import FastAPI, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.requests import Request
from core.db.database import DB
import requests
SECRET_KEY = "966a2c7fe681ab441ef5efcb7ccdfcd19639c13fd6e923cde688617f2f528976"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30



app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="static/templates")

db = DB.getFirstInstance('root', "", 'fast_api_emotion_detection', '78.31.188.217')
db.start()


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



