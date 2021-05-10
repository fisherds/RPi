import rosebot_drive_system
import rosebot_servos
import rosebot_sensors

class RoseBot:
  def __init__(self):
    self.drive_system = rosebot_drive_system.DriveSystem()
    self.servos = rosebot_servos.Servos()
    self.ultrasonic_sensor = rosebot_sensors.UltrasonicSensor()
    self.line_sensors = rosebot_sensors.LineSensors()
