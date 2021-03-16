import gpiozero as gz
import time

def servo_sweep():
    servo = gz.Servo(13)

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

main()