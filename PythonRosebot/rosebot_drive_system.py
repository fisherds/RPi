"""
Authors:  Dave Fisher and PUT_YOUR_NAME_HERE.
"""
# TODO: 1.  Put your name in the above.

import time
import RPi.GPIO as GPIO


###############################################################################
#    DriveSystem
###############################################################################
class Motor:
    """
    Represents an individual motor.  Typically you won't use this class directly
    instead using the DriveSystem class which will construct and manage 2 motors.
    """
    def __init__(self, pin_enable, pin_1, pin_2):
        """
        Constructs a motor object for the given pins.
        :param pin_enable: PWM enable pin of the H-bridge
        :param pin_1: Pin to go forwards (if high)
        :param pin_2: Pin to go backwards (if high)
        :type pin_enable:  int
        :type pin_1:  int
        :type pin_2: int
        """
        GPIO.setup(pin_enable, GPIO.OUT)
        GPIO.setup(pin_1, GPIO.OUT)
        GPIO.setup(pin_2, GPIO.OUT)
        self.pin_1 = pin_1
        self.pin_2 = pin_2
        self.pwm = GPIO.PWM(pin_enable, 1000) # Use a 1000 Hz frequency
        self.turn_off()

    def turn_on(self, speed):
        """
        Set the speed of the motor
        :param speed:  -100 to 100 for the speed of the motor
        :type speed: int
        """
        if speed < -100:
            speed = -100
        if speed > 100:
            speed = 100
        if speed > 0:
            # Forwards
            GPIO.output(self.pin_1, GPIO.HIGH)
            GPIO.output(self.pin_2, GPIO.LOW)
            self.pwm.start(speed)
        elif speed < 0:
            # Backwards
            GPIO.output(self.pin_1, GPIO.LOW)
            GPIO.output(self.pin_2, GPIO.HIGH)
            self.pwm.start(-speed)
        else:
            self.turn_off()

    def turn_off(self):
        """
        Stops the current motor
        """
        GPIO.output(self.pin_1, GPIO.LOW)
        GPIO.output(self.pin_2, GPIO.LOW)
        self.pwm.stop()


###############################################################################
#    DriveSystem
###############################################################################
class DriveSystem(object):
    """
    Controls the robot's motion via methods that include:
      go                         stop
      go_straight_for_seconds    go_straight_for_inches
      spin_in_place_for_seconds  spin_in_place_for_degrees
      turn_for_seconds           turn_for_degrees
    """

    # -------------------------------------------------------------------------
    # NOTE:
    #   To "go straight" means that both wheels move at the same speed.
    #     -- Positive speeds should make the robot move forward.
    #     -- Negative speeds should make the robot move backward.
    #   To "spin_in_place" means that the wheels move at speeds S and -S.
    #     -- Positive speeds should make the robot spin clockwise
    #          (i.e., left motor goes at speed S, right motor at speed -S).
    #     -- Negative speeds should make the robot spin counter-clockwise
    #          (i.e., left motor goes at speed -S, right motor at speed S).
    #   To "turn" means that one wheel does not move and the other does move:
    #     -- Positive speeds should make only the left motor move
    #          (and hence the turn is clockwise).
    #     -- Negative speeds should make only the right motor move
    #          (and hence the turn is counter-clockwise).
    #   The RoseBot's "wheels" have diameter about 1.3 inches.
    # -------------------------------------------------------------------------

    def __init__(self):
        """
        Constructs two Motor objects (for the left and right wheels).
          """
        # ---------------------------------------------------------------------
        # TODO: With your instructor, implement this method.
        # ---------------------------------------------------------------------
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        # Pin constants copied from the move.py file provided by Adeept
        Motor_A_EN = 4
        Motor_B_EN = 17

        Motor_A_Pin1 = 14
        Motor_A_Pin2 = 15
        Motor_B_Pin1 = 27
        Motor_B_Pin2 = 18
        self.left_motor = Motor(Motor_B_EN, Motor_B_Pin1, Motor_B_Pin2)
        self.right_motor = Motor(Motor_A_EN, Motor_A_Pin2, Motor_A_Pin1)

    def go(self, left_wheel_speed, right_wheel_speed):
        """
        Makes the left and right wheel motors spin at the given speeds
        (which should each be integers between -100 and 100).
          :type left_wheel_speed:  int
          :type right_wheel_speed: int
        """
        # ---------------------------------------------------------------------
        # TODO: Implement this method.
        # ---------------------------------------------------------------------
        self.left_motor.turn_on(left_wheel_speed)
        self.right_motor.turn_on(right_wheel_speed)

    def stop(self):
        """ Stops the left and right wheel motors. """
        # ---------------------------------------------------------------------
        # TODO: Implement this method.
        # ---------------------------------------------------------------------
        self.left_motor.turn_off()
        self.right_motor.turn_off()

    def go_straight_for_seconds(self, seconds, speed=50):
        """
        Makes the robot go straight (forward if speed > 0, else backward)
        for the given number of seconds at the given speed.
          :type seconds: float
          :type speed:   int
        """
        # ---------------------------------------------------------------------
        # TODO: Implement this method.
        # ---------------------------------------------------------------------
        self.go(speed, speed)
        time.sleep(seconds)
        self.stop()

    def go_straight_for_inches(self, inches, speed=50):
        """
        Makes the robot go straight (forward if speed > 0, else backward)
        for the given number of inches at the given speed, using the
        encoder (degrees traveled sensor, "position") built into the motors.
          :type inches: float
          :type speed:  int
        """
        # ---------------------------------------------------------------------
        # TODO: Implement this method.
        # ---------------------------------------------------------------------
        self.go(speed, speed)
        if speed < 0:
            speed = -speed  # Convert the speed to a positive for the formula
        if inches < 0:
            inches = -inches # Make sure the user put in a positive inches regardless of direction

        if speed < 40:
            print("Warning: Only really works for speeds 40+")
        inches_per_second = 0.172 * speed + 2.15  # from an excel sheet trend line
        # FYI only holds for values 40 and up
        seconds = inches / inches_per_second
        time.sleep(seconds)  # Requires testing to make a formula
        self.stop()

    def spin_in_place_for_seconds(self, seconds, speed=50):
        """
        Makes the robot spin in place for the given number of seconds
        at the given speed.
          :type seconds: float
          :type speed:   int
        """
        # ---------------------------------------------------------------------
        # TODO: Implement this method.
        # ---------------------------------------------------------------------
        self.go(speed, -speed)
        time.sleep(seconds)
        self.stop()

    def spin_in_place_for_degrees(self, degrees, speed=50):
        """
        Makes the robot spin in place the given number of degrees
        at the given speed.
          :type degrees: float
          :type speed:   int
        """
        # ---------------------------------------------------------------------
        # TODO: Implement this method.
        # ---------------------------------------------------------------------
        self.go(speed, -speed)
        time.sleep(degrees)  # Requires testing to make a formula
        self.stop()

    def turn_for_seconds(self, seconds, speed):
        """
        Makes the robot turn for the given number of seconds
        at the given speed.  The
          :type seconds: float
          :type speed:   int
        """
        # ---------------------------------------------------------------------
        # TODO: Implement this method.
        # ---------------------------------------------------------------------
        if speed > 0:
            self.go(speed, 0)
        else:
            self.go(0, speed)
        time.sleep(seconds)
        self.stop()

    def turn_for_degrees(self, degrees, speed):
        """
        Makes the robot turn the given number of degrees
        at the given speed.
          :type degrees: float
          :type speed:   int
        """
        # ---------------------------------------------------------------------
        # TODO: Implement this method.
        # ---------------------------------------------------------------------
        if speed > 0:
            self.go(speed, 0)
        else:
            self.go(0, speed)
        time.sleep(degrees)  # Requires testing to make a formula
        self.stop()

    def destroy(self):
        self.stop()
        GPIO.cleanup()             # Release resource


if __name__ == '__main__':
    drive = DriveSystem()
    try:
        drive.left_motor.turn_on(30)
        time.sleep(2)
        drive.left_motor.turn_off()
        time.sleep(1)
        drive.right_motor.turn_on(30)
        time.sleep(2)
        drive.right_motor.turn_off()
        time.sleep(1)
        drive.go_straight_for_seconds(2.5, speed=30)
        drive.go_straight_for_seconds(2.5, speed=-30)
    except KeyboardInterrupt:
        drive.destroy()
