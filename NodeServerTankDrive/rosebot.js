const drive = require("./rosebot_drive_system");

class Rosebot {
    constructor() {
        this.driveSystem = new drive.DriveSystem()
    }
}



module.exports = {
    Rosebot
}