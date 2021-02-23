// var rpio = require('rpio');
// The onoff module was also considered
const pigpio = require('pigpio');

class Motor {
    constructor(pinEnable, pin1, pin2) {
        
        // Using the rpio module... Didn't work for a PWM line.
        // this.pin1 = pin1;
        // this.pin2 = pin2;
        // this.pinEnable = pinEnable;
        // rpio.open(this.pin1, rpio.OUTPUT, rpio.LOW);
        // rpio.open(this.pin2, rpio.OUTPUT, rpio.LOW);
        // rpio.open(this.pinEnable, rpio.PWM);
        // rpio.pwmSetClockDivider(128); /* Set PWM refresh rate to 150kHz */
        // rpio.pwmSetRange(this.pinEnable, 100);
        // rpio.pwmSetData(this.pinEnable, 0);

        this.pin1 = new pigpio.Gpio(pin1, {mode: pigpio.Gpio.OUTPUT});
        this.pin2 = new pigpio.Gpio(pin2, {mode: pigpio.Gpio.OUTPUT});
        this.pwm = new pigpio.Gpio(pinEnable, {mode: pigpio.Gpio.OUTPUT});
    }

    turnOn(speed) {
        speed = (speed < -255) ? -255 : speed;
        speed = (speed > 255) ? 255 : speed;
        if (speed > 0) {
            // Forwards
            // rpio.write(this.pin1, rpio.HIGH);
            // rpio.write(this.pin2, rpio.LOW);
            // rpio.pwmSetData(this.pinEnable, speed);

            this.pin1.digitalWrite(1);
            this.pin2.digitalWrite(0);
            this.pwm.pwmWrite(speed);
        } else if (speed < 0) {
            // Backwards
            // rpio.write(this.pin1, rpio.LOW);
            // rpio.write(this.pin2, rpio.HIGH);
            // rpio.pwmSetData(this.pinEnable, -speed);

            this.pin1.digitalWrite(0);
            this.pin2.digitalWrite(1);
            this.pwm.pwmWrite(-speed);
        } else {
            this.turnOff();
        }
    }

    turnOff() {
        // rpio.write(this.pin1, rpio.LOW);
        // rpio.write(this.pin2, rpio.LOW);
        // rpio.pwmSetData(this.pinEnable, 0);

        this.pin1.digitalWrite(0);
        this.pin2.digitalWrite(0);
        this.pwm.pwmWrite(0);
    }
}


class DriveSystem {
    constructor() {
        console.log("Making a Drive System. Init RPIO in gpiomem = false mode for PWM.")
        // rpio.init({
        //     gpiomem: true, // false to allow PWM
        //     mapping: 'gpio', // Could use gpio to match the Python code.
        //     close_on_exit: true, // On node process exit automatically close rpio
        // });
        pigpio.configureSocketPort(8889);

        // const Motor_A_EN = 7; // GPIO4
        // const Motor_B_EN = 11; // GPIO17  // No PWM!!!

        // const Motor_A_Pin1 = 8; // GPIO14
        // const Motor_A_Pin2 = 10; // GPIO15
        // const Motor_B_Pin1 = 13; // GPIO27
        // const Motor_B_Pin2 = 12; // GPIO18

        // Note: I could've used rpio.init({mapping: 'gpio'}); to match the Python code.
        const Motor_A_EN = 4;
        const Motor_B_EN = 17;  // No PWM!!!

        const Motor_A_Pin1 = 14;
        const Motor_A_Pin2 = 15;
        const Motor_B_Pin1 = 27;
        const Motor_B_Pin2 = 18;
        this.leftMotor = new Motor(Motor_B_EN, Motor_B_Pin1, Motor_B_Pin2);
        this.rightMotor = new Motor(Motor_A_EN, Motor_A_Pin2, Motor_A_Pin1);
    }

    go(leftSpeed, rightSpeed) {
        // Makes the left and right wheel motors spin at the given speeds
        // (which should each be integers between -100 and 100).
        this.leftMotor.turnOn(leftSpeed);
        this.rightMotor.turnOn(rightSpeed);
    }

    stop() {
        this.leftMotor.turnOff();
        this.rightMotor.turnOff();
    }

    goStraightForSeconds(durationS, speed = 50) {
        //     Makes the robot go straight (forward if speed > 0, else backward)
        //     for the given number of seconds at the given speed.
        this.go(speed, speed);
        setTimeout(() => {
            this.stop();
        }, durationS * 1000)
    }
}


module.exports = {
    Motor,
    DriveSystem
}