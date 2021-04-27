var rhit = rhit || {};

rhit.FbCommandManager = class {
	constructor() {
	}
}

rhit.TankDriveController = class {
	constructor() {
		const buttons = document.querySelectorAll(".driveButton");
		for (const button of buttons) {

			// Good for a mobile device:
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
	}
	sendDriveCommand(leftMultiplier, rightMultiplier) {
		console.log("Multipliers:", leftMultiplier, rightMultiplier);
		const baseSpeed = parseFloat(document.querySelector("#baseSpeed").value)
		const leftSpeed = Math.round(baseSpeed * leftMultiplier);
		const rightSpeed = Math.round(baseSpeed * rightMultiplier);
		console.log("Speeds:", leftSpeed, rightSpeed);
		// fetch(`api/motor/go/${leftSpeed}/${rightSpeed}`);


	}
	sendStop() {
		// fetch(`api/motor/stop`);
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
