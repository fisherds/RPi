const pigpio = require('pigpio');

function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(n) {
    msleep(n * 1000);
}

function main() {
    console.log("Ready");
    // pigpio.configureSocketPort(8889);
    basicLedOn();
    console.log("Goodbye");
}

function basicLedOn() {
    redLed = new pigpio.Gpio(14, {
        mode: pigpio.Gpio.OUTPUT
    });

    redLed.digitalWrite(0);


}


main();