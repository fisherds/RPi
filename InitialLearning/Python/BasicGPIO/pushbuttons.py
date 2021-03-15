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

def main():
    print("Ready")
    # readingState()
    pushbuttonInterrupts()


main()
