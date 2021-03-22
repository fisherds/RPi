var rhit = rhit || {};
const apiUrl = "//localhost:3000/api";
// const apiUrl = "//fisherds-pi400.wlan.rose-hulman.edu:3000/api/";

// Reference:
//  GET /api/ledon
//  GET /api/ledoff
//  GET /api/readbutton

//  GET /api/ledon/:color
//  GET /api/ledoff/:color

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
	}
	handleLedOn(color) {
		console.log("Turn the LED on");
		fetch(`${apiUrl}/ledon/${color}`);
	}
	handleLedOff(color) {
		console.log("Turn the LED off");
		fetch(`${apiUrl}/ledoff/${color}`);
	}

	async handleReadPushbuton() {
		console.log("Read the pushbutton and update the label");
		const response = await fetch(`${apiUrl}/readbutton`);
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
