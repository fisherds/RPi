import robotLight
import time

def main():
    print("Testing Robot light")

    RL = robotLight.RobotLight()
    RL.start()
    RL.breath(70, 70, 255)
    time.sleep(15)
    RL.pause()
    RL.frontLight('off')
    time.sleep(2)
    RL.police()


main()