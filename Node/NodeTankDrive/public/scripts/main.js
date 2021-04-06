var rhit = rhit || {};

//Reference :
// GET    /api/motor/go/:leftSpeed/:rightSpeed
// GET    /api/motor/stop
// POST   /api/servo/arm_pw      with body {"pulseWidths": [#,#,#]}
// GET    /api/servo/gripper_pw/:pulseWidth
// GET    /api/servo/camera_pw/:pulseWidth

// Later:
// POST   /api/servo/arm      with body {"angles": [#,#,#]}
// GET    /api/servo/gripper/:distanceInches
// GET    /api/servo/camera/:tiltAngle

rhit.TankDriveController = class {
	constructor() {
		const buttons = document.querySelectorAll(".driveButton");
		for (const button of buttons) {
			button.onclick = (event) => {
				const leftMultiplier = parseFloat(button.dataset.leftMultiplier);
				const rightMultiplier = parseFloat(button.dataset.rightMultiplier);
				this.sendDriveCommand(leftMultiplier, rightMultiplier);
			}
		}
	}
	sendDriveCommand(leftMultiplier, rightMultiplier) {
		console.log("Multipliers:", leftMultiplier, rightMultiplier);
		const baseSpeed = parseFloat(document.querySelector("#baseSpeed").value)
		const leftSpeed = Math.round(baseSpeed * leftMultiplier);
		const rightSpeed = Math.round(baseSpeed * rightMultiplier);
		console.log("Speeds:", leftSpeed, rightSpeed);
		fetch(`api/motor/go/${leftSpeed}/${rightSpeed}`);
	}
}

/* Main */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#mainPage")) {
		console.log("On the main page");
		new rhit.TankDriveController();
	}
};

rhit.main();
