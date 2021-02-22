var rhit = rhit || {};
const apiUrl = "http://localhost:3000/api/";
//Reference :
// GET    /api/motor/go/:leftSpeed/:rightSpeed
// GET    /api/motor/stop
// POST   /api/servo/arm      with body {"angles": [#,#,#]}
// GET    /api/servo/gripper/:distanceInches
// GET    /api/servo/camera/:tiltAngle
// GET    /api/sensor/ultrasonic
// GET    /api/sensor/reflective

const playerApiUrl = "http://localhost:3000/api/player/";
//Reference (The player api never shares the word. It is a secret.):
// GET    /api/player/numwords    											- Get the number of words
// GET    /api/player/wordlength/:id								 		- Get the length of a single word at index
// GET    /api/player/guess/:id/:letter								  - Guess a letter in a word

rhit.AdminController = class {
	constructor() {
		// Connect the buttons to their corresponding methods.
		document.querySelector("#addButton").onclick = (event) => {
			const createWordInput = document.querySelector("#createWordInput");
			this.add(createWordInput.value);
			createWordInput.value = "";
		};
		document.querySelector("#readAllButton").onclick = (event) => {
			this.readAll();
		};
		document.querySelector("#readSingleButton").onclick = (event) => {
			const readIndexInput = document.querySelector("#readIndexInput");
			this.readSingle(parseInt(readIndexInput.value));
			readIndexInput.value = "";
		};
		document.querySelector("#updateButton").onclick = (event) => {
			const updateIndexInput = document.querySelector("#updateIndexInput");
			const updateWordInput = document.querySelector("#updateWordInput");
			this.update(parseInt(updateIndexInput.value), updateWordInput.value);
			updateIndexInput.value = "";
			updateWordInput.value = "";
		};
		document.querySelector("#deleteButton").onclick = (event) => {
			const deleteIndexInput = document.querySelector("#deleteIndexInput");
			this.delete(parseInt(deleteIndexInput.value));
			deleteIndexInput.value = "";
		};
	}

	add(word) {
		if (!word) {
			console.log("No word provided.  Ignoring request.");
			return;
		}
		console.log(`TODO: Add the word ${word} to the backend`);
		// TODO: Add your code here.

		// SOLUTION to be removed
		let data = {
			"word": word
		};
		fetch(adminApiUrl + "add", {
			method: "POST",
			headers: {
				"Content-Type": 'application/json'
			},
			body: JSON.stringify(data)
		}).then(res => res.json()).then((result) => {
			console.log("Added the word. Got the result: ", result);
		});
	}

	readAll() {
		console.log(`TODO: Read all the words from the backend, then update the screen.`);
		
		// TODO: Add your code here.
		// document.querySelector("#readAllOutput").innerHTML = "Results go here."

		// SOLUTION to be removed
		fetch(adminApiUrl + "words").then(res => res.json()).then((result) => {
			console.log("Got the results: ", result);
			document.querySelector("#readAllOutput").innerHTML = result.words
		});
		
	}

	readSingle(index) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		console.log(`TODO: Read the word for index ${index} from the backend, then update the screen.`);

		// TODO: Add your code here.
		// document.querySelector("#readSingleOutput").innerHTML = "Result goes here"

		// SOLUTION to be removed
		fetch(adminApiUrl + `word/${index}`).then(res => res.json()).then((result) => {
			document.querySelector("#readSingleOutput").innerHTML = result.word
		});
	}

	update(index, word) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		if (!word) {
			console.log("No word provided.  Ignoring request.");
			return;
		}
		console.log(`TODO: Update the word ${word} at index ${index} on the backend.`);
		// TODO: Add your code here.


		// SOLUTION to be removed
		let data = {
			"word": word
		};
		fetch(adminApiUrl + `word/${index}`, {
			method: "PUT",
			headers: {
				"Content-Type": 'application/json'
			},
			body: JSON.stringify(data)
		}).then(res => res.json()).then((result) => {
			console.log("Updated the word. Got the result: ", result);
		});
	}

	delete(index) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		console.log(`TODO: Delete the word at index ${index} from the backend.`);
		// TODO: Add your code here.
		


		// SOLUTION to be removed
		fetch(adminApiUrl + `word/${index}`, {
			method: "DELETE"
		}).then(res => res.json()).then((result) => {
			console.log("Deleted the word. Got the result: ", result);
		});
	}
}

rhit.PlayerController = class {
	constructor() {
		// Connect the Keyboard inputs
		const keyboardKeys = document.querySelectorAll(".key");
		for (const keyboardKey of keyboardKeys) {
			keyboardKey.onclick = (event) => {
				this.handleKeyPress(keyboardKey.dataset.key);

			};
		}
		// Connect the new game button
		document.querySelector("#newGameButton").onclick = (event) => {
			this.handleNewGame();
		}
		this.handleNewGame(); // Start with a new game.
	}

	handleNewGame() {
		console.log(`TODO: Create a new game and update the view (after the backend calls).`);
		// TODO: Add your code here.

		this.wordIndex = -1;
		this.displayWord = [];
		this.incorrectLetters = [];
		this.guessedLetters = [];
		fetch(playerApiUrl + `numwords`)
		.then(res => res.json())
		.then((result) => {
			console.log("Num Words response:", result);
			return result.length;
		})
		.then((numwords) => {
			// Pick a random number between 0 and numwords - 1
			this.wordIndex = Math.floor(Math.random() * numwords);
			console.log("Selected the index", this.wordIndex);
			return fetch(playerApiUrl + `wordlength/${this.wordIndex}`);
		})
		.then(res => res.json())
		.then((result) => {
			console.log("Word len response:", result);
			for (let k = 0; k < result.length; k++) {
				this.displayWord.push("_");
			}
			this.updateView();
		}).catch((error) => {
			console.log("Unable to create a new game", error);
		});
	}

	handleKeyPress(keyValue) {
		console.log(`You pressed the ${keyValue} key`);
		// TODO: Add your code here.

		// SOLUTION to be removed
		this.guessedLetters.push(keyValue);
		fetch(playerApiUrl + `guess/${this.wordIndex}/${keyValue}`).then(res => res.json()).then((result) => {
			console.log("Guess response:", result);
			if (result.locations.length == 0) {
				console.log("Miss");
				this.incorrectLetters.push(keyValue);
			} else {
				for (const location of result.locations) {
					console.log(`Put a ${keyValue} in location ${location}`);
					this.displayWord[location] = keyValue;
				}
			}
			this.updateView();
		});
	}

	updateView() {
		if (this.wordIndex == -1) {
			console.log("Missing game");
			return;
		}
		document.querySelector("#displayWord").innerHTML = this.displayWord.join('');
		document.querySelector("#incorrectLetters").innerHTML = this.incorrectLetters.join('');
		
		const keyboardKeys = document.querySelectorAll(".key");
		for (const keyboardKey of keyboardKeys) {
			if (this.guessedLetters.includes(keyboardKey.dataset.key)) {
				keyboardKey.style.visibility = "hidden";
			} else {
				keyboardKey.style.visibility = "initial";
			}
		}

	}
}

/* Main */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#adminPage")) {
		console.log("On the admin page");
		new rhit.AdminController();
	}
	if (document.querySelector("#playerPage")) {
		console.log("On the player page");
		new rhit.PlayerController();
	}
};

rhit.main();
