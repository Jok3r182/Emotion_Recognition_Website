from fastapi import FastAPI, UploadFile, Depends, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette import status
from starlette.requests import Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from core.db.database import User, DB
from passlib.hash import bcrypt
import jwt

JWT_SECRET_KEY = "966a2c7fe681ab441ef5efcb7ccdfcd19639c13fd6e923cde688617f2f528976"
ALGORITHM = "HS256"

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="static/templates")
# 78.31.188.217
database = DB(app, 'root', '', '78.31.188.217', '3306', 'fast_api_emotion_detection')


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


@app.post('/users')
async def create_user(user: database.User_Pydantic):
    user_obj = User(username=user.username, password_hash=bcrypt.hash(user.password_hash), email=user.email)
    await user_obj.save()
    user_auth = await database.User_Pydantic.from_tortoise_orm(user_obj)
    token = jwt.encode(user_auth.dict(), JWT_SECRET_KEY)
    return {'access_token': token, 'token_type': 'bearer'}
