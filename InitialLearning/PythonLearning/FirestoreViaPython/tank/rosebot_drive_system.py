import gpiozero as gz
import time

class Motor:
  def __init__(self, pin_1, pin_2, pin_enable):
    self.digital_output_1 = gz.DigitalOutputDevice(pin_1)
    self.digital_output_2 = gz.DigitalOutputDevice(pin_2)
    self.pwm_output = gz.PWMOutputDevice(pin_enable,frequency=1000)

  def turn_on(self, duty_cycle):
    if duty_cycle > 0:
      self.digital_output_1.on()
      self.digital_output_2.off()
      self.pwm_output.value = duty_cycle / 100.0
    elif duty_cycle < 0:
      self.digital_output_1.off()
      self.digital_output_2.on()
      self.pwm_output.value = -duty_cycle / 100.0
    else:
      self.turn_off()

  def turn_off(self):
    self.digital_output_1.off()
    self.digital_output_2.off()
    self.pwm_output.value = 0


class DriveSystem:
  def __init__(self):
    Motor_A_EN = 4
    Motor_B_EN = 17
    Motor_A_Pin1 = 14
    Motor_A_Pin2 = 15
    Motor_B_Pin1 = 27
    Motor_B_Pin2 = 18
    self.left_motor = Motor(Motor_B_Pin1, Motor_B_Pin2, Motor_B_EN)
    self.right_motor = Motor(Motor_A_Pin2, Motor_A_Pin1, Motor_A_EN)

  def go(self, left_wheel_speed, right_wheel_speed):
    """ Sets the left and right motor speed -100 to 100 """
    self.left_motor.turn_on(left_wheel_speed)
    self.right_motor.turn_on(right_wheel_speed)
  
  def stop(self):
    self.left_motor.turn_off()
    self.right_motor.turn_off()

  def go_straight_for_seconds(self, seconds, speed=50):
    self.go(speed, speed)
    time.sleep(seconds)
    self.stop()

  def go_straight_for_inches(self, inches, speed=50):
    self.go(speed, speed)
    if speed < 0:
      speed = -speed
    if inches < 0:
      inches = -inches
    speed_inches_per_second = 0.2 * speed + 2.5
    seconds = inches / speed_inches_per_second
    time.sleep(seconds)
    self.stop()

  def spin_in_place_for_seconds(self, seconds, speed=50):
    pass

  def spin_in_place_for_degrees(self, degrees, speed=50):
    pass

  def turn_for_seconds(self, seconds, speed):
    pass

  def turn_for_degrees(self, degrees, speed):
    pass




# Testing / for development
if __name__ == "__main__":
  drive_system = DriveSystem()
  drive_system.go(-50, -50)
  time.sleep(2)
  drive_system.go(100, -100)
  time.sleep(2)
  drive_system.go(0, 0)

  print("Goodbye")
