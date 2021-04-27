from kivymd.app import MDApp
from kivy.core.window import Window
import mqtt_helper

class TankRemoteApp(MDApp):

    def __init__(self, **kwargs):
        super(TankRemoteApp, self).__init__(**kwargs)

        self.mqtt_client = mqtt_helper.MqttClient()
        self.mqtt_client.callback = self.mqtt_callback
        self.mqtt_client.connect(subscription_topic_name="fisherds/messagesForPi",  # TODO: Put this back 
                                 publish_topic_name="fisherds-computer2pi",
                                 use_off_campus_broker=True)

    def mqtt_callback(self, message_type, payload):
        print("MQTT message_type", message_type)
        print("MQTT payload", payload)


    # def send_drive_command(self, left_wheel_speed, right_wheel_speed):
    #     print("Send drive command", left_wheel_speed, right_wheel_speed)
    # def send_stop(self):
    #     print("Stop")
    # def send_camera_tilt(self, tilt_angle):
    #     print("Send camera tilt command", tilt_angle)
    # def send_joint_angle(self, joint_number, angle):
    #     print("Send joint angle command", joint_number, angle)
    # def send_gripper_distance(self, distance_in):
    #     print("Send gripper distance command", distance_in)

    def build(self):
        self.theme_cls.primary_palette = "BlueGray"
        Window.size = (400, 600)
        # Done via the .kv file with the magic name TankRemoteApp --> tankRemote.kv
        return 

if __name__ == '__main__':
  TankRemoteApp().run()