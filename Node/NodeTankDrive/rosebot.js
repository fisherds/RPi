const drive = require("./rosebot_drive_system");

class RoseBot {
    constructor() {
        this.driveSystem = new drive.DriveSystem()
    }
}


module.exports = {
    RoseBot
}