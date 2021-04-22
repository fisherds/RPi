from kivymd.app import MDApp
from kivy.properties import StringProperty
from kivy.core.window import Window
import mqtt_helper

class HelloButtonApp(MDApp):

    label_text = StringProperty()

    def mqtt_callback(self, message_type, payload):
        print("Type:", message_type)
        print("Payload:", payload)
        if message_type == "Set":
            self.counter = payload
        if message_type == "Change":
            self.counter += payload
        self.updateView()
    
    def __init__(self,**kwargs):
        super(HelloButtonApp,self).__init__(**kwargs)

        self.mqtt_client = mqtt_helper.MqttClient()
        # self.mqtt_client.callback = lambda message_type, payload: self.mqtt_callback(message_type, payload)
        self.mqtt_client.callback = self.mqtt_callback
        print("Connecting...")
        self.mqtt_client.connect(
            subscription_topic_name="fisherds",
        publish_topic_name="fisherds",
        mqtt_broker_ip_address="f2b.csse.rose-hulman.edu")
        print("Finished connecting")
        self.counter = 0
        self.updateView()
    
    def set_counter(self, value):
        self.mqtt_client.send_message("Set", value)
        
    def change_counter(self, value):
        self.mqtt_client.send_message("Change", value)

    def updateView(self):
        self.label_text = "Count = {}".format(self.counter)

    def build(self):
        Window.size = (400, 200)
        return


if __name__ == '__main__':
    HelloButtonApp().run()