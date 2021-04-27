import mqtt_helper
import time
import rosebot

# MQTT on_message callback (use via a lambda function below)
def mqtt_callback(type_name, payload, robot):
    print("Received message type: ", type_name)
    print("Received message payload: ", payload)

    if type_name == "motor/go":
        left_wheel_speed = payload[0]
        right_wheel_speed = payload[1]
        print("Drive the motors at ", left_wheel_speed, right_wheel_speed)
        robot.drive_system.go(left_wheel_speed, right_wheel_speed)
    
    if type_name == "motor/stop":
        print("Stop")
        robot.drive_system.stop()
    

def main():
    robot = rosebot.RoseBot()
    mqtt_client = mqtt_helper.MqttClient() # note, use "mqtt_helper.MqttClient" in other files
    mqtt_client.callback = lambda type, payload: mqtt_callback(type, payload, robot)
    mqtt_client.connect("fisherds-computer2pi", "fisherds-pi2computer", use_off_campus_broker=True)  # "Send to" and "listen to" the same topic

    while True:
        time.sleep(0.1)

main()