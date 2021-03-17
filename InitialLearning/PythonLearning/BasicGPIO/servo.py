import gpiozero as gz
import time


def go_to_angle():
    servo = gz.AngularServo(17, min_angle=-90, max_angle=90)

    while True:
        angle = int(input("Enter an integer for angle: "))
        servo.angle = angle

def servo_sweep():
    servo = gz.Servo(17)

    while True:
        servo.min()
        print("min")
        time.sleep(2)
        servo.mid()
        time.sleep(2)
        print("mid")
        servo.max()
        time.sleep(2)
        print("max")

def main():
    print("Ready")
    servo_sweep()
    go_to_angle()

main()