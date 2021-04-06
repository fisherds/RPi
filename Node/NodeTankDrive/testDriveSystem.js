const rosebot = require("./rosebot");
const prompt = require('prompt-sync')({sigint: true});

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
  msleep(n*1000);
}

function main() {
  console.log('--------------------------------------------------')
  console.log('Testing the  DRIVE SYSTEM  of a robot')
  console.log('--------------------------------------------------')
  robot = new rosebot.RoseBot()

  while (true) {
    console.log("Wheel speeds should be integers between -100 and 100.")
    console.log("Enter values of 0 for both to exit.")
    let leftWheelSpeed = parseInt(prompt('Enter an integer for left wheel speed: '));
    let rightWheelSpeed = prompt('Enter an integer for right wheel speed: ');
    rightWheelSpeed = parseInt(rightWheelSpeed);
    if (leftWheelSpeed == 0 && rightWheelSpeed == 0) {
      break;
    }
    prompt('Press the ENTER key when ready for the robot to start moving.');
    // # -------------------------------------------------------------------------
    // # TODO: Call the  go  method of the   driveSystem   of the robot,
    // #   sending it the two wheel speeds.  Keep going (sleep) for 3 seconds.
    // #   Then call the  stop  method of the   driveSystem   of the robot.
    // # -------------------------------------------------------------------------

    // Solution to be removed
    robot.driveSystem.go(leftWheelSpeed, rightWheelSpeed);
    sleep(3);
    robot.driveSystem.stop();
  }
}

main();
