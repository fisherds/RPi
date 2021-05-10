import gpiozero as gz

class UltrasonicSensor:
    def __init__(self):
        self.sensor = gz.DistanceSensor(echo=8, trigger=11)

    # return distance in cm
    def get_distance(self):
        return self.sensor.distance * 100


class LineSensors:
    def __init__(self):
        self.left_line = gz.LineSensor(20)
        self.middle_line = gz.LineSensor(16)
        self.right_line = gz.LineSensor(19)

    def get_left_value(self):
        return self.left_line.value

    def get_middle_value(self):
        return self.middle_line.value

    def get_right_value(self):
        return self.right_line.value

# Testing for development
if __name__ == '__main__':
    print("Goodbye")
