from kivy.app import App
from kivy.uix.widget import Widget
from kivy.uix.button import Button
from kivy.uix.scatter import Scatter
from kivy.uix.label import Label
from kivy.uix.floatlayout import FloatLayout

# class MyPaintWidget(Widget):

#     def on_touch_down(self, touch):
#         color = (random(), 1, 1)
#         with self.canvas:
#             Color(*color, mode='hsv')
#             d = 30.
#             Ellipse(pos=(touch.x - d / 2, touch.y - d / 2), size=(d, d))
#             touch.ud['line'] = Line(points=(touch.x, touch.y))

#     def on_touch_move(self, touch):
#         touch.ud['line'].points += [touch.x, touch.y]


class TutorialApp(App):

    def build(self):
      f = FloatLayout()
      s = Scatter()
      l = Label(text="Hello!",
        font_size=150)
      f.add_widget(s)
      s.add_widget(l)
      
      return FloatingPointError


if __name__ == '__main__':
    TutorialApp().run()