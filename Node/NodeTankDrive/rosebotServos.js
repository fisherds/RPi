var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;

const SERVO_PIN_CAMERA = 11
const SERVO_PIN_ARM_1 = 12
const SERVO_PIN_ARM_2 = 13
const SERVO_PIN_ARM_3 = 14
const SERVO_PIN_GRIPPER = 15

function createPca9685Driver() {
    var options = {
        i2c: i2cBus.openSync(1),
        address: 0x40,
        frequency: 50,
        debug: false
    };
    return new Pca9685Driver(options, function(err) {
        if (err) {
            console.error("Error initializing PCA9685");
            process.exit(-1);
        }
        console.log("Initialization done for the Pca9685Driver");
    });
}

class ArmServos {
    constructor(pca9685Driver) {
        this.pca9685Driver = pca9685Driver;
    }
    setPulseWidths(pulseWidths) {
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_1, pulseWidths[0]);
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_2, pulseWidths[1]);
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_3, pulseWidths[2]);
    }
}

class GripperServo {
    constructor(pca9685Driver) {
        this.pca9685Driver = pca9685Driver;
    }
    setPulseWidth(pulseWidth) {
        this.pca9685Driver.setPulseLength(SERVO_PIN_GRIPPER, pulseWidth);
    }
}

class CameraServo {
    constructor(pca9685Driver) {
        this.pca9685Driver = pca9685Driver;
    }
    setPulseWidth(pulseWidth) {
        this.pca9685Driver.setPulseLength(SERVO_PIN_CAMERA, pulseWidth);
    }
}


module.exports = {
    createPca9685Driver,
    ArmServos,
    GripperServo,
    CameraServo
}