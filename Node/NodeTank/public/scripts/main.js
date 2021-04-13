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
			// button.onclick = (event) => {
			// 	const leftMultiplier = parseFloat(button.dataset.leftMultiplier);
			// 	const rightMultiplier = parseFloat(button.dataset.rightMultiplier);
			// 	this.sendDriveCommand(leftMultiplier, rightMultiplier);
			// }


			button.onmousedown = (event) => {
				const leftMultiplier = parseFloat(button.dataset.leftMultiplier);
				const rightMultiplier = parseFloat(button.dataset.rightMultiplier);
				this.sendDriveCommand(leftMultiplier, rightMultiplier);
			}
			button.onmouseup = (event) => {
				this.sendStop();
			}
		}

		document.onkeydown = (event) => {
			this.handleKeypress(event);
		}
		document.onkeyup = (event) => {
			this.handleKeypress(event);
		}
		document.querySelector("#servo11").onchange = (event) => {
			console.log("Servo 11 slider = ", event.target.value);
			document.querySelector("#servo11readout").innerHTML = event.target.value;
			fetch(`api/servo/camera_pw/${event.target.value}`);
		}
		document.querySelector("#servo12").onchange = (event) => {
			console.log("Servo 12 slider = ", event.target.value);
			document.querySelector("#servo12readout").innerHTML = event.target.value;
			fetch(`api/servo/arm_pw/1/${event.target.value}`);
		}
		document.querySelector("#servo13").onchange = (event) => {
			console.log("Servo 13 slider = ", event.target.value);
			document.querySelector("#servo13readout").innerHTML = event.target.value;
			fetch(`api/servo/arm_pw/2/${event.target.value}`);
		}
		document.querySelector("#servo14").onchange = (event) => {
			console.log("Servo 14 slider = ", event.target.value);
			document.querySelector("#servo14readout").innerHTML = event.target.value;
			fetch(`api/servo/arm_pw/3/${event.target.value}`);
		}
		document.querySelector("#servo15").onchange = (event) => {
			console.log("Servo 15 slider = ", event.target.value);
			document.querySelector("#servo15readout").innerHTML = event.target.value;
			fetch(`api/servo/gripper_pw/${event.target.value}`);
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
	sendStop() {
		fetch(`api/motor/stop`);
	}

	handleKeypress(event) {
		console.log(`Event type: ${event.type}  Key:  ${event.key}`);
		if (event.type == "keydown") {
			if (event.key == "ArrowUp") {
				this.sendDriveCommand(1, 1);
			} else if (event.key == "ArrowDown") {
				this.sendDriveCommand(-1, -1);
			} else if (event.key == "ArrowLeft") {
				this.sendDriveCommand(-1, 1);
			} else if (event.key == "ArrowRight") {
				this.sendDriveCommand(1, -1);
			} 
		} else if (event.type == "keyup") {
			this.sendStop();
		}
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
