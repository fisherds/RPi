var rpio = require('rpio');

class Motor {

    // GPIO.setup(pin_enable, GPIO.OUT)
    // GPIO.setup(pin_1, GPIO.OUT)
    // GPIO.setup(pin_2, GPIO.OUT)
    // self.pin_1 = pin_1
    // self.pin_2 = pin_2
    // self.pwm = GPIO.PWM(pin_enable, 1000) # Use a 1000 Hz frequency
    // self.turn_off()

    constructor(pinEnable, pin1, pin2) {
        rpio.open(pinEnable, rpio.OUTPUT, rpio.LOW);
        rpio.open(pin1, rpio.OUTPUT, rpio.LOW);
        rpio.open(pin2, rpio.OUTPUT, rpio.LOW);
        this.pin1 = pin1;
        this.pin2 = pin2;
    }

    go() {
        console.log("Motor go");
        rpio.write(this.pin1, rpio.HIGH);
        rpio.write(this.pin2, rpio.HIGH);

    }

    stop() {
        console.log("Motor stop");
        rpio.write(this.pin1, rpio.LOW);
        rpio.write(this.pin2, rpio.LOW);

    }
}


class DriveSystem {
    constructor() {
        console.log("Making a Drive System")

        const Motor_A_EN = 7;   // GPIO4
        const Motor_B_EN = 11;   // GPIO17

        const Motor_A_Pin1 = 8;   // GPIO14
        const Motor_A_Pin2 = 10;   // GPIO15
        const Motor_B_Pin1 = 13;   // GPIO27
        const Motor_B_Pin2 = 12;   // GPIO18
        this.leftMotor = new Motor(Motor_B_EN, Motor_B_Pin1, Motor_B_Pin2);
        this.rightMotor = new Motor(Motor_A_EN, Motor_A_Pin2, Motor_A_Pin1);
    }
}


module.exports = {
    Motor,
    DriveSystem
}