const rosebotDriveSystem = require("./rosebotDriveSystem");

class RoseBot {
    constructor() {
        // Drive motors
        this.driveSystem = new rosebotDriveSystem.DriveSystem();
    }
}


module.exports = {
    RoseBot
}