from peewee import *

user = 'root'
password = ''
db_name = 'fast_api_emotion_detection'

db = MySQLDatabase(db_name, user=user, password=password, host='localhost')


class User(Model):
    username = CharField()
    password = CharField()
    email = CharField()

    class Meta:
        database = db

class Images(Model):
    emotionID = IntegerField()
    userID = IntegerField()
    image = Field
    class Meta:
        database=db

class Emotions(Model):
    happy = FloatField()
    angry = FloatField()
    disgust = FloatField()
    neutral = FloatField()
    sad = FloatField()
    surprised = FloatField()
    feared = FloatField()

    class Meta:
        database = db


db.connect()
db.create_tables([User, Emotions])
