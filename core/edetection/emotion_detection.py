import numpy as np
import cv2
import tensorflow as tf
import os

os.environ['TF_FORCE_GPU_ALLOW_GROWTH'] = 'true'
os.environ['TF_XLA_FLAGS'] = '--tf_xla_enable_xla_devices'
new_model = tf.keras.models.load_model("../Trained_Models/emotionDetection_InceptionV3.h5")
faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def checkPictureEmotion(img, size):
    frame = img
    grayImg = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale(grayImg, 1.1, 4)
    for x, y, w, h in faces:
        roi_gray = grayImg[y:y + h, x:x + w]
        roi_color = frame[y:y + h, x:x + w]
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
        facess = faceCascade.detectMultiScale(roi_gray)
        if len(facess) == 0:
            print("Veidas nebuvo aptiktas")
        else:
            for (ex, ey, ew, eh) in facess:
                face_roi = roi_color[ey:ey + eh, ex:ex + ew]
    final_image = cv2.resize(face_roi, (size, size))
    final_image = np.expand_dims(final_image, axis=0)
    final_image = final_image / 255.0
    predictions = new_model.predict(final_image)

    if (np.argmax(predictions) == 0):
        status = "Išsigandęs"
    elif (np.argmax(predictions) == 1):
        status = "Linksmas"
    elif (np.argmax(predictions) == 2):
        status = "Liūdnas"
    elif (np.argmax(predictions) == 3):
        status = "Neutralus"
    elif (np.argmax(predictions) == 4):
        status = "Nustebęs"
    elif (np.argmax(predictions) == 5):
        status = "Pasišlykštėjęs"
    elif (np.argmax(predictions) == 6):
        status = "Piktas"
    print(status)
    x = np.argmax(predictions)
    print(predictions[0][x] * 100)


#checkPictureEmotion("../Emotion_Images/surprised1.jpg", 299)
