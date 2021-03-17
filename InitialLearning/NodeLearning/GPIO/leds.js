const Gpio = require('pigpio').Gpio;

function main() {
    console.log("Ready");
    basicLedOn();
}

function basicLedOn() {
    redLed = new Gpio(14, {
        mode: Gpio.OUTPUT
    });
    
    redLed.digitalWrite(0);
    

}


main();