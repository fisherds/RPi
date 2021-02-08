var rhit = rhit || {};
const apiUrl = "http://localhost:3000/api/";

rhit.LedController = class {
	constructor() {
		// document.querySelector("#newGameButton").onclick = (event) => {
		// 	this.handleNewGame();
		// }
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
