var rhit = rhit || {};
const apiUrl = "//localhost:3000/api";
// const apiUrl = "//fisherds-pi400.wlan.rose-hulman.edu:3000/api/";

// Reference:
//  GET /api/ledon
//  GET /api/ledoff
//  GET /api/readbutton

rhit.LedController = class {
	constructor() {
		document.querySelector("#ledOnButton").onclick = (event) => {
			this.handleLedOn();
		}
		document.querySelector("#ledOffButton").onclick = (event) => {
			this.handleLedOff();
		}
		document.querySelector("#readButton").onclick = (event) => {
			this.handleReadPushbuton();
		}
	}
	handleLedOn() {
		console.log("Turn the LED on");
		fetch(`${apiUrl}/ledon`);
	}
	handleLedOff() {
		console.log("Turn the LED off");
		fetch(`${apiUrl}/ledoff`);
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
