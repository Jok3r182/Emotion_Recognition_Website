from typing import Optional

from peewee import *
from pydantic import BaseModel



class DB:
    __instance = None

    @staticmethod
    def getInstance():
        if DB.__instance is None:
            raise Exception("Singleton has not been initialized yet")
        return DB.__instance

    @staticmethod
    def getFirstInstance(user, password, db_name, host):
        if DB.__instance is None:
            DB(user, password, db_name, host)
        return DB.__instance

    def __init__(self, user, password, db_name, host):
        if DB.__instance is not None:
            raise Exception("This class is a singleton!")
        else:
            self.user = user
            self.password = password
            self.db_name = db_name
            self.host = host
            self.db = MySQLDatabase(self.db_name, user=self.user, password=self.password, host=self.host)
            DB.__instance = self

    def get_db(self):
        return self.db

    def start(self):
        class Token(BaseModel):
            access_token: str
            token_type: str

        class TokenData(BaseModel):
            username: Optional[str] = None

        class User(Model):
            username = CharField()
            email = CharField()
            is_active = BooleanField(default=True)

            class Meta:
                database = DB.getInstance().get_db()

        class Images(Model):
            emotionID = IntegerField()
            userID = IntegerField()
            image = Field

            class Meta:
                database = DB.getInstance().get_db()

        class Emotions(Model):
            date = DateField()
            happy = FloatField()
            angry = FloatField()
            disgust = FloatField()
            neutral = FloatField()
            sad = FloatField()
            surprised = FloatField()
            feared = FloatField()

            class Meta:
                database = DB.getInstance().get_db()

        class UserInDB():
            hashed_password: str

        self.db.connect()
        self.db.create_tables([User, Emotions])
