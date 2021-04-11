from fastapi import FastAPI, UploadFile
import requests

app = FastAPI()

@app.get('/')
def index():
    return "sveiki"

url = 'https://api.imgur.com/3/image2'
myobj = {'somekey': 'somevalue'}

x = requests.post(url, data = myobj)

print(x.text)