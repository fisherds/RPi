var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
const prompt = require('prompt-sync')({
  sigint: true
});

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(n) {
  msleep(n * 1000);
}

function createPca9685Driver() {
  return new Promise((resolve, reject) => {
    var options = {
      i2c: i2cBus.openSync(1),
      address: 0x40,
      frequency: 50,
      debug: false
    };
    pwm = new Pca9685Driver(options, function (err) {

      if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
      }
      console.log("Initialization done");
      resolve(pwm);

      // Set channel 0 to turn on on step 42 and off on step 255
      // (with optional callback)
      // pwm.setPulseRange(0, 42, 255, function() {
      //     if (err) {
      //         console.error("Error setting pulse range.");
      //     } else {
      //         console.log("Pulse range set.");
      //     }
      // });

      // Set the pulse length to 1500 microseconds for channel 2
      //      pwm.setPulseLength(15, 1000);

      // Set the duty cycle to 25% for channel 8
      // pwm.setDutyCycle(8, 0.25);

      // Turn off all power to channel 6
      // (with optional callback)
      // pwm.channelOff(6, function() {
      //     if (err) {
      //         console.error("Error turning off channel.");
      //     } else {
      //         console.log("Channel 6 is off.");
      //     }
      // });

      // Turn on channel 3 (100% power)
      // pwm.channelOn(3);
    });
  });
}

// async function main() {
//   const pwm = await createPca9685Driver();
//   pwm.setPulseLength(15, 1000);



//   while (true) {
//     let pulseWidth = parseInt(prompt('Pulse width (500 to 2500): '));
//     if (pulseWidth == 0) {
//       break;
//     }
//     prompt('Press the ENTER key when ready for the robot to start moving.');
//     pwm.setPulseLength(15, pulseWidth);
//   }
// }
// main()


// createPca9685Driver().then((pwm) => {
//   pwm.setPulseLength(15, 1000);

//   while (true) {
//     let pulseWidth = parseInt(prompt('Pulse width (500 to 2500): '));
//     if (pulseWidth == 0) {
//       break;
//     }
//     prompt('Press the ENTER key when ready for the robot to start moving.');
//     pwm.setPulseLength(15, pulseWidth);
//   }

//   console.log("goodbye");
// });