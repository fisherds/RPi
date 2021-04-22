from kivymd.app import MDApp
from kivy.properties import StringProperty
from kivy.core.window import Window

class HelloButtonApp(MDApp):

    label_text = StringProperty()
    
    def __init__(self,**kwargs):
        super(HelloButtonApp,self).__init__(**kwargs)
        self.counter = 0
        self.updateView()
    
    def set_counter(self, value):
        self.counter = value
        self.updateView()

    def change_counter(self, value):
        self.counter += value
        self.updateView()

    def updateView(self):
        self.label_text = "Count = {}".format(self.counter)
        print(self.label_text)

    def build(self):
        Window.size = (400, 300)
        return


if __name__ == '__main__':
    HelloButtonApp().run()