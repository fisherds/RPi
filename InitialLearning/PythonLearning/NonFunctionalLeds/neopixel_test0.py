import time
import RPi.GPIO as GPIO
import sys
from rpi_ws281x import *    # for neopixel

def main():
    print("Using sudo pip install rpi_ws281x")

    LED_COUNT = 16  # Number of LED pixels.
    LED_PIN = 12  # GPIO pin connected to the pixels (18 uses PWM!).
    LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800khz)
    LED_DMA = 10  # DMA channel to use for generating signal (try 10)
    LED_BRIGHTNESS = 255  # Set to 0 for darkest and 255 for brightest
    LED_INVERT = False  # True to invert the signal (when using NPN transistor level shift)
    LED_CHANNEL = 0  # set to '1' for GPIOs 13, 19, 41, 45 or 53

    colorBreathR = 0
    colorBreathG = 0
    colorBreathB = 0
    breathSteps = 10

    lightMode = 'none'  # 'none' 'police' 'breath'

    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(5, GPIO.OUT)
    GPIO.setup(6, GPIO.OUT)
    GPIO.setup(13, GPIO.OUT)

    # Create NeoPixel object with appropriate configuration.
    strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT,
                                   LED_BRIGHTNESS, LED_CHANNEL)
    # Intialize the library (must be called once before other functions).
    strip.begin()

main()