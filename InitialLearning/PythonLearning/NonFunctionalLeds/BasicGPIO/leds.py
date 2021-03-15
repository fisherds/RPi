import gpiozero as gz
import time


def main():
    print("Ready")
    # basic_led_on()
    # manual_blink()
    manual_traffic_light()


def basic_led_on():
    red_led = gz.LED(14)
    yellow_led = gz.LED(15)
    green_led = gz.LED(18)
    
    red_led.on()
    yellow_led.on()
    green_led.on()
    time.sleep(3)
    print("Goodbye")


def manual_blink():
    red_led = gz.LED(14)
    yellow_led = gz.LED(15)
    green_led = gz.LED(18)

    # for k in range(5):
    while True:
        red_led.on()
        yellow_led.on()
        green_led.on()
        time.sleep(1)
        red_led.off()
        yellow_led.off()
        green_led.off()
        time.sleep(1)

def manual_traffic_light():
    red_led = gz.LED(14)
    yellow_led = gz.LED(15)
    green_led = gz.LED(18)
    
    # Loop forever, green for 5, yellow for 1, red for 3
    while True:
        green_led.on()
        time.sleep(5)
        green_led.off()
        yellow_led.on()
        time.sleep(1)
        yellow_led.off()
        red_led.on()
        time.sleep(3)
        red_led.off()



main()
