import LED
import time

# This did not work.  Got the error message:

# Can't open /dev/mem: Permission denied
#  raise RuntimeError('ws2811_init failed with code {0} ({1})'.format(resp, str_resp))
# when the self.strip.begin() line runs

# perhaps that can be fixed with sudo

def main():
    print("Testing")
    leds = LED.LED()
    leds.colorWipe(255, 0, 0)
    time.sleep(2)


main()