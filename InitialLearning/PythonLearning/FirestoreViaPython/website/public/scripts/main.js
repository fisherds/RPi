var rh = rh || {};

/** globals */
rh.COLLECTION_PICS = "Pictures";
rh.KEY_URL = "url";
rh.KEY_CAPTION = "caption";
rh.KEY_LAST_TOUCHED = "lastTouched";
rh.FbPicturesManager = null;

rh.COLLECTION_SETTINGS_PAGE = "SettingsPage";
rh.DOC_ID_COMMAND = "command";
rh.KEY_TYPE = "type";
rh.KEY_PAYLOAD = "payload";  // Unused
rh.DOC_ID_READING = "reading";
rh.KEY_DISTANCE = "distance";
rh.KEY_DISTANCE_TIMESTAMP = "timestamp";
rh.DOC_ID_SETTINGS = "settings";
rh.KEY_DISTANCE_CM = "distanceCm";
rh.KEY_COOL_DOWN_TIME_S = "coolDownTimeS";
rh.KEY_IS_STEAMING = "isStreaming";
rh.KEY_IS_MONITORING = "isMonitoring";
rh.FbPicturesManager = null;
rh.fbSettingsManager = null;

// Settings Page
rh.SettingsPageController = class {
	constructor() {
		rh.fbSettingsManager.beginListening(this.updateView.bind(this));
		$("#distanceThresholdCmInput").keypress(function (e) {
			if (e.which == 13) {
				const distanceThresholdCm = $("#distanceThresholdCmInput").val();
				rh.fbSettingsManager.updateDistanceThresholdCm(distanceThresholdCm);
				return false;
			}
		});
		$("#coolDownTimeSInput").keypress(function (e) {
			if (e.which == 13) {
				const coolDownTimeS = $("#coolDownTimeSInput").val();
				rh.fbSettingsManager.updateCoolDownTimeS(coolDownTimeS);
				return false;
			}
		});
		$("#submitEditCaption").click(() => {
			const caption = $("#inputCaption").val();
			rh.fbSinglePicManager.update(caption);
		});
		$("#submitDeletePic").click(() => {
			rh.fbSinglePicManager.delete().then(() => {
				window.location.href = "/"; // Go back to the list of pics.
			});;
		});
	}
	updateView() {
		$("#image").attr("src", rh.fbSinglePicManager.url);
		$("#image").attr("alt", rh.fbSinglePicManager.caption);
		$("#image").attr("title", rh.fbSinglePicManager.caption);
		$("#caption").html(rh.fbSinglePicManager.caption);
	}
}

