from peewee import *

class User(Model):
        username = CharField()
        password = CharField()
        email = CharField()
        class Meta:
            database = Database.db

class Images(Model):
    emotionID = IntegerField()
    userID = IntegerField()
    image = Field
    class Meta:
        database = Database.db

class Emotions(Model):
    happy = FloatField()
    angry = FloatField()
    disgust = FloatField()
    neutral = FloatField()
    sad = FloatField()
    surprised = FloatField()
    feared = FloatField()
    class Meta:
        database = Database.db

class Database:
    def __init__(self, user, password, db_name, host):
        self.user = user
        self.password = password
        self.db_name = db_name
        self.host = host
        self.db = MySQLDatabase(db_name, user=user, password=password, host=host)
        
    def start(self):
        self.db.connect()
        self.db.create_tables([User, Emotions])

