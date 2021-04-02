"""
Authors:  Dave Fisher and PUT_YOUR_NAMES_HERE.
"""
# TODO: Uncomment the modules used for this lab.
import rosebot_drive_system
# import leds
# import arm_and_claw


###############################################################################
#    RoseBot class.
###############################################################################
class RoseBot():
    def __init__(self):
        self.drive_system = rosebot_drive_system.DriveSystem()
