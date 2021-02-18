#!/usr/bin/env python3
# File name   : init
# Description : Control Servos
# Author      : William
# Date        : 2019/02/23
import time
import Adafruit_PCA9685

pwm = Adafruit_PCA9685.PCA9685()
pwm.set_pwm_freq(50)

# SERVO_PIN_CAMERA = 11
# SERVO_PIN_1 = 12
# SERVO_PIN_2 = 13
# SERVO_PIN_3 = 14
# SERVO_PIN_GRIPPER = 15

while 1:
	pwm.set_all_pwm(0, 300)
	time.sleep(1)
