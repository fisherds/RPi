import requests
import time

response = requests.get("http://fisherds-tank.wlan.rose-hulman.edu:3000/api/motor/go/90/90")
time.sleep(1)
response = requests.get("http://fisherds-tank.wlan.rose-hulman.edu:3000/api/motor/stop")
