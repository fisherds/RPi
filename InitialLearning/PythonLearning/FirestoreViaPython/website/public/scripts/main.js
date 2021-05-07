var rh = rh || {};

/** globals */
rh.COLLECTION_PICS = "Pictures";
rh.KEY_PIC_URL = "url";
rh.KEY_PIC_CAPTION = "caption";
rh.KEY_PIC_LAST_TOUCHED = "lastTouched";

rh.COLLECTION_SETTINGS_PAGE = "SettingsPage";
// Command document
rh.DOC_COMMAND_ID = "command";
rh.KEY_COMMAND_TYPE = "type";
rh.KEY_COMMAND_PAYLOAD = "payload"; // Unused
rh.KEY_COMMAND_TIMESTAMP = "timestamp";
// Reading document
rh.DOC_READING_ID = "reading";
rh.KEY_READING_DISTANCE = "distance";
rh.KEY_READING_TIMESTAMP = "timestamp";
// Settings document
rh.DOC_SETTINGS_ID = "settings";
rh.KEY_SETTINGS_DISTANCE_CM = "distanceCm";
rh.KEY_SETTINGS_COOL_DOWN_TIME_S = "coolDownTimeS";
rh.KEY_SETTINGS_IS_STEAMING = "isStreaming";
rh.KEY_SETTINGS_IS_MONITORING = "isMonitoring";

rh.fbPicturesManager = null;
rh.fbSettingsManager = null;

// Settings Page
rh.SettingsPageController = class {
	constructor() {
		// Capturing some elements for update view
		this.streamingElements = [
			document.querySelector("#streamOnButton"),
			document.querySelector("#streamOnInput"),  // In latest version hidden
			document.querySelector("#streamOffButton"),
			document.querySelector("#streamOffInput"),  // In latest version hidden
		];
		this.monitoringElements = [
			document.querySelector("#monitorOnButton"),
			document.querySelector("#monitorOnInput"),  // In latest version hidden
			document.querySelector("#monitorOffButton"),
			document.querySelector("#monitorOffInput"),  // In latest version hidden
		];
		rh.fbSettingsManager.beginListeningForReadings(this.updateReading.bind(this));
		rh.fbSettingsManager.beginListeningForSettings(this.updateSettings.bind(this));
		$("#takePhotoButton").click(() => {
			rh.fbSettingsManager.sendTakePhoto();
		});
		$("#streamOnButton").click(() => {
			rh.fbSettingsManager.updateIsStreaming(true);
		});
		$("#streamOffButton").click(() => {
			rh.fbSettingsManager.updateIsStreaming(false);
		});
		$("#distanceThresholdCmInput").keypress(function (e) {
			if (e.which == 13) {
				this.sendSettingThresholds();
				return false;
			}
		});
		$("#coolDownTimeSInput").keypress(function (e) {
			if (e.which == 13) {
				this.sendSettingThresholds();
				return false;
			}
		});
		$("#submitThresholds").click(() => {
			this.sendSettingThresholds();
		});
		$("#monitorOnButton").click(() => {
			rh.fbSettingsManager.updateIsMonitoring(true);
		});
		$("#monitorOffButton").click(() => {
			rh.fbSettingsManager.updateIsMonitoring(false);
		});
	}
	sendSettingThresholds() {
		const distanceThresholdCm = $("#distanceThresholdCmInput").val();
		const coolDownTimeS = $("#coolDownTimeSInput").val();
		rh.fbSettingsManager.updateThresholdSettings(distanceThresholdCm, coolDownTimeS);
	}
	updateReading() {
		const displayString = `${rh.fbSettingsManager.distanceReading} cm`;
		document.querySelector("#distanceReadingDisplay").innerHTML = displayString;		
	}
	updateSettings() {
		this.updateRadioElements(this.streamingElements, rh.fbSettingsManager.isStreaming)
		$("#distanceThresholdCmInput").val(rh.fbSettingsManager.distanceThresholdCm);
		$("#coolDownTimeSInput").val(rh.fbSettingsManager.coolDownTimeS);
		this.updateRadioElements(this.monitoringElements, rh.fbSettingsManager.isMonitoring)
	}
	updateRadioElements(elements, isOn) {
		elements.forEach((element, index) => {
			if (index == 0 || index == 2) { // The buttons
				// Button
				if (index == 0 && isOn || index == 2 && !isOn) {
					$(element).addClass("active");
				} else {
					$(element).removeClass("active");
				}
			} else {
				// Inputs
				$(element).prop('checked', index == 1 && isOn || index == 3 && !isOn);
			}
		});
	}
}

rh.FbSettingsManager = class {
	constructor() {
		this._readingDocument = {};
		this._settingsDocument = {};
		this._unsubscribeReadings = null;
		this._unsubscribeSettings = null;
		this._refCommand = firebase.firestore().collection(rh.COLLECTION_SETTINGS_PAGE).doc(rh.DOC_COMMAND_ID);
		this._refReading = firebase.firestore().collection(rh.COLLECTION_SETTINGS_PAGE).doc(rh.DOC_READING_ID);
		this._refSettings = firebase.firestore().collection(rh.COLLECTION_SETTINGS_PAGE).doc(rh.DOC_SETTINGS_ID);
	}
	beginListeningForReadings(changeListener) {
		console.log("Listening for readings");
		this._refReading.onSnapshot(docSnapshot => {
			if (docSnapshot.exists) {
				this._readingDocument = docSnapshot;
				changeListener();
			} else {
				console.log("There is no reading available");
			}
		}, err => {
			console.log(`Encountered error getting reading: ${err}`);
		});
	}
	stopListeningForReadings() {
		this._unsubscribeReadings();
	}
	beginListeningForSettings(changeListener) {
		console.log("Listening for settings");
		this._refSettings.onSnapshot(docSnapshot => {
			if (docSnapshot.exists) {
				this._settingsDocument = docSnapshot;
				changeListener();
			} else {
				this._refSettings.set({
					[rh.KEY_SETTINGS_IS_STEAMING]: false,
					[rh.KEY_SETTINGS_DISTANCE_CM]: 60,
					[rh.KEY_SETTINGS_COOL_DOWN_TIME_S]: 3600,
					[rh.KEY_SETTINGS_IS_MONITORING]: false,
				});

			}
		}, err => {
			console.log(`Encountered error getting settings: ${err}`);
		});
	}
	stopListeningForSettings() {
		this._unsubscribeSettings();
	}
	sendTakePhoto() {
		this._refCommand.set({
			[rh.KEY_COMMAND_TYPE]: "takePhoto",
			[rh.KEY_COMMAND_TIMESTAMP]: firebase.firestore.Timestamp.now(),
		});
		setTimeout(() => {
			this._refCommand.update({
				[rh.KEY_COMMAND_TYPE]: ""
			});
		}, 2000);
	}
	updateIsStreaming(isStreaming) {
		this._refSettings.update({
			[rh.KEY_SETTINGS_IS_STEAMING]: isStreaming
		});
	}
	updateDistanceThresholdCm(distanceThresholdCm) {
		this._refSettings.update({
			[rh.KEY_SETTINGS_DISTANCE_CM]: distanceThresholdCm
		});
	}
	updateCoolDownTimeS(coolDownTimeS) {
		this._refSettings.update({
			[rh.KEY_SETTINGS_COOL_DOWN_TIME_S]: coolDownTimeS
		});
	}
	updateThresholdSettings(distanceThresholdCm, coolDownTimeS) {
		this._refSettings.update({
			[rh.KEY_SETTINGS_DISTANCE_CM]: distanceThresholdCm,
			[rh.KEY_SETTINGS_COOL_DOWN_TIME_S]: coolDownTimeS
		});
	}
	updateIsMonitoring(isMonitoring) {
		this._refSettings.update({
			[rh.KEY_SETTINGS_IS_MONITORING]: isMonitoring
		});
	}
	// Getters for each field
	get distanceReading() {
		return this._readingDocument.get(rh.KEY_READING_DISTANCE) || -1;
	}
	get isStreaming() {
		return this._settingsDocument.get(rh.KEY_SETTINGS_IS_STEAMING);
	}
	get distanceThresholdCm() {
		return this._settingsDocument.get(rh.KEY_SETTINGS_DISTANCE_CM) || -1;
	}
	get coolDownTimeS() {
		return this._settingsDocument.get(rh.KEY_SETTINGS_COOL_DOWN_TIME_S) || -1
	}
	get isMonitoring() {
		return this._settingsDocument.get(rh.KEY_SETTINGS_IS_MONITORING);
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
		this._unsubscribe = this._ref.orderBy(rh.KEY_PIC_LAST_TOUCHED, "desc").limit(50).onSnapshot((querySnapshot) => {
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
				[rh.KEY_PIC_URL]: url,
				[rh.KEY_PIC_CAPTION]: caption,
				[rh.KEY_PIC_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
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
			this._documentSnapshots[index].get(rh.KEY_PIC_URL),
			this._documentSnapshots[index].get(rh.KEY_PIC_CAPTION)
		);
	}
}

rh.ListPageController = class {
	constructor() {
		rh.fbPicturesManager.beginListening(this.updateList.bind(this));
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
			rh.fbPicturesManager.add(url, caption);
		});
		$("#inputCaption").keypress(function (e) {
			if (e.which == 13) {
				const url = $("#inputUrl").val();
				const caption = $("#inputCaption").val();
				rh.fbPicturesManager.add(url, caption);
				$('#addPicDialog').modal('hide')
				return false;
			}
		});
	}
	updateList() {
		console.log("Update the  list on the page.", this);
		$("#columns").removeAttr("id").hide();
		let $newList = $("<div></div>").attr("id", "columns");
		for (let k = 0; k < rh.fbPicturesManager.length; k++) {
			const $newCard = this.createCard(
				rh.fbPicturesManager.getPicAtIndex(k)
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
			[rh.KEY_PIC_CAPTION]: caption,
			[rh.KEY_PIC_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		}).then(() => {
			console.log("Document has been updated");
		});
	}

	delete() {
		return this._ref.delete();
	}

	get caption() {
		return this._document.get(rh.KEY_PIC_CAPTION);
	}

	get url() {
		return this._document.get(rh.KEY_PIC_URL);
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
		rh.fbPicturesManager = new rh.FbPicturesManager();
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