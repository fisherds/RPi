var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
const prompt = require('prompt-sync')({sigint: true}); 

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
  msleep(n*1000);
}

var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: false
};
pwm = new Pca9685Driver(options, function(err) {
    if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
    }
    console.log("Initialization done");

    // Set channel 0 to turn on on step 42 and off on step 255
    // (with optional callback)
    pwm.setPulseRange(15, 42, 255, function() {
        if (err) {
            console.error("Error setting pulse range.");
        } else {
            console.log("Pulse range set.");
        }
    });

    // Set the pulse length to 1500 microseconds for channel 2
    pwm.setPulseLength(15, 1500);

  while (true) {
    let pulseWidth = parseInt(prompt('Pulse width (500 to 2500): '));
    if (pulseWidth == 0) {
      break;
    }
    prompt('Press the ENTER key when ready for the robot to start moving.');
    pwm.setPulseLength(15, pulseWidth);
    sleep(2);
  }

    
});