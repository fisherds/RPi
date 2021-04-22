from kivymd.app import MDApp
from kivy.core.window import Window
import mqtt_helper

class TankRemoteApp(MDApp):

    # def __init__(self):
    #     mqtt_client = mqtt_helper.MqttClient()
    #     mqtt_client.callback = lambda type, payload: mqtt_callback(type, payload)
    #     mqtt_client.connect(
    #         subscription_topic_name="fisherds-pi2computer",
    #         publish_topic_name="fisherds-computer2pi",
    #         use_off_campus_broker=True)

    def mqtt_callback(type_name, payload):
        print("Received message type: ", type_name)
        print("Received message payload: ", payload)


    def send_drive_command(self, left_wheel_speed, right_wheel_speed):
        print("Send drive command", left_wheel_speed, right_wheel_speed)

        self.ids.ultrasonic_value_label.text = "Test"

    def send_stop(self):
        print("Stop")

    def send_camera_tilt(self, tilt_angle):
        print("Send camera tilt command", tilt_angle)

    def send_joint_angle(self, joint_number, angle):
        print("Send joint angle command", joint_number, angle)

    def send_gripper_distance(self, distance_in):
        print("Send gripper distance command", distance_in)

    def build(self):
        self.theme_cls.primary_palette = "BlueGray"
        Window.size = (400, 600)
        # Done via the .kv file with the magic name TankRemoteApp --> tankRemote.kv
        return 

if __name__ == '__main__':
  TankRemoteApp().run()