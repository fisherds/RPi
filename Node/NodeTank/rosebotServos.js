var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;

const SERVO_PIN_CAMERA_TILT = 11;
const SERVO_PIN_ARM_JOINT_1 = 12;
const SERVO_PIN_ARM_JOINT_2 = 13;
const SERVO_PIN_ARM_JOINT_3 = 14;
const SERVO_PIN_GRIPPER = 15;

function createPca9685Driver() {
    return new Promise((resolve, reject) => {
        var options = {
            i2c: i2cBus.openSync(1),
            address: 0x40,
            frequency: 50,
            debug: false
        };
        console.time("Initialized the Pca9685Driver");
        const servoDriver = new Pca9685Driver(options, (err) => {
            // Asynchronous callback that takes some time.
            if (err) {
                console.error("Error initializing PCA9685");
                process.exit(-1);
                reject(err);
            }
            console.timeEnd("Initialized the Pca9685Driver");
            resolve(servoDriver);
        });
    });
}

class ArmServos {
    constructor(pca9685Driver) {
        this.pca9685Driver = pca9685Driver;
    }
    setPulseWidth(jointNumber, pulseWidth) {
        // Assumes the joint number is 1, 2, or 3
        if (jointNumber == 1) {
            this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_1, pulseWidth);
        } else if (jointNumber == 2) {
            this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_2, pulseWidth);
        } else if (jointNumber == 3) {
            this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_3, pulseWidth);
        } else {
            console.log("Invalid arm joint number. ", jointNumber);
        }
    }
    setPulseWidths(pulseWidths) {
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_1, pulseWidths[0]);
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_2, pulseWidths[1]);
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_3, pulseWidths[2]);
    }
}

class GripperServo {
    constructor(pca9685Driver) {
        this.pca9685Driver = pca9685Driver;
    }
    setPulseWidth(pulseWidth) {
        console.log("Move gripper to ", pulseWidth);
        this.pca9685Driver.setPulseLength(SERVO_PIN_GRIPPER, pulseWidth);
    }
}

class CameraServo {
    constructor(pca9685Driver) {
        this.pca9685Driver = pca9685Driver;
    }
    setPulseWidth(pulseWidth) {
        this.pca9685Driver.setPulseLength(SERVO_PIN_CAMERA_TILT, pulseWidth);
    }
}

module.exports = {
    createPca9685Driver,
    ArmServos,
    GripperServo,
    CameraServo
}