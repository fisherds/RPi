const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
var rpio = require('rpio');
const {
  setupMaster
} = require("cluster");

// Setup
const app = express();
app.use('/', express.static("public"));
app.use('/api/', bodyParser.json());

// Load data from a file.
let data = [];
const serverSideStorage = "../data/db.json";
fs.readFile(serverSideStorage, function (err, buf) {
  if (err) {
    console.log("error: ", err);
  } else {
    data = JSON.parse(buf.toString());
  }
  console.log("Data read from file.");
});

function saveToServer(data) {
  fs.writeFile(serverSideStorage, JSON.stringify(data), function (err, buf) {
    if (err) {
      console.log("error: ", err);
    } else {
      console.log("Data saved successfully!");
    }
  })
}

// Setup
const PIN_PUSHBUTTON = 15;
rpio.open(PIN_PUSHBUTTON, rpio.INPUT, rpio.PULL_UP);

function pushbuttonIsr(pin) {
  // Debounce
  rpio.msleep(20);
  if (rpio.read(pin)) {
    return;
  }
  console.log('Button pressed on pin P%d', pin);
}
rpio.poll(PIN_PUSHBUTTON, pushbuttonIsr, rpio.POLL_LOW);

const PIN_LED = 16;
rpio.open(PIN_LED, rpio.OUTPUT, rpio.LOW);

// Note about other rpio features:
// I read this doc: https://www.npmjs.com/package/rpio
// has a PWM feature, where you set the max value
// does not use interrupts but there is a poll option which is VERY similar
// Has i2c (designed for LCD usage) and SPI, but I doubt I use either




app.get("/api/ledon", function (req, res) {
  rpio.write(PIN_LED, rpio.HIGH);
  res.json({
    status: "ok"
  });
});

app.get("/api/ledoff", function (req, res) {
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


// Reference
// app.put("/api/admin/word/:id", function (req, res) {
//     let id = parseInt(req.params.id);
//     let word = req.body.word
//     data[id] = word;
//     saveToServer(data);
//     res.status(201);
//     res.json({
//         "word": word,
//         "index": id
//     });
// })

app.listen(3000);