#!/usr/bin/python
import file_utils  # File utility functions
import firebase_admin
from firebase_admin import credentials
import firebase_photos  # Photos collection
import firebase_settings_page  # Settings Page documents
import picamera
import rosebot
import time

class PiTank():
    def __init__(self, photos_manager, settings_page_manager):
        self.photos_manager = photos_manager
        self.settings_page_manager = settings_page_manager
        self.robot = rosebot.RoseBot()

        # Camera setup (CONSIDER: Make this part of the RoseBot class)
        self.camera = picamera.PiCamera()
        self.camera.resolution = (1024, 768)
        
        self.settings_page_manager.add_command_listener(self.handle_command)
        self.settings_page_manager.add_feedback_stream_listener()  # Interestingly no callback is needed
        self.settings_page_manager.add_security_system_listener()  # Interestingly no callback is needed

    def handle_command(self):
        message_type = self.settings_page_manager.command_type
        payload = self.settings_page_manager.command_payload
        print(f'message_type: {message_type}')
        print(f'payload: {payload}')
        if message_type == "takePhoto":
            self.take_photo()

    def take_photo(self):
        filename = file_utils.get_filename()
        self.camera.capture(filename)
        self.photos_manager.add_photo(filename)


if __name__ == '__main__':
    print("Ready")
    # Initialize Firebase
    my_project_id = "fisherds-movie-quotes-571d2"
    # cred = firebase_admin.credentials.Certificate('serviceAccountKey.json')  # Works fine, but has a dependency on where the file is run from.
    cred = credentials.Certificate(f'{file_utils.get_directory()}/serviceAccountKey.json')
    firebase_admin.initialize_app(cred, {"storageBucket": f"{my_project_id}.appspot.com"})

    # Main objects
    photos_manager = firebase_photos.PhotosCollectionManager()
    settings_page_manager = firebase_settings_page.SettingsPageDocumentManager()
    pi_tank = PiTank(photos_manager, settings_page_manager)

    # Helper variables for the main loop
    last_stream_time = time.time()
    last_security_photo_time = time.time()
    while True:
        time.sleep(0.5)  # 2 distance_readings per second
        distance_reading = pi_tank.robot.ultrasonic_sensor.get_distance()
        elapsed_stream_time = time.time() - last_stream_time  # Time since the last feedback stream update
        elapsed_security_photo_time = time.time() - last_security_photo_time  # Time since the security system photo
        print(f"Distance: {round(distance_reading)}  Time: {round(elapsed_security_photo_time)}")
        
        if settings_page_manager.is_feedback_stream_active:            
            if elapsed_stream_time > 1.0:  # Stream every 1.0 seconds
                settings_page_manager.send_feedback_stream_data(distance_reading, round(elapsed_security_photo_time))
                last_stream_time = time.time()

        if settings_page_manager.is_security_system_active:
            if distance_reading < settings_page_manager.distance_threshold:
                if elapsed_security_photo_time > settings_page_manager.time_threshold:
                    print(f"The Security System criteria have been met.  Taking a picture!")
                    pi_tank.take_photo()
