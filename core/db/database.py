from fastapi import Form
from tortoise.contrib.fastapi import register_tortoise
from tortoise.models import Model
from tortoise import fields
from passlib.hash import bcrypt
from tortoise.contrib.pydantic import pydantic_model_creator


class DB:
    User_Pydantic = None

    def __init__(self, app, username, password, host, port, db_name):
        DATABASE_URL = "mysql://{}:{}@{}:{}/{}".format(
            username,
            password,
            host,
            port,
            db_name
        )
        register_tortoise(app,
                          db_url=DATABASE_URL,
                          modules={'models': ['core.db.database']},
                          generate_schemas=True,
                          add_exception_handlers=True)
        DB.User_Pydantic = pydantic_model_creator(User, name='User')

    async def authenticate_user(self, username, password):
        user = await User.get(username=username)
        if not user:
            return False
        if not user.verify_password(password):
            return False
        return user


class User(Model):
    id = fields.IntField(pk=True, index=True)
    username = fields.CharField(50, unique=True)
    email = fields.CharField(255)
    password_hash = fields.CharField(128)

    def verify_password(self, password):
        return bcrypt.verify(password, self.password_hash)


class Images(Model):
    emotionID = fields.IntField()
    userID = fields.IntField()
    image = fields.Field


class Emotions(Model):
    id = fields.IntField(pk=True, index=True)
    date = fields.DateField()
    happy = fields.FloatField()
    angry = fields.FloatField()
    disgust = fields.FloatField()
    neutral = fields.FloatField()
    sad = fields.FloatField()
    surprised = fields.FloatField()
    feared = fields.FloatField()


class UserForm:

    def __init__(
            self,
            username: str = Form(...),
            password: str = Form(...),
            email: str = Form(...),
    ):
        self.username = username
        self.password = password
        self.email = email
