import requests

from kivy.app import App
from kivy.uix.button import Button
from kivy.uix.gridlayout import GridLayout
from kivy.uix.widget import Widget

api_url = "http://fisherds-tank.wlan.rose-hulman.edu:3000/api/"

class TankRemote(App):  

  def send_drive_command(self, left_speed, right_speed):
    print("Go at ", left_speed, right_speed)
    requests.get(str(api_url) + "motor/go/" + str(left_speed) + "/" + str(right_speed))


  def send_stop(self, event):
    print("Stop!")
    requests.get(str(api_url) + "motor/stop")

  def build(self):
    gridlayout = GridLayout(cols=3)

    # row 1
    gridlayout.add_widget(Widget())
    go_button = Button(text ="Forward")
    go_button.bind(on_press = lambda event: self.send_drive_command(100, 100))
    gridlayout.add_widget(go_button)
    gridlayout.add_widget(Widget())

    # row 2
    left_button = Button(text ="Left")
    left_button.bind(on_press = lambda event: self.send_drive_command(-100, 100))
    gridlayout.add_widget(left_button)

    stop_button = Button(text ="Stop")
    stop_button.bind(on_press = self.send_stop)
    gridlayout.add_widget(stop_button)

    right_button = Button(text ="Right")
    right_button.bind(on_press = lambda event: self.send_drive_command(100, -100))
    gridlayout.add_widget(right_button)

    # row 3
    gridlayout.add_widget(Widget())
    reverse_button = Button(text ="Reverse")
    reverse_button.bind(on_press = lambda event: self.send_drive_command(-100, -100))
    gridlayout.add_widget(reverse_button)
    gridlayout.add_widget(Widget())
    return gridlayout


if __name__ == '__main__':
  TankRemote().run()