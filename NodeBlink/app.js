const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
var rpio = require('rpio');

// Setup
const app = express();
app.use('/', express.static("public"));

// Setup the pushbutton
const PIN_PUSHBUTTON = 15;
rpio.open(PIN_PUSHBUTTON, rpio.INPUT, rpio.PULL_UP);

// Example of an ISR type concept.
function pushbuttonIsr(pin) {
  // Debounce
  rpio.msleep(20);
  if (rpio.read(pin)) {
    return;
  }
  console.log('Button pressed on pin P%d', pin);
}
rpio.poll(PIN_PUSHBUTTON, pushbuttonIsr, rpio.POLL_LOW);

// Setup the LED
const PIN_LED = 16;
rpio.open(PIN_LED, rpio.OUTPUT, rpio.LOW);

// rpio ref: https://www.npmjs.com/package/rpio
// TODO: learn about the PWM feature to control servos

// API
app.get("/api/ledon", function (req, res) {
  console.log("Turning LED On");
  rpio.write(PIN_LED, rpio.HIGH);
  res.json({
    status: "ok"
  });
});

app.get("/api/ledoff", function (req, res) {
  console.log("Turning LED Off");
  rpio.write(PIN_LED, rpio.LOW);
  res.json({
    status: "ok"
  });
});

app.get("/api/readbutton", function (req, res) {
  console.log('Pushbutton is currently ' + (rpio.read(PIN_PUSHBUTTON) ? 'high' : 'low'));
  res.json({
    isHigh: rpio.read(PIN_PUSHBUTTON)
  });
});

app.listen(3000);