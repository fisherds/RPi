const express = require("express");
const bodyParser = require("body-parser");
const rosebot = require("./rosebot");

// Setup
const app = express();
app.use('/', express.static("public"));
app.use('/api/', bodyParser.json());

const robot = new rosebot.Rosebot()

// Drive
app.get("/api/motor/go/:leftSpeed/:rightSpeed", function (req, res) {
    let leftSpeed = parseInt(req.params.leftSpeed);
    let rightSpeed = parseInt(req.params.rightSpeed);
    console.log(`Motor go ${leftSpeed} ${rightSpeed}`);
    robot.driveSystem.rightMotor.go(leftSpeed, rightSpeed);
    res.json({
        "status": "ok",
        "rightSpeed": rightSpeed,
        "leftSpeed": leftSpeed,
    });
});
app.get("/api/motor/stop", function (req, res) {
    robot.driveSystem.rightMotor.stop();
    res.json({
        "status": "ok"
    });
});

// Servos
app.post("/api/servo/arm", function (req, res) {
    let angles = req.body.angles;
    res.json({
        "status": "ok",
        "stop": angles,
    });
});
app.get("/api/servo/gripper/:distanceInches", function (req, res) {
    let distanceInches = parseFloat(req.params.distanceInches);
    res.json({
        "status": "ok",
        "distanceinches": distanceInches,
    });
});
app.get("/api/servo/camera/:tiltAngle", function (req, res) {
    let tiltAngle = parseInt(req.params.tiltAngle);
    res.json({
        "status": "ok",
        "tiltAngle": tiltAngle,
    });
});

// Sensors
app.get("/api/sensor/ultrasonic", function (req, res) {
    // TODO: Get the distance
    const distanceInches = 12;
    res.json({
        "status": "ok",
        "distanceInches": distanceInches,
    });
});
app.get("/api/sensor/reflective", function (req, res) {
    // TODO: Get the reflective sensor values
    const reflectiveValues = 12;
    res.json({
        "status": "ok",
        "reflectiveValues": reflectiveValues,
    });
});

app.listen(3000);