const express = require("express");
const Gpio = require('pigpio').Gpio;

// Setup
const app = express();
app.use('/', express.static("public"));

// Setup the pushbutton
const pushbutton = new Gpio(25, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP
});

// Setup the LED
const redLed = new Gpio(14, {
  mode: Gpio.OUTPUT
});
const yellowLed = new Gpio(15, {
  mode: Gpio.OUTPUT
});
const blueLed = new Gpio(18, {
  mode: Gpio.OUTPUT
});
const servo = new Gpio(17, {
  mode: Gpio.OUTPUT
});
const motorA = new Gpio(22, {
  mode: Gpio.OUTPUT
});
const motorB = new Gpio(23, {
  mode: Gpio.OUTPUT
});
const motorEnable = new Gpio(24, {
  mode: Gpio.OUTPUT
});




// API
app.get("/api/ledon", function (req, res) {
  console.log("Turning LED On");
  led.digitalWrite(1);
  res.json({
    status: "ok"
  });
});

app.get("/api/ledoff", function (req, res) {
  console.log("Turning LED Off");
  led.digitalWrite(0);
  res.json({
    status: "ok"
  });
});

app.get("/api/ledon/:color", function (req, res) {
  const color = req.params.color;
  console.log("Turning LED On for color: " + color);
  setLed(color, 1);
  res.json({
    status: "ok"
  });
});

app.get("/api/ledoff/:color", function (req, res) {
  const color = req.params.color;
  console.log("Turning LED for color: " + color);
  setLed(color, 0);
  res.json({
    status: "ok"
  });
});

function setLed(color, value) {
  if (color == 'r') {
    redLed.digitalWrite(value);
  } else if (color == 'y') {
    yellowLed.digitalWrite(value);
  } else if (color == 'b') {
    blueLed.digitalWrite(value);
  } else {
    console.log("Unknown LED color: " + color);
  }
}

app.get("/api/readbutton", function (req, res) {
  console.log('Pushbutton is currently ' + pushbutton.digitalRead());
  res.json({
    isHigh: pushbutton.digitalRead()
  });
});

app.get("/api/servo/:pulseWidth", function (req, res) {
  const pulseWidth = req.params.pulseWidth;
  console.log(typeof pulseWidth);
  console.log("Servo for pulseWidth: " + pulseWidth);
  servo.servoWrite(pulseWidth);
  res.json({
    status: "ok"
  });
});

app.get("/api/motor/:dutyCycle", function (req, res) {
  const dutyCycle = parseInt(req.params.dutyCycle);
  console.log("Servo for dutyCycle: " + dutyCycle);
  if (dutyCycle < 0) {
    motorA.digitalWrite(1);
    motorB.digitalWrite(0);
    motorEnable.pwmWrite(-dutyCycle);
  } else if (dutyCycle > 0) {
    motorA.digitalWrite(0);
    motorB.digitalWrite(1);
    motorEnable.pwmWrite(dutyCycle);
  } else {
    motorA.digitalWrite(0);
    motorB.digitalWrite(0);
    motorEnable.pwmWrite(0);
  }
  res.json({
    status: "ok"
  });
});

app.listen(3000);