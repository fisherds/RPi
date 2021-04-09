const rosebot = require("./rosebot");
const prompt = require('prompt-sync')({sigint: true});

function main() {
  console.log('--------------------------------------------------')
  console.log('Testing the  SERVO classes of a robot')
  console.log('--------------------------------------------------')
  robot = new rosebot.RoseBot();

  // Allow the I2C module an opportunity to finish initialization.
  setTimeout(() => {
    run_servo_test();
  }, 50);
}


function run_servo_test() {
  console.log("Type in a servo number.  Options:")
  console.log("11 --> Camera Tilt");
  console.log("12 --> Arm Joint 1");
  console.log("13 --> Arm Joint 2");
  console.log("14 --> Arm Joint 3");
  console.log("15 --> Gripper");
  let servoNumber = parseInt(prompt("Servo number (11 to 15) or (0 to exit): "));
  if (servoNumber == 0) {
    return;
  }
  let pulseWidth = parseInt(prompt('Pulse width (500 to 2500): '));
  if (pulseWidth == 0) {
    return;
  }
  // prompt('Press the ENTER key when ready for the robot to start moving.');
  if (servoNumber == 11) {
    robot.cameraServo.setPulseWidth(pulseWidth);
  } else if (servoNumber == 12) {
    robot.armServos.setPulseWidth(1, pulseWidth);
  } else if (servoNumber == 13) {
    robot.armServos.setPulseWidth(2, pulseWidth);
  } else if (servoNumber == 14) {
    robot.armServos.setPulseWidth(3, pulseWidth);
  } else if (servoNumber == 15) {
    robot.gripperServo.setPulseWidth(pulseWidth);
  }

  // Allow the I2C an opportunity to run.
  setTimeout(() => {
    run_servo_test();
  }, 50);
}
main();