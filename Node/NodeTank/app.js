const express = require("express");
const bodyParser = require("body-parser");
const rosebot = require("./rosebot");

// Setup
const app = express();
app.use('/', express.static("public"));
app.use('/api/', bodyParser.json());  // TODO: See if this is needed.

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
    res.json({
        "status": "ok"
    });
});

// Servos
app.post("/api/servo/arm_pw", function (req, res) {
    let pulseWidths = req.body.pulseWidths;
    console.log(pulseWidths);
    // robot.armServos.setPulseWidths(pulseWidths);
    res.json({
        "status": "ok",
        "pulseWidths": pulseWidths,
    });
});
app.get("/api/servo/gripper_pw/:pulseWidth", function (req, res) {
    let pulseWidth = parseInt(req.params.pulseWidth);
    // robot.gripperServo.setPulseWidth(pulseWidth);
    res.json({
        "status": "ok",
        "pulseWidth": pulseWidth,
    });
});
app.get("/api/servo/camera_pw/:pulseWidth", function (req, res) {
    let pulseWidth = parseInt(req.params.pulseWidth);
    // robot.cameraServo.setPulseWidth(pulseWidth);
    res.json({
        "status": "ok",
        "pulseWidth": pulseWidth,
    });
});

app.listen(3000);