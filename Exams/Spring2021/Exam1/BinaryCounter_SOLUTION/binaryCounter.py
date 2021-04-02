import gpiozero as gz
import time
import signal

def update_leds(leds, value):
    print("Counter = ", value)
    leds.value = (value & 0x4, value & 0x2, value & 0x1)

def reset_button_press(data, leds):
    data["counter"] = 0
    update_leds(leds, data["counter"])

def increment_button_press(data, leds):
    data["counter"] += 1
    update_leds(leds, data["counter"])

def main():
    print("Ready")
    data = {"counter": 0}
    leds = gz.LEDBoard(14, 15, 18)
    reset_button = gz.Button(22)
    increment_button = gz.Button(25)

    reset_button.when_pressed = lambda : reset_button_press(data, leds)
    increment_button.when_pressed = lambda : increment_button_press(data, leds)

    signal.pause()


main()
