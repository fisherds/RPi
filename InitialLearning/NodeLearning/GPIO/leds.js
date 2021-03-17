// Note: pigpio programs should be run via sudo for example:
// sudo node leds.js 
const pigpio = require('pigpio');

function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(n) {
    msleep(n * 1000);
}

function main() {
    console.log("Ready");
    basicLedOn();
    console.log("Goodbye");
}

function basicLedOn() {
    redLed = new pigpio.Gpio(14, {
        mode: pigpio.Gpio.OUTPUT
    });
    for (let k = 0; k < 5; k++) {
        console.log(k);
        redLed.digitalWrite(1);
        sleep(0.5);
        redLed.digitalWrite(0);
        sleep(0.5);
    }

}


main();