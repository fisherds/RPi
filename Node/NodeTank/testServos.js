const rosebot = require("./rosebot");
const prompt = require('prompt-sync')({sigint: true});

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
  msleep(n*1000);
}

async function main() {
  console.log('--------------------------------------------------')
  console.log('Testing the  SERVO classes of a robot')
  console.log('--------------------------------------------------')
  robot = new rosebot.RoseBot();
  await robot.initializeServos();

  while (true) {
    console.log("Type in a servo number.  Options:")
    console.log("11 --> Camera Tilt");
    console.log("12 --> Arm Joint 1");
    console.log("13 --> Arm Joint 2");
    console.log("14 --> Arm Joint 3");
    console.log("15 --> Gripper");
    let servoNumber = parseInt(prompt("Servo number (11 to 15) or (0 to exit): "));
    if (servoNumber == 0) {
      break;
    }
    let pulseWidth = parseInt(prompt('Pulse width (500 to 2500): '));
    if (pulseWidth == 0) {
      break;
    }
    prompt('Press the ENTER key when ready for the robot to start moving.');
    // # -------------------------------------------------------------------------
    // # TODO: Call the  go  method of the   driveSystem   of the robot,
    // #   sending it the two wheel speeds.  Keep going (sleep) for 3 seconds.
    // #   Then call the  stop  method of the   driveSystem   of the robot.
    // # -------------------------------------------------------------------------

    // Solution to be removed
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
  }
}

main();