rh.FbSettingsManager = class {
	constructor() {
		this._commandDocument = {};
		
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rh.COLLECTION_PICS);
	}
	beginListening(changeListener) {
		console.log("Listening for pics");
		this._unsubscribe = this._ref.orderBy(rh.KEY_LAST_TOUCHED, "desc").limit(50).onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			console.log(`Updated ${this._documentSnapshots.length} pics.`);

			// Console log for the display for now.
			querySnapshot.forEach(function (doc) {
				console.log(doc.data());
			});

			if (changeListener) {
				changeListener();
			}
		});
	}
	stopListening() {
		this._unsubscribe();
	}

	add(url, caption) {
		this._ref.add({
				[rh.KEY_URL]: url,
				[rh.KEY_CAPTION]: caption,
				[rh.KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(function (docRef) {
				console.log("Document added with ID: ", docRef.id);
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
	}
	update(id, url, caption) {}
	delete(id) {}

	get length() {
		return this._documentSnapshots.length;
	}

	getPicAtIndex(index) {
		return new rh.Pic(
			this._documentSnapshots[index].id,
			this._documentSnapshots[index].get(rh.KEY_URL),
			this._documentSnapshots[index].get(rh.KEY_CAPTION)
		);
	}
}

// Pictures List page
rh.Pic = class {
	constructor(id, url, caption) {
		this.id = id;
		this.url = url;
		this.caption = caption;
	}
}

rh.FbPicturesManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rh.COLLECTION_PICS);
	}
	beginListening(changeListener) {
		console.log("Listening for pics");
		this._unsubscribe = this._ref.orderBy(rh.KEY_LAST_TOUCHED, "desc").limit(50).onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			console.log(`Updated ${this._documentSnapshots.length} pics.`);

			// Console log for the display for now.
			querySnapshot.forEach(function (doc) {
				console.log(doc.data());
			});

			if (changeListener) {
				changeListener();
			}
		});
	}
	stopListening() {
		this._unsubscribe();
	}

	add(url, caption) {
		this._ref.add({
				[rh.KEY_URL]: url,
				[rh.KEY_CAPTION]: caption,
				[rh.KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(function (docRef) {
				console.log("Document added with ID: ", docRef.id);
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
	}
	update(id, url, caption) {}
	delete(id) {}

	get length() {
		return this._documentSnapshots.length;
	}

	getPicAtIndex(index) {
		return new rh.Pic(
			this._documentSnapshots[index].id,
			this._documentSnapshots[index].get(rh.KEY_URL),
			this._documentSnapshots[index].get(rh.KEY_CAPTION)
		);
	}
}

rh.ListPageController = class {
	constructor() {
		rh.FbPicturesManager.beginListening(this.updateList.bind(this));
		$("#addPicDialog").on("show.bs.modal", function () {
			$("#inputUrl").val("");
			$("#inputCaption").val("");
		});
		$("#addPicDialog").on("shown.bs.modal", function () {
			$("#inputUrl").trigger("focus");
		});
		$("#submitAddPic").click(() => {
			const url = $("#inputUrl").val();
			const caption = $("#inputCaption").val();
			rh.FbPicturesManager.add(url, caption);
		});
		$("#inputCaption").keypress(function (e) {
			if (e.which == 13) {
				const url = $("#inputUrl").val();
				const caption = $("#inputCaption").val();
				rh.FbPicturesManager.add(url, caption);
				$('#addPicDialog').modal('hide')
				return false;
			}
		});
	}
	updateList() {
		console.log("Update the  list on the page.", this);
		$("#columns").removeAttr("id").hide();
		let $newList = $("<div></div>").attr("id", "columns");
		for (let k = 0; k < rh.FbPicturesManager.length; k++) {
			const $newCard = this.createCard(
				rh.FbPicturesManager.getPicAtIndex(k)
			);
			$newList.append($newCard);
		}
		$("#listPage").append($newList);
	}

	createCard(pic) {
		console.log(pic);
		const $newCard = $(`<div class="pin" id="${pic.id}"><img src="${pic.url}" alt="${pic.caption}"><p class="caption">${pic.caption}</p></div>`);
		$newCard.click((event) => {
			console.log("Save the id", pic.id, " then change pages");
			window.location.href = `/pic.html?id=${pic.id}`; // Change the page to the detail view
		});
		return $newCard;
	}
}

// Detail page.
rh.FbSinglePicManager = class {
	constructor(picId) {
		this._document = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rh.COLLECTION_PICS).doc(picId);
		console.log('this._ref.path :', this._ref.path);
	}
	beginListening(changeListener) {
		console.log("Listen for changes to this pic");
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			console.log("Pic updated ", doc);
			if (doc.exists) {
				this._document = doc;
				changeListener();
			} else {
				console.log("Document does not exist any longer.");
				console.log("CONSIDER: automatically navigate back to the home page.");
			}
		});
	}
	stopListening() {
		this._unsubscribe();
	}

	update(caption) {
		this._ref.update({
			[rh.KEY_CAPTION]: caption,
			[rh.KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		}).then(() => {
			console.log("Document has been updated");
		});
	}

	delete() {
		return this._ref.delete();
	}

	get caption() {
		return this._document.get(rh.KEY_CAPTION);
	}

	get url() {
		return this._document.get(rh.KEY_URL);
	}
};


rh.DetailPageController = class {
	constructor() {
		rh.fbSinglePicManager.beginListening(this.updateView.bind(this));
		$("#editCaptionDialog").on("show.bs.modal", function () {
			$("#inputCaption").val(rh.fbSinglePicManager.caption);
		});
		$("#editCaptionDialog").on("shown.bs.modal", function () {
			$("#inputCaption").trigger("focus");
		});
		$("#inputCaption").keypress(function (e) {
			if (e.which == 13) {
				const caption = $("#inputCaption").val();
				rh.fbSinglePicManager.update(caption);
				$('#editCaptionDialog').modal('hide')
				return false;
			}
		});
		$("#submitEditCaption").click(() => {
			const caption = $("#inputCaption").val();
			rh.fbSinglePicManager.update(caption);
		});
		$("#submitDeletePic").click(() => {
			rh.fbSinglePicManager.delete().then(() => {
				window.location.href = "/"; // Go back to the list of pics.
			});;
		});
	}
	updateView() {
		$("#image").attr("src", rh.fbSinglePicManager.url);
		$("#image").attr("alt", rh.fbSinglePicManager.caption);
		$("#image").attr("title", rh.fbSinglePicManager.caption);
		$("#caption").html(rh.fbSinglePicManager.caption);
	}
}

/* Main */
$(document).ready(() => {
	console.log("Ready");
	if ($("#settingsPage").length) {
		console.log("On the settings page");
		rh.fbSettingsManager = new rh.FbSettingsManager();
		new rh.SettingsPageController();
	}
	if ($("#listPage").length) {
		console.log("On the list page");
		rh.FbPicturesManager = new rh.FbPicturesManager();
		new rh.ListPageController();
	}
	if ($("#detailPage").length) {
		console.log("On the detail page");
		const queryString = window.location.search;
		console.log(queryString);
		const urlParams = new URLSearchParams(queryString);
		const picId = urlParams.get("id");
		if (picId) {
			rh.fbSinglePicManager = new rh.FbSinglePicManager(picId);
			new rh.DetailPageController();
		} else {
			console.log("There is no pic id in storage to use.  Abort!");
			window.location.href = "/"; // Go back to the home page (ListPage)
		}
	}
});
