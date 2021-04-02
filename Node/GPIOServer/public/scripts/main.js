var rhit = rhit || {};

// Reference:
//  GET /api/ledon
//  GET /api/ledoff
//  GET /api/readbutton

//  GET /api/ledon/:color
//  GET /api/ledoff/:color

//  GET /api/servo/:angle
//  GET /api/motor/:pwm


rhit.LedController = class {
	constructor() {
		document.querySelector("#redLedOnButton").onclick = (event) => {
			this.handleLedOn('r');
		}
		document.querySelector("#redLedOffButton").onclick = (event) => {
			this.handleLedOff('r');
		}
		document.querySelector("#yellowLedOnButton").onclick = (event) => {
			this.handleLedOn("y");
		}
		document.querySelector("#yellowLedOffButton").onclick = (event) => {
			this.handleLedOff("y");
		}
		document.querySelector("#blueLedOnButton").onclick = (event) => {
			this.handleLedOn("b");
		}
		document.querySelector("#blueLedOffButton").onclick = (event) => {
			this.handleLedOff("b");
		}
		document.querySelector("#readButton").onclick = (event) => {
			this.handleReadPushbuton();
		}

		document.querySelector("#servoSlider").onchange = (event) => {
			console.log("Servo slider = ", event.target.value);
			fetch(`api/servo/${event.target.value}`);
		}

		document.querySelector("#motorSlider").onchange = (event) => {
			console.log("Motor slider = ", event.target.value);
			fetch(`api/motor/${event.target.value}`);
		}

		
	}
	handleLedOn(color) {
		console.log("Turn the LED on");
		fetch(`api/ledon/${color}`);
	}
	handleLedOff(color) {
		console.log("Turn the LED off");
		fetch(`api/ledoff/${color}`);
	}

	async handleReadPushbuton() {
		console.log("Read the pushbutton and update the label");
		const response = await fetch(`api/readbutton`);
		const data = await response.json();
		console.log(data);
		const output = "The pushbutton is " + (data["isHigh"] == 1 ? "HIGH" : "LOW");
		console.log(output);
		document.querySelector("#pushbuttonOutput").innerHTML = output;
	}
}

/* Main */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#mainPage")) {
		console.log("On the main page");
		new rhit.LedController();
	}
};

rhit.main();
