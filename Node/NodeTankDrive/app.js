const express = require("express");
const rosebot = require("./rosebot");

// Setup
const app = express();
app.use('/', express.static("public"));

const robot = new rosebot.RoseBot()

// Drive
app.get("/api/motor/go/:leftSpeed/:rightSpeed", function (req, res) {
    let leftSpeed = parseInt(req.params.leftSpeed);
    let rightSpeed = parseInt(req.params.rightSpeed);
    console.log(`Motor go ${leftSpeed} ${rightSpeed}`);
    robot.driveSystem.go(leftSpeed, rightSpeed);
    res.json({
        "status": "ok",
        "rightSpeed": rightSpeed,
        "leftSpeed": leftSpeed,
    });
});
app.get("/api/motor/stop", function (req, res) {
    robot.driveSystem.stop();
    console.log(`Motor stop`);
    res.json({
        "status": "ok"
    });
});

app.listen(3000);