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
    # -------------------------------------------------------------------------
    while True:
        print("Wheel speeds should be integers between -100 and 100.")
        print("Enter values of 0 for both to exit.")
        left_wheel_speed = int(input("Enter an integer for left wheel speed: "))
        right_wheel_speed = int(input("Enter an integer for right wheel speed: "))
        if left_wheel_speed == 0 and right_wheel_speed == 0:
            break
        print()
        input("Press the ENTER key when ready for the robot to start moving.")

        # -------------------------------------------------------------------------
        # TODO: 3. Call the  go  method of the   drive_system   of the robot,
        #   sending it the two wheel speeds.  Keep going (time.sleep) for 3 seconds.
        #   Then call the  stop  method of the   drive_system   of the robot.
        # -------------------------------------------------------------------------

        # Solution to be removed
        robot.drive_system.go(left_wheel_speed, right_wheel_speed)
        time.sleep(3)
        robot.drive_system.stop()
