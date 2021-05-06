import adafruit_servokit
from numpy import interp

class Servos:
  PIN_CAMERA_SERVO = 11
  PIN_JOINT_1 = 12
  PIN_JOINT_2 = 13
  PIN_JOINT_3 = 14
  PIN_GRIPPER_SERVO = 15

  def __init__(self):
    self.kit = adafruit_servokit.ServoKit(channels=16)
  
  def set_camera_angle(self, angle):
    servo_angle = interp(angle,[0, 45], [30, 0]) # maps 0->45 to 30->0 (flip and scale)
    self.kit.servo[Servos.PIN_CAMERA_SERVO].angle = servo_angle
  
  def set_joint_angle(self, joint_number, angle):
    pin = joint_number + Servos.PIN_CAMERA_SERVO  # 12, 13, or 14
    if joint_number == 1:
      servo_angle = interp(angle, [-90, 90], [180, 0])  # flip
    else:
      servo_angle = interp(angle, [-90, 90], [0, 180])  # add 90
    self.kit.servo[pin].angle = servo_angle
  
  def set_gripper_inches(self, inches):
    servo_angle = interp(inches, [0, 2], [105, 0])
    print("Request:", inches, " Result: ", servo_angle)
    self.kit.servo[Servos.PIN_GRIPPER_SERVO].angle = servo_angle




class RosebotServos:
    def __init__(self):
        self.kit = adafruit_servokit.ServoKit(channels=16)
        self.camera_range = [115, 30] # maps to [0 45]
        self.joint1_range = [180, 0] # maps to [-90 90]
        self.joint2_range = [0, 170] # maps to [-90 90]
        self.joint3_range = [0, 180] # maps to [-90 90]
        self.gripper_range = [50, 0] # maps to [0, 1.5] in

    # takes in DH angles, convert them here based on hardware offsets
    def set_angle(self, servo_pin, angle):
        real_angle = 0
        if (servo_pin == 11):
            # camera servo
            real_angle = interp(angle,[0, 45],self.camera_range)

        elif (servo_pin == 12):
            # Joint 1
            real_angle = interp(angle,[-90, 45],self.joint1_range)

        elif (servo_pin == 13):
            # Joint 2
            real_angle = interp(angle,[-90, 90],self.joint2_range)
        
        elif (servo_pin == 14):
            # Joint 3
            real_angle = interp(angle,[-90, 90],self.joint3_range)

        elif (servo_pin == 15):
            # Gripper servo
            real_angle = interp(angle,[0, 1.5],self.gripper_range)
        else:
            print("Wrong pin provided")

        self.kit.servo[servo_pin].angle = real_angle

# Testing for development
if __name__ == '__main__':
    print("Goodbye")
