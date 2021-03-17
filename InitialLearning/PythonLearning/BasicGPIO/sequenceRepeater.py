import gpiozero as gz
import time
import signal


def led_press(data, leds, color):
    data += [color]
    show_color(leds, color)


def run_pattern(data, leds):
    print("Running pattern", data)

    for color in data:
        print(color)
        show_color(leds, color)
        time.sleep(1)
        leds.off()
        time.sleep(0.1)
    
    leds.off()
    data.clear()


def show_color(leds, color):
    if color == "R":
        leds.value = (1, 0, 0)
    if color == "Y":
        leds.value = (0, 1, 0)
    if color == "G":
        leds.value = (0, 0, 1)


def main():
    print("Ready")
    data = []
    leds = gz.LEDBoard(14, 15, 18)
    button_red = gz.Button(22)
    button_yellow = gz.Button(23)
    button_green = gz.Button(24)
    button_run = gz.Button(25)

    button_red.when_pressed = lambda : led_press(data, leds, "R")
    button_yellow.when_pressed = lambda : led_press(data, leds, "Y")
    button_green.when_pressed = lambda : led_press(data, leds, "G")
    button_red.when_released = leds.off
    button_yellow.when_released = leds.off
    button_green.when_released = leds.off
    button_run.when_pressed = lambda : run_pattern(data, leds)

    signal.pause()


main()
