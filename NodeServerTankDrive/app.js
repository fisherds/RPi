const express = require("express");
const bodyParser = require("body-parser");

// Setup
const app = express();
app.use('/', express.static("public"));
app.use('/api/', bodyParser.json());

// Drive
app.get("/api/go/:leftSpeed/:rightSpeed", function (req, res) {
    let leftSpeed = parseInt(req.params.leftSpeed);
    let rightSpeed = parseInt(req.params.rightSpeed);
    res.json({
        "status": "ok",
        "rightSpeed": rightSpeed,
        "leftSpeed": leftSpeed,
    });
});
app.get("/api/stop", function (req, res) {
    res.json({
        "status": "ok"
    });
});

// Servos
app.post("/api/armservos", function (req, res) {
    let angles = req.body.angles;
    res.json({
        "status": "ok",
        "stop": angles,
    });
});
app.get("/api/armservo/:jointIndex/:angle", function (req, res) {
    let jointIndex = parseInt(req.params.jointIndex);
    let angle = parseInt(req.params.angle);
    res.json({
        "status": "ok",
        "jointIndex": jointIndex,
        "angle": angle,
    });
});
app.get("/api/gripper/:distanceInches", function (req, res) {
    let distanceInches = parseInt(req.params.distanceInches);
    res.json({
        "status": "ok",
        "distanceinches": distanceInches,
    });
});
app.get("/api/camera/:tiltAngle", function (req, res) {
    let tiltAngle = parseInt(req.params.tiltAngle);
    res.json({
        "status": "ok",
        "tiltAngle": tiltAngle,
    });
});

// Sensors
app.get("/api/ultrasonic", function (req, res) {
    // TODO: Get the distance
    const distanceInches = 12;
    res.json({
        "status": "ok",
        "distanceInches": distanceInches,
    });
});
app.get("/api/reflective", function (req, res) {
    // TODO: Get the reflective sensor values
    const reflectiveValues = 12;
    res.json({
        "status": "ok",
        "reflectiveValues": reflectiveValues,
    });
});

app.listen(3000);