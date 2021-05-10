from datetime import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage
# from google.cloud import storage
import os
import pytz
import rosebot
import threading
import json
import time
        
class PhotosCollectionManager():
    COLLECTION_PHOTOS = "Photos"
    KEY_PHOTO_URL = "url"
    KEY_PHOTO_CAPTION = "caption"
    KEY_PHOTO_CREATED = "created"
    
    """ Handles Firestore interactions for Photo objects. """
    def __init__(self):
        self.ref = firestore.client().collection(self.COLLECTION_PHOTOS)
        self._callback_done = threading.Event()

    def send_photo(self, photoFilename, caption):
        print(f"Uploading photo with caption {caption}")
        document_timestamp, doc_reference = self.ref.add({
            self.KEY_PHOTO_CAPTION: caption,
            self.KEY_PHOTO_CREATED: firestore.SERVER_TIMESTAMP
        })
        print("Document ID: ", doc_reference.id)
        
        try:
            image_blob = storage.bucket().blob(f"photos/{doc_reference.id}")
            image_path = "/home/pi/VSCode/InitialLearning/PythonLearning/FirestoreViaPython/tank/testimage.jpeg"        
            image_blob.upload_from_filename(image_path)
            image_blob.make_public()

        except Exception as err:
            print("An exception occurred during upload", err)
    
        print("File uploaded", image_blob.public_url)

        # Save a Firestore document for the photo
        doc_reference.update({
            self.KEY_PHOTO_URL: image_blob.public_url,
        })


class SettingsPageDocumentManager():
    """ Handles Firestore interactions for the 3 documents in the SettingsPage collection. """
    
    COLLECTION_SETTINGS_PAGE = "SettingsPage"
    # Manual Command document
    DOC_ID_MANUAL_COMMAND = "manualCommand"
    KEY_MANUAL_COMMAND_TYPE = "type"
    VALUE_MANUAL_COMMAND_TAKE_PHOTO_TYPE = "takePhoto"
    KEY_MANUAL_COMMAND_PAYLOAD = "payload"  # Unused
    KEY_MANUAL_COMMAND_TIMESTAMP = "timestamp"  # Unused
    # Feedback Stream document
    DOC_ID_FEEDBACK_STREAM = "feedbackStream"
    KEY_FEEDBACK_STREAM_IS_ACTIVE = "isActive"
    KEY_FEEDBACK_STREAM_CURRENT_DISTANCE = "currentDistance"
    KEY_FEEDBACK_STREAM_TIME_SINCE_LAST_SECURITY_PHOTO = "currentTime"
    # Security System document
    DOC_ID_SECURITY_SYSTEM = "securitySystem"
    KEY_SECURITY_SYSTEM_IS_ACTIVE = "isActive"
    KEY_SECURITY_SYSTEM_DISTANCE_THRESHOLD = "distanceThreshold"
    KEY_SECURITY_SYSTEM_COOL_DOWN_TIME_THRESHOLD = "timeThreshold"
    
    def __init__(self):
        # Command doc
        self.command_type = ""
        self.command_payload = None

        # Feedback Stream doc
        self.is_feedback_stream_active = False
        self.stream_current_distance = -1
        self.stream_current_time = -1

        # Security System doc
        self.is_security_system_active = False
        self.distance_threshold = 70
        self.time_threshold = 3600
        
        # Internal variables.
        self._ref_manual_command = firestore.client().collection(self.COLLECTION_SETTINGS_PAGE).document(self.DOC_ID_MANUAL_COMMAND)
        self._ref_feedback_stream = firestore.client().collection(self.COLLECTION_SETTINGS_PAGE).document(self.DOC_ID_FEEDBACK_STREAM)
        self._ref_security_system = firestore.client().collection(self.COLLECTION_SETTINGS_PAGE).document(self.DOC_ID_SECURITY_SYSTEM)
        self._callback_done = threading.Event()

    # Commands - The Pi listens for commands (no need to send them)
    def add_command_listener(self, callback):
        """ Method used to setup listening for commands.  Usage:
            self.settings_page_manager.add_command_listener(lambda: self.handle_command())

            def handle_command(self):
                message_type = self.settings_page_manager.command_type
                payload = self.settings_page_manager.command_payload
                # Do stuff with the command
        """
        self.command_callback = callback
        self._ref_manual_command.on_snapshot(lambda docs, changes, read_time: self._on_command_snapshot(docs))

    def _on_command_snapshot(self, docs):
        for doc in docs:
            if doc.exists:
                doc_data = doc.to_dict()
                self.command_type = doc_data.get(self.KEY_MANUAL_COMMAND_TYPE)
                self.command_payload = doc_data.get(self.KEY_MANUAL_COMMAND_PAYLOAD)
                if self.command_payload is not None:
                    print(f"json parse the payload {self.command_payload}")
                    self.command_payload = json.loads(self.command_payload)
                if self.command_callback is not None:
                    self.command_callback() # Calls your callback, so you know a command arrived.
        self._callback_done.set()

    # Feedback Stream - The Pi listens for the isActive boolean and sends feedback data
    def add_feedback_stream_listener(self, callback=None):
        """ Method used to setup listening for the Feedback Stream document.  
            Note: You probably don't need the callback in this method, just here for consistency.
        Usage:
            self.settings_page_manager.add_feedback_stream_listener(None)

            while True:
                if self.settings_page_manager.is_feedback_stream_active:
                    # Do stuff that 
        """
        self.feedback_stream_callback = callback
        self._ref_feedback_stream.on_snapshot(lambda docs, changes, read_time: self._on_feedback_stream_snapshot(docs))

    def _on_feedback_stream_snapshot(self, docs):
        for doc in docs:
            if doc.exists:
                doc_data = doc.to_dict()
                self.is_feedback_stream_active = doc_data.get(self.KEY_FEEDBACK_STREAM_IS_ACTIVE)
                # Note: a callback is probably not useful for this one, just the boolean value.
                if self.feedback_stream_callback is not None:
                    self.feedback_stream_callback() # Calls your callback, so you know a command arrived.
        self._callback_done.set()

    def send_feedback_stream_data(self, distance, time):
        self._ref_feedback_stream.update({
            self.KEY_FEEDBACK_STREAM_CURRENT_DISTANCE: round(distance),
            self.KEY_FEEDBACK_STREAM_TIME_SINCE_LAST_SECURITY_PHOTO: time
        })
    
    # Security System - The Pi listens for Security System settings (no need to send them)
    def add_security_system_listener(self, callback=None):
        """ Method used to setup listening for the Feedback Stream document.  
            Note: You probably don't need the callback in this method, just here for consistency.
        Usage:
            self.settings_page_manager.add_feedback_stream_listener(None)

            while True:
                if self.settings_page_manager.is_feedback_stream_active:
                    # Do stuff that 
        """
        self.security_system_callback = callback
        self._ref_security_system.on_snapshot(lambda docs, changes, read_time: self._on_security_system_snapshot(docs))

    def _on_security_system_snapshot(self, docs):
        for doc in docs:
            if doc.exists:
                doc_data = doc.to_dict()
                self.is_security_system_active = doc_data.get(self.KEY_SECURITY_SYSTEM_IS_ACTIVE)
                self.distance_threshold = float(doc_data.get(self.KEY_SECURITY_SYSTEM_DISTANCE_THRESHOLD))
                self.time_threshold = int(doc_data.get(self.KEY_SECURITY_SYSTEM_COOL_DOWN_TIME_THRESHOLD))
                # Note: a callback is probably not useful for this one, just the values.
                if self.security_system_callback is not None:
                    self.security_system_callback()
        self._callback_done.set()


class PiTank():
    def __init__(self, photos_manager, settings_page_manager):
        self.photos_manager = photos_manager
        self.settings_page_manager = settings_page_manager
        self.robot = rosebot.RoseBot()
        
        self.settings_page_manager.add_command_listener(self.handle_command)
        self.settings_page_manager.add_feedback_stream_listener()  # Interestingly no callback is needed
        self.settings_page_manager.add_security_system_listener()  # Interestingly no callback is needed

    def handle_command(self):
        message_type = self.settings_page_manager.command_type
        payload = self.settings_page_manager.command_payload
        print(f'message_type: {message_type}')
        print(f'payload: {payload}')
        if message_type == "takePhoto":
            photo, caption = self.take_photo()
            self.photos_manager.send_photo(photo, caption)

    def take_photo(self):
        """ Returns a photo and a caption. """
        tz_NY = pytz.timezone('America/New_York') 
        datetime_NY = datetime.now(tz_NY)
        caption = f"{datetime_NY.strftime('%A, %b %d %Y @ %l:%M:%S %p')}"

        print("TODO: Take and send a photo to the Firestore", caption)
        photoFilename = None
        return photoFilename, caption


if __name__ == '__main__':
    print("Initialize Firebase4")
    # Initialize Firebase
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'fisherds-movie-quotes-571d2.appspot.com'
    })

    # Main objects
    photos_manager = PhotosCollectionManager()
    settings_page_manager = SettingsPageDocumentManager()
    pi_tank = PiTank(photos_manager, settings_page_manager)

    # Helper variables for the main loop
    last_stream_time = time.time()
    last_security_photo_time = time.time()
    while True:
        time.sleep(0.5)  # 2 distance_readings per second
        distance_reading = pi_tank.robot.ultrasonic_sensor.get_distance()
        elapsed_stream_time = time.time() - last_stream_time  # Time since the last feedback stream update
        elapsed_security_photo_time = time.time() - last_security_photo_time  # Time since the security system photo
        
        if settings_page_manager.is_feedback_stream_active:            
            if elapsed_stream_time > 1.0:  # Stream every 1.0 seconds
                print(f"Sent distance_reading {distance_reading} @ {round(elapsed_security_photo_time)}")
                settings_page_manager.send_feedback_stream_data(distance_reading, round(elapsed_security_photo_time))
                last_stream_time = time.time()

        if settings_page_manager.is_security_system_active:
            print("SS Distance:", distance_reading, settings_page_manager.distance_threshold)
            if distance_reading < settings_page_manager.distance_threshold:
                print("SS Time:", elapsed_security_photo_time, settings_page_manager.time_threshold)
                if elapsed_security_photo_time > settings_page_manager.time_threshold:
                    print(f"The Security System criteria have been met.  Taking a picture!")
                    (photo, caption) = pi_tank.take_photo()
                    photos_manager.send_photo(photo, caption)
                    last_security_photo_time = time.time()
