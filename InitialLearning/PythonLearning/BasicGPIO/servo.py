import gpiozero as gz
import time


def goToAngle():
    servo = gz.AngularServo(17, min_angle=-90, max_angle=90)

    while True:
        angle = int(input("Enter an integer for angle: "))
        servo.angle = angle

def servoSweep():
    servo = gz.Servo(17)

    while True:
        servo.min()
        time.sleep(3)
        servo.mid()
        time.sleep(2)
        servo.max()
        time.sleep(3)

def main():
    print("Ready")
    # servoSweep()
    goToAngle()

main()