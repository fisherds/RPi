from datetime import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage
import pytz
import rosebot
import threading
import json
import time
        
class PicturesCollectionManager():
    COLLECTION_PICS = "Pictures"
    KEY_PIC_URL = "url"
    KEY_PIC_CAPTION = "caption"
    KEY_PIC_LAST_TOUCHED = "lastTouched"
    
    """ Handles Firestore interactions for Picture objects. """
    def __init__(self):
        self.ref = firestore.client().db.collection(self.COLLECTION_PICS)
        self.callback_done = threading.Event()

        # Coming later
        self.bucket = storage.bucket()

    def send_picture(picture, caption):
        ref_pictures_collection.add({
            self.KEY_PIC_CAPTION: caption,
            self.KEY_PIC_URL: "image/no_photo_available.png",
            self.KEY_PIC_LAST_TOUCHED: firestore.SERVER_TIMESTAMP
        })


class SettingsManager():
    """ Handles Firestore interactions for the 3 documents in the SettingsPage collection. """
    COLLECTION_SETTINGS_PAGE = "SettingsPage"
    DOC_COMMAND_ID = "command"
    KEY_COMMAND_TYPE = "type"
    KEY_COMMAND_PAYLOAD = "payload" #Unused
    KEY_COMMAND_TIMESTAMP = "timestamp"

    DOC_READING_ID = "reading"
    KEY_READING_DISTANCE = "distance"
    KEY_READING_TIMESTAMP = "timestamp"

    DOC_SETTINGS_ID = "settings"
    KEY_SETTINGS_DISTANCE_CM = "distanceCm"
    KEY_SETTINGS_COOL_DOWN_TIME_S = "coolDownTimeS"
    KEY_SETTINGS_IS_STEAMING = "isStreaming"
    KEY_SETTINGS_IS_MONITORING = "isMonitoring"
    
    def __init__(self):
        # Reading doc
        self.reading = -1

        # Command doc
        self.command_type = ""
        self.command_payload = None
        
        # Settings doc
        self.distance_threshold_cm = 70
        self.cool_down_time_s = 3600
        self.is_streaming = False
        self.is_monitoring = False
        
        self.ref_command_doc = firestore.client().db.collection(self.COLLECTION_SETTINGS_PAGE).document(self.DOC_COMMAND_ID)
        self.ref_reading_doc = firestore.client().db.collection(self.COLLECTION_SETTINGS_PAGE).document(self.DOC_READING_ID)
        self.ref_settings_doc = firestore.client().db.collection(self.COLLECTION_SETTINGS_PAGE).document(self.DOC_SETTINGS_ID)
        self.callback_done = threading.Event()

    # Readings - The Pi sends readings (no need to listen for them)
    def send_reading(reading):
        self.ref_reading_doc.set({
            self.KEY_READING_DISTANCE: reading,
            self.KEY_READING_TIMESTAMP: firestore.SERVER_TIMESTAMP
        })

    # Commands - The Pi listens for commands (no need to send them)
    def add_command_listener(self, callback):
        self.command_callback = callback
        self.ref_command_doc.on_snapshot(lambda docs, changes, read_time: self.on_command_snapshot(docs))

    def on_command_snapshot(self, docs):
        for doc in docs:
            if doc.exists:
                doc_data = doc.to_dict()
                self.command_type = doc_data.get(self.KEY_COMMAND_TYPE)
                self.command_payload = doc_data.get(self.KEY_COMMAND_PAYLOAD)
                if self.command_payload is not None:
                    print(f"json parse the payload {self.command_payload}")
                    self.command_payload = json.loads(self.command_payload)
                if self.command_callback is not None:
                    self.command_callback()
        self.callback_done.set()
    
    # Settings - The Pi listens for settings (no need to send them)
    def add_settings_listener(self, callback):
        self.settings_callback = callback
        self.ref_settings_doc.on_snapshot(lambda docs, changes, read_time: self.on_settings_snapshot(docs))

    def on_settings_snapshot(self, docs):
        for doc in docs:
            if doc.exists:
                doc_data = doc.to_dict()
                self.distance_threshold_cm = doc_data.get(self.KEY_SETTINGS_DISTANCE_CM)
                self.cool_down_time_s = doc_data.get(self.KEY_SETTINGS_COOL_DOWN_TIME_S)
                self.is_streaming = doc_data.get(self.KEY_SETTINGS_IS_STEAMING)
                self.is_monitoring = doc_data.get(self.KEY_SETTINGS_IS_MONITORING)
                if self.settings_callback is not None:
                    self.settings_callback()
        self.callback_done.set()


class PiTank():
    def __init__(self, pic_manager, settings_manager):
        self.pic_manager = pic_manager
        self.settings_manager = settings_manager
        self.robot = rosebot.RoseBot()
        self.pic_manager.startListening(self.handleCommand)
        self.settings_manager.startListeningForCommands(self.handleCommand)
        self.settings_manager.startListeningForSettings()  # Interestingly no callback is needed

    def handle_command(self):
        message_type = self.settings_manager.command_type
        payload = self.settings_manager.command_payload
        print(f'message_type: {message_type}')
        print(f'payload: {payload}')
        if message_type == "takePhoto":
            self.pic_manager.send_picture()

    def take_picture():
        tz_NY = pytz.timezone('America/New_York') 
        datetime_NY = datetime.now(tz_NY)
        caption = f"NY time: {datetime_NY.strftime('%H:%M:%S')}"

        print("TODO: Take and send a picture to the Firestore", caption)
        picture = None
        return caption, picture


if __name__ == '__main__':
    # Initialize Firebase
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'fisherds-bucket.appspot.com'
    })

    # Main objects
    pic_manager = PicturesCollectionManager()
    settings_manager = SettingsDocumentManager()
    robot = PiTank(pic_manager, settings_manager)

    # Helper variables for the main loop
    last_stream_time = 0
    last_monitor_time = 0
    while True:
        time.sleep(0.5)  # 2 readings per second
        reading = robot.ultrasonic.get_distance()
        
        if settings_manager.is_streaming:
            elapsed_stream_time = time.time() - last_stream_time
            if elapsed_stream_time > 1.5:  #  Stream every 1.5 seconds
                print(f"Sent reading {reading} @ {round(time.time())}")
                settings_manager.send_reading(reading)
                last_stream_time = time.time()

        if settings_manager.is_monitoring:          
            if reading < settings_manager.distance_threshold_cm:
                elapsed_monitor_time = time.time() - last_monitor_time
                if elapsed_stream_time > settings_manager.cool_down_time_s:
                    print(f"Sent reading {reading} @ {round(time.time())}")
                    (picture, caption) = robot.take_picture()
                    pic_manager.send_picture(picture)
                    last_monitor_time = time.time()
