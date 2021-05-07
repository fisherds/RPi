import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage
import rosebot
import threading
import json
import time


class PiTank():
    def __init__(self):
        self.robot = rosebot.RoseBot()
        cred = credentials.Certificate('serviceAccountKey.json')
        firebase_admin.initialize_app(cred)
        self.db = firestore.client()
        self.addCommandListener()

    def addCommandListener(self):
        # Create an Event for notifying main thread.
        self.callback_done = threading.Event()
        ref = self.db.collection(u"Commands").document(u"command")
        doc_watch = ref.on_snapshot(lambda docs, changes, read_time: self.on_command_snapshot(docs))

    def on_command_snapshot(self, docs):
        for doc in docs:
            if doc.exists:
                doc_data = doc.to_dict()
                message_type = doc_data.get("type")
                payload = doc_data.get("payload")
                if payload is not None:
                    print(f"json parse the payload {payload}")
                    payload = json.loads(payload)
                self.handle_command(message_type, payload)
        self.callback_done.set()

    def handle_command(self, message_type, payload):
        print(f'message_type: {message_type}')
        print(f'payload: {payload}')
        if message_type == "motor/go":
            left_wheel_speed = payload[0]
            right_wheel_speed = payload[0]
            # print(f"Motor go @ {left_wheel_speed}, {right_wheel_speed}")
            left_wheel_speed = round(left_wheel_speed / 255 * 100)
            right_wheel_speed = round(right_wheel_speed / 255 * 100)
            self.robot.drive_system.go(left_wheel_speed, right_wheel_speed)
        elif message_type == "motor/stop":
            # print("Motor stop")
            self.robot.drive_system.stop()


if __name__ == '__main__':
    PiTank()

    while True:
        time.sleep(0.01)
