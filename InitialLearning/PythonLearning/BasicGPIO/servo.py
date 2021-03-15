import gpiozero as gz
import time

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
    servoSweep()

main()