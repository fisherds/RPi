#!/usr/bin/env python3
# File name   : init
# Description : Control Servos
# Author      : William
# Date        : 2019/02/23
import time
import Adafruit_PCA9685

pwm = Adafruit_PCA9685.PCA9685()
pwm.set_pwm_freq(50)

SERVO_PIN_CAMERA = 11
SERVO_PIN_1 = 12
SERVO_PIN_2 = 13
SERVO_PIN_3 = 14
SERVO_PIN_GRIPPER = 15

ALL_SERVOS = [11, 12, 13, 14, 15]

while 1:
	for servo_pin in ALL_SERVOS:
		if servo_pin == SERVO_PIN_CAMERA:
			pwm.set_pwm(servo_pin, 0, 200)
			print("Move 250")
			time.sleep(1)
			pwm.set_pwm(servo_pin, 0, 150)
			print("Move 150")
			time.sleep(1)
		else:
			pwm.set_pwm(servo_pin, 0, 350)
			print("Move 350")
			time.sleep(1)
			pwm.set_pwm(servo_pin, 0, 300)
			print("Move 300")
			time.sleep(1)