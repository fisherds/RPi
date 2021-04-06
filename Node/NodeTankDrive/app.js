const express = require("express");
const bodyParser = require("body-parser");
// const rosebot = require("./rosebot");

// Setup
const app = express();
app.use('/', express.static("public"));
app.use('/api/', bodyParser.json());  // TODO: See if this is needed.

// const robot = new rosebot.Rosebot()

// Drive
app.get("/api/motor/go/:leftSpeed/:rightSpeed", function (req, res) {
    let leftSpeed = parseInt(req.params.leftSpeed);
    let rightSpeed = parseInt(req.params.rightSpeed);
    console.log(`Motor go ${leftSpeed} ${rightSpeed}`);
    // robot.driveSystem.go(leftSpeed, rightSpeed);
    res.json({
        "status": "ok",
        "rightSpeed": rightSpeed,
        "leftSpeed": leftSpeed,
    });
});
app.get("/api/motor/stop", function (req, res) {
    // robot.driveSystem.stop();
    res.json({
        "status": "ok"
    });
});

// Servos
app.post("/api/servo/arm", function (req, res) {
    let pulseWidths = req.body.pulseWidths;
    // robot.armServos.setPulseWidths()
    res.json({
        "status": "ok",
        "pulseWidths": pulseWidths,
    });
});
app.get("/api/servo/gripper/:pulseWidth", function (req, res) {
    let pulseWidth = parseFloat(req.params.pulseWidth);
    // robot.gripperServo.pulseWidth = pulseWidth;
    res.json({
        "status": "ok",
        "pulseWidth": distanceIpulseWidthnches,
    });
});
app.get("/api/servo/camera/:pulseWidth", function (req, res) {
    let pulseWidth = parseInt(req.params.pulseWidth);
    // robot.cameraServo.pulseWidth = pulseWidth;
    res.json({
        "status": "ok",
        "pulseWidth": pulseWidth,
    });
});

// Sensors
app.get("/api/sensor/ultrasonic", function (req, res) {
    // TODO: Get the distance
    // const distanceInches = robot.ultrasonicSensor.getValue();
    const distanceInches = 12;
    res.json({
        "status": "ok",
        "distanceInches": distanceInches,
    });
});
app.get("/api/sensor/reflective", function (req, res) {
    // TODO: Get the reflective sensor values
    // const reflectiveValues = robot.irSensor.getValues();
    const reflectiveValues = 12;
    res.json({
        "status": "ok",
        "reflectiveValues": reflectiveValues,
    });
});

app.listen(3000);