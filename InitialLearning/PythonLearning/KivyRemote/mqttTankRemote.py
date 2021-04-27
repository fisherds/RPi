from kivymd.app import MDApp

class TankRemoteApp(MDApp):
    def send_drive_command(self, left_wheel_speed, right_wheel_speed):
        print("Send drive command", left_wheel_speed, right_wheel_speed)

    def send_stop(self):
        print("Stop")

    def build(self):
        self.theme_cls.primary_palette = "BlueGray"
        # Done via the .kv file with the magic name TankRemoteApp --> tankRemote.kv
        return 

if __name__ == '__main__':
  TankRemoteApp().run()