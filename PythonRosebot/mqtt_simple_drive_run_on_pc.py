import mqtt_helper
import time

# MQTT on_message callback (use via a lambda function below)
def mqtt_callback(type_name, payload):
    print("Received message type: ", type_name)
    print("Received message payload: ", payload)

def main():
    mqtt_client = mqtt_helper.MqttClient() # note, use "mqtt_helper.MqttClient" in other files
    mqtt_client.callback = lambda type, payload: mqtt_callback(type, payload)
    mqtt_client.connect("fisherds-pi2computer", "fisherds-computer2pi", use_off_campus_broker=True)  # "Send to" and "listen to" the same topic

    while True:
        time.sleep(2.0)
        mqtt_client.send_message("motor/go", [90, 90])
        time.sleep(2.0)
        mqtt_client.send_message("motor/stop")
        time.sleep(2.0)

main()