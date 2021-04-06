const rosebotDriveSystem = require("./rosebotDriveSystem");
const rosebotServos = require("./rosebotServos");
const rosebotSensors = require("./rosebotSensors");

class RoseBot {
    constructor() {
        // Drive motors
        this.driveSystem = new rosebotDriveSystem.DriveSystem();

        // Servos
        const pca9685Driver = new rosebotServos.createPca9685Driver();
        this.armServos = new rosebotServos.ArmServos(pca9685Driver);
        this.gripperServo = new rosebotServos.GripperServo(pca9685Driver);
        this.cameraServo = new rosebotServos.CameraServo(pca9685Driver);

        // Sensors
        this.ultrasonicSensor = new rosebotSensors.UltrasonicSensor();
        this.irSensor = new rosebotSensors.IrSensor();

        // LEDs
    }
}


module.exports = {
    RoseBot
}