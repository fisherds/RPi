import move
import time

# Move seems to use this libray  https://sourceforge.net/p/raspberry-gpio-python/wiki/BasicUsage/

def main():
    print("Setup")
    move.setup()
    print("Running main")
    move.move(40, 'forward', 'no', 0)  # speed, {'forward','backward','no'}, {'left','right','no'}, 0 < radius <= 1
    time.sleep(2)
    move.motorStop()
    time.sleep(2)
    move.motor_left(1, move.Dir_forward, 40)  # Non-zero to go, 0=forward 1=backwards, speed
    time.sleep(2)
    # move.motorStop()
    move.motor_left(0, move.Dir_forward, 0)
    time.sleep(2)
    move.motor_right(1, 0, 40)  # Non-zero to go, 0=forward 1=backwards, speed
    time.sleep(2)
    move.motorStop()
    time.sleep(2)
    print("Done")


main()