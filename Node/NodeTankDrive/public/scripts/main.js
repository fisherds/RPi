var rhit = rhit || {};
// const apiUrl = "//localhost:3000/api";
// const apiUrl = "//fisherds-pi400.wlan.rose-hulman.edu:3000/api";
const apiUrl = "//fisherds-tank.dhcp.rose-hulman.edu:3000/api";

//Reference :
// GET    /api/motor/go/:leftSpeed/:rightSpeed
// GET    /api/motor/stop
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
		fetch(`${apiUrl}/motor/go/${leftSpeed}/${rightSpeed}`);
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
