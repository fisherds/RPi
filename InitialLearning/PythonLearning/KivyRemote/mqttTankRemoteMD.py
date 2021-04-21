from kivymd.app import MDApp
from kivy.lang import Builder


class Test(MDApp):

  
    def send_drive_command(self, left_wheel_speed, right_wheel_speed):
        print("Send drive command", left_wheel_speed, right_wheel_speed)

    def stop(self):
        print("Stop")

    def build(self):
        self.theme_cls.primary_palette = "BlueGray"
        return Builder.load_string(
            '''
BoxLayout:
    orientation:'vertical'

    MDToolbar:
        title: 'Kivy Remote'
        md_bg_color: .2, .2, .2, 1
        specific_text_color: 1, 1, 1, 1

    MDBottomNavigation:
        panel_color: .2, .2, .2, 1

        MDBottomNavigationItem:
            name: 'screen 1'
            text: 'Drive'
            icon: 'truck'

            MDGridLayout:
                align: 'center'
                adaptive_height: True
                adaptive_width: True
                cols: 3
                padding: 20
                spacing: 30
                pos_hint: {'center_x':.5, 'center_y': .5}

                Widget:

                MDFloatingActionButton:
                    icon: "arrow-up"
                    text: "Forward"
                    on_press: app.send_drive_command(100, 100)
                    on_release: app.stop()

                Widget:


                MDFloatingActionButton:
                    icon: "arrow-left"

                MDFloatingActionButton:
                    icon: "stop"
                    md_bg_color: app.theme_cls.primary_color

                MDFloatingActionButton:
                    icon: "arrow-right"
                
                Widget:

                MDFloatingActionButton:
                    icon: "arrow-down"

                Widget:




        MDBottomNavigationItem:
            name: 'screen 2'
            text: 'Servos'
            icon: 'wiper'
            BoxLayout:
                orientation: 'vertical'
                padding: 30
                
                MDLabel:
                    text: '11: Camera Servo'
                    halign: 'left'
                    
                MDSlider:
                    min: 0
                    max: 60
                    value: 0

                MDLabel:
                    text: '12: Joint 1'
                    halign: 'left'
                    
                MDSlider:
                    min: -90
                    max: 90
                    value: 0

                MDLabel:
                    text: '13: Joint 2'
                    halign: 'left'
                    
                MDSlider:
                    min: -90
                    max: 90
                    value: 0

                MDLabel:
                    text: '14: Joint 3'
                    halign: 'left'
                    
                MDSlider:
                    min: -90
                    max: 90
                    value: 0

                MDLabel:
                    text: '15: Gripper'
                    halign: 'left'
                    
                MDSlider:
                    min: 0
                    max: 2
                    value: 0.75
'''
        )


Test().run()