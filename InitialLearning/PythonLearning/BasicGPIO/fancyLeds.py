import gpiozero as gz
import time
import signal


def main():
    print("Ready")
    # fancy_blink()
    # led_pwm()
    # led_board()
    fancy_traffic_light()


def fancy_blink():
    red_led = gz.LED(14)
    yellow_led = gz.LED(15)
    green_led = gz.LED(18)

    red_led.blink()
    time.sleep(0.5)
    yellow_led.blink()
    time.sleep(0.5)
    green_led.blink()

    signal.pause()
    
def led_pwm():
    red_led = gz.PWMLED(14)
    yellow_led = gz.PWMLED(15)
    green_led = gz.PWMLED(18)

    while True:
        for k in range(10):
            red_led.value = k / 10
            time.sleep(0.5)

def led_board():
    leds = gz.LEDBoard(14, 15, 18)

    leds.on()
    print("All on")
    time.sleep(2)
    leds.off()
    print("All off")
    time.sleep(2)
    leds.value = (1, 0, 1)
    print("Pattern")
    time.sleep(2)
    leds.blink()

    signal.pause()

def fancy_traffic_light():
    # Loop forever
    # Turn green on for 5 secs, yellow for 1, red for 3

    lights = gz.TrafficLights(14, 15, 18)

        
    while True:
        lights.green.on()
        time.sleep(5)
        lights.green.off()
        lights.amber.on()
        time.sleep(1)
        lights.amber.off()
        lights.red.on()
        time.sleep(3)
        lights.red.off()




main()
