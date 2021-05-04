import mqtt_helper
import time

class TankReceiver:

    def __init__(self):
        self.mqtt_client = mqtt_helper.MqttClient()
        self.mqtt_client.callback = self.mqtt_callback
        self.mqtt_client.connect(
            # mqtt_broker_ip_address="broker.hivemq.com",
            use_off_campus_broker=True,
            subscription_topic_name="fisherds",
            publish_topic_name="fisherds")

    def mqtt_callback(self, message_type, payload):
        print("MQTT message_type", message_type)
        print("MQTT payload", payload)

        if message_type == "motor/go":
            left_wheel_speed = payload[0]
            right_wheel_speed = payload[1]
            print("motor/go", left_wheel_speed, right_wheel_speed)

        if message_type == "motor/stop":
            print("motor/stop")

if __name__ == '__main__':
    TankReceiver()

    while True:
        time.sleep(0.01)
