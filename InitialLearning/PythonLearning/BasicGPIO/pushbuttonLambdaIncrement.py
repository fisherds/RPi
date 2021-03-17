import gpiozero as gz
import signal

def say_hello():
    print("Hello!")

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
    signal.pause()

def increment(data):
    data["counter"] += 1
    print("Counter = ", data["counter"])
    
def pushbuttonLambda():
    data = {'counter': 100}
    button = gz.Button(25)
    button.when_pressed = lambda : increment(data)
    signal.pause()

def main():
    print("Ready")
    # readingState()
    # pushbuttonInterrupts()
    pushbuttonLambda()


main()
