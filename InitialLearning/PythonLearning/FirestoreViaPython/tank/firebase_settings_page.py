from firebase_admin import firestore
from firebase_admin import storage
import threading

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
        """ Constructs the SettingsPageDocumentManager.  Notice the public properties below. """

        # Public properties that a user should read to get the latest Firestore data...
        # --- Start public properties section ---
        # Command doc
        self.command_type = ""
        self.command_payload = None

        # Feedback Stream doc
        self.is_feedback_stream_active = False

        # Security System doc
        self.is_security_system_active = False
        self.distance_threshold = 70
        self.time_threshold = 3600
        # --- End public properties section ---

        # Internal variables.
        ref = firestore.client().collection(self.COLLECTION_SETTINGS_PAGE)
        self._ref_manual_command = ref.document(self.DOC_ID_MANUAL_COMMAND)
        self._ref_feedback_stream = ref.document(self.DOC_ID_FEEDBACK_STREAM)
        self._ref_security_system = ref.document(self.DOC_ID_SECURITY_SYSTEM)
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
        self._command_callback = callback
        self._ref_manual_command.on_snapshot(lambda docs, changes, read_time: self._on_command_snapshot(docs))

    def _on_command_snapshot(self, docs):
        for doc in docs:
            if doc.exists:
                doc_data = doc.to_dict()
                # Set the public properties
                self.command_type = doc_data.get(self.KEY_MANUAL_COMMAND_TYPE)

                # Note, in this app the payload isn't used but the code is still present for best practice.
                self.command_payload = doc_data.get(self.KEY_MANUAL_COMMAND_PAYLOAD)
                if self.command_payload is not None:
                    print(f"json parse the payload {self.command_payload}")
                    self.command_payload = json.loads(self.command_payload)
                if self._command_callback is not None:
                    self._command_callback() # Calls your callback, so you know a command arrived.
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
        self._feedback_stream_callback = callback
        self._ref_feedback_stream.on_snapshot(lambda docs, changes, read_time: self._on_feedback_stream_snapshot(docs))

    def _on_feedback_stream_snapshot(self, docs):
        for doc in docs:
            if doc.exists:
                doc_data = doc.to_dict()
                # Set the public properties
                self.is_feedback_stream_active = doc_data.get(self.KEY_FEEDBACK_STREAM_IS_ACTIVE)
                # Note: a callback is probably not useful for this one, just the boolean value.
                if self._feedback_stream_callback is not None:
                    self._feedback_stream_callback() # Calls your callback, so you know a command arrived.
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
        self._security_system_callback = callback
        self._ref_security_system.on_snapshot(lambda docs, changes, read_time: self._on_security_system_snapshot(docs))

    def _on_security_system_snapshot(self, docs):
        for doc in docs:
            if doc.exists:
                doc_data = doc.to_dict()
                # Set the public properties
                self.is_security_system_active = doc_data.get(self.KEY_SECURITY_SYSTEM_IS_ACTIVE)
                self.distance_threshold = float(doc_data.get(self.KEY_SECURITY_SYSTEM_DISTANCE_THRESHOLD))
                self.time_threshold = int(doc_data.get(self.KEY_SECURITY_SYSTEM_COOL_DOWN_TIME_THRESHOLD))
                # Note: a callback is probably not useful for this one, just the values.
                if self._security_system_callback is not None:
                    self._security_system_callback()
        self._callback_done.set()
