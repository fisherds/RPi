import time
import adafruit_servokit

# Adafruit servo kit info...
# https://learn.adafruit.com/adafruit-16-channel-servo-driver-with-raspberry-pi/using-the-adafruit-library

def servo_sweep(kit, servo_pin):
    for _ in range(2):
        kit.servo[servo_pin].angle = 180
        print("180")
        time.sleep(1.5)

        kit.servo[servo_pin].angle = 0
        print("0")
        time.sleep(1.5)


def servo_angle(kit, servo_pin):
    while True:
        angle = int(input("Enter a servo angle (0-180): "))
        if angle == -1:
            break
        kit.servo[servo_pin].angle = angle


def main():
    print("Ready")
    kit = adafruit_servokit.ServoKit(channels=16)
    servo_pin = 13
    servo_sweep(kit, servo_pin)
    servo_angle(kit, servo_pin)


main()
# Note: Doing PCA9685 I2C communication in node is a pain https://github.com/101100/pca9685