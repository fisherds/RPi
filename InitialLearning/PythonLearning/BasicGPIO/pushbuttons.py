import gpiozero as gz
import signal

def say_hello():
    print("Hello!")

def say(message):
    print("Message", message)

def readingState():
    button = gz.Button(25)
    while True:
        if button.is_pressed:
            print("Button is pressed")
        else:
            print("Button is not pressed")

def pushbuttonInterrupts():
    button = gz.Button(25)
    button.when_pressed = say_hello
    button.when_held = lambda : say("HOLDING")
    button.when_released = lambda : say("released")
    signal.pause()

def increment(data):
    data["counter"] += 1

def reset(data):
    print("Reset")
    data["counter"] = 0

def print_counter(data):
    print("Counter = ", data["counter"])


def pushbuttonInterrupts2():
    button = gz.Button(25)
    data = {"counter": 0}
    button.when_pressed = lambda : increment(data)
    button.when_held = lambda : reset(data)
    button.when_released = lambda : print_counter(data)
    signal.pause()

def main():
    print("Ready")
    # readingState()
    # pushbuttonInterrupts()
    pushbuttonInterrupts2()


main()
