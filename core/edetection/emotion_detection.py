import numpy as np
import cv2
import tensorflow as tf
from configparser import ConfigParser

config = ConfigParser()
config.read("./config.ini")

class Face:
    mapped_faces = {
        0: "Feared",
        1: "Happy",
        2: "Sad",
        3: "Neutral",
        4: "Surprised",
        5: "Disgusted",
        6: "Angry"
    }

    def __init__(self):
        self.emotions = {
            "Feared": 0,
            "Happy": 0,
            "Sad": 0,
            "Neutral": 0,
            "Surprised": 0,
            "Disgusted": 0,
            "Angry": 0
        }
        self.predicted_emotion = None
        self.face_coords = None

    def setCoords(self, coords):
        self.face_coords = coords

    def setPredicted(self, prediction):
        self.predicted_emotion = Face.mapped_faces[prediction]

    def setProbability(self, index, probability):
        self.emotions[self.mapped_faces[index]] = probability


class EmotionDetector:
    def __init__(self):
        self.new_model = tf.keras.models.load_model(config["emotion_detection"]["model_location"])
        self.faceCascade = cv2.CascadeClassifier(config["emotion_detection"]["haar_location"])

    def getFacesInPicture(self, img):
        grayImg = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = self.faceCascade.detectMultiScale(grayImg, 
            float(config["emotion_detection"]["multiscale_scaleFactor"]), 
            int(config["emotion_detection"]["multiscale_minNeighbors"]))
        return faces

    def getEmotionFromFace(self, img, size):
        final_image = cv2.resize(img, (size, size))
        final_image = np.expand_dims(final_image, axis=0)
        final_image = final_image / 255.0
        predictions = self.new_model.predict(final_image)
        return predictions

    def getProcessedFace(self, face, img, size):
        new_face = Face()
        new_face.setCoords(face)
        predictions = self.getEmotionFromFace(img, size)
        for count, value in enumerate(predictions[0]):
            new_face.setProbability(count, float(value))
        predicted = np.argmax(predictions)
        new_face.setPredicted(predicted)
        return new_face

    def getAllEmotionsFromPicture(self, img):
        faces = self.getFacesInPicture(img)
        frame = img
        face_list = []
        for (x, y, w, h) in faces:
            roi_color = frame[y:y + h, x:x + w]
            face_list.append(self.getProcessedFace([float(x), float(y), float(w), float(h)], 
                roi_color, 
                int(config["emotion_detection"]["image_size"])))
        return face_list
