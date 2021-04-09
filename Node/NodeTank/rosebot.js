const rosebotDriveSystem = require("./rosebotDriveSystem");
const rosebotServos = require("./rosebotServos");

class RoseBot {
    constructor() {
        // Drive motors
        this.driveSystem = new rosebotDriveSystem.DriveSystem();

        // Servos
        this.initializeServos();  // Needs to happen asynchronously so moved into a helper method.
    }

    async initializeServos() {
        const pca9685Driver = await rosebotServos.createPca9685Driver();  // Takes like 40 milliseconds
        this.armServos = new rosebotServos.ArmServos(pca9685Driver);
        this.gripperServo = new rosebotServos.GripperServo(pca9685Driver);
        this.cameraServo = new rosebotServos.CameraServo(pca9685Driver);
    }
}

module.exports = {
    RoseBot
}