var rh = rh || {};

/** globals */
rh.COLLECTION_PHOTOS = "Photos";
rh.KEY_PHOTO_CAPTION = "caption";
rh.KEY_PHOTO_CREATED = "created";
rh.KEY_PHOTO_URL = "url";

rh.COLLECTION_SETTINGS_PAGE = "SettingsPage";
// Manual Command document
rh.DOC_ID_MANUAL_COMMAND = "manualCommand";
rh.KEY_MANUAL_COMMAND_TYPE = "type";
rh.VALUE_MANUAL_COMMAND_TAKE_PHOTO_TYPE = "takePhoto";
rh.KEY_MANUAL_COMMAND_PAYLOAD = "payload"; // Unused
rh.KEY_MANUAL_COMMAND_TIMESTAMP = "timestamp";
// Feedback Stream document
rh.DOC_ID_FEEDBACK_STREAM = "feedbackStream";
rh.KEY_FEEDBACK_STREAM_IS_ACTIVE = "isActive";
rh.KEY_FEEDBACK_STREAM_CURRENT_DISTANCE = "currentDistance";
rh.KEY_FEEDBACK_STREAM_TIME_SINCE_LAST_SECURITY_PHOTO = "currentTime";
// Security System document
rh.DOC_ID_SECURITY_SYSTEM = "securitySystem";
rh.KEY_SECURITY_SYSTEM_IS_ACTIVE = "isActive";
rh.KEY_SECURITY_SYSTEM_DISTANCE_THRESHOLD = "distanceThreshold";
rh.KEY_SECURITY_SYSTEM_COOL_DOWN_TIME_THRESHOLD = "timeThreshold";

rh.fbAuthManager = null;
rh.fbPhotosCollectionManager = null;
rh.fbSettingsPageDocumentManager = null;

rh.FbAuthManager = class {
	constructor() {
		this._user = null;
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		});
	}

	signIn(email, password) {
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			alert("Existing account log in error", errorCode, errorMessage);
		});
	}

	signOut() {
		firebase.auth().signOut().catch((error) => {
			console.log("Sign out error");
		});
	}

	get isSignedIn() {
		return !!this._user;
	}

	get uid() {
		return this._user.uid;
	}
}

// Login page
rh.LoginPageController = class {
	constructor() {
		document.querySelector("#logInButton").onclick = (event) => {
			const inputEmailEl = document.querySelector("#inputEmail");
			const inputPasswordEl = document.querySelector("#inputPassword");
			console.log(`Login for email: ${inputEmailEl.value} password:  ${inputPasswordEl.value}`);
			rh.fbAuthManager.signIn(inputEmailEl.value, inputPasswordEl.value);
		};
	}
}

// Settings Page
rh.SettingsPageController = class {
	constructor() {
		// Capturing some elements for update view
		this.streamingElements = [
			document.querySelector("#streamOnButton"),
			document.querySelector("#streamOnInput"),  // Not visible but still set.
			document.querySelector("#streamOffButton"),
			document.querySelector("#streamOffInput"),  // Not visible but still set.
		];
		this.monitoringElements = [
			document.querySelector("#monitorOnButton"),
			document.querySelector("#monitorOnInput"),  // Not visible but still set.
			document.querySelector("#monitorOffButton"),
			document.querySelector("#monitorOffInput"),  // Not visible but still set.
		];

		rh.fbSettingsPageDocumentManager.beginListeningForFeedbackStreamDocument(this.updateFeedbackStream.bind(this));
		rh.fbSettingsPageDocumentManager.beginListeningForSecuritySystemDocument(this.updateSecuritySystemValues.bind(this));
		rh.fbPhotosCollectionManager.beginListeningForLatestPhoto(this.updateLatestPhoto.bind(this));
		$("#takePhotoButton").click(() => {
			rh.fbSettingsPageDocumentManager.sendManualCommandToTakeAPhoto();
		});
		$("#streamOnButton").click(() => {
			rh.fbSettingsPageDocumentManager.updateFeedbackStreamIsActive(true);
		});
		$("#streamOffButton").click(() => {
			rh.fbSettingsPageDocumentManager.updateFeedbackStreamIsActive(false);
		});
		$("#distanceThresholdCmInput").keypress((e) =>{
			if (e.which == 13) {
				this.sendSettingThresholds();
				return false;
			}
		});
		$("#coolDownTimeSInput").keypress((e) => {
			if (e.which == 13) {
				this.sendSettingThresholds();
				return false;
			}
		});
		$("#submitThresholds").click(() => {
			this.sendSettingThresholds();
		});
		$("#monitorOnButton").click(() => {
			rh.fbSettingsPageDocumentManager.updateSecuritySystemIsActive(true);
		});
		$("#monitorOffButton").click(() => {
			rh.fbSettingsPageDocumentManager.updateSecuritySystemIsActive(false);
		});
	}
	sendSettingThresholds() {
		const distanceThresholdCm = $("#distanceThresholdCmInput").val();
		const coolDownTimeS = $("#coolDownTimeSInput").val();
		rh.fbSettingsPageDocumentManager.updateThresholdSettings(distanceThresholdCm, coolDownTimeS);
	}
	
	updateLatestPhoto() {
		const url = rh.fbPhotosCollectionManager.latestUrl;
		const caption = rh.fbPhotosCollectionManager.latestCaption;

		const lastestPhoto = document.querySelector("#latestPhoto");
		if (latestPhoto.src.length > 0) {
			// Might need just a sec before it has a url.
			latestPhoto.src = url;
		}
		latestPhoto.alt = caption;

		document.querySelector("#latestPhotoCaption").innerHTML = caption;
		

	}
	updateFeedbackStream() {
		this.updateRadioElements(this.streamingElements, rh.fbSettingsPageDocumentManager.isFeedbackStreamActive)
		const distanceString = `${rh.fbSettingsPageDocumentManager.streamCurrentDistance} cm`;
		document.querySelector("#feedbackStreamCurrentDistance").innerHTML = distanceString;
		const timeString = `${rh.fbSettingsPageDocumentManager.streamCurrentTime} seconds`;
		document.querySelector("#feedbackStreamCurrentTime").innerHTML = timeString;
	}
	updateSecuritySystemValues() {
		this.updateRadioElements(this.monitoringElements, rh.fbSettingsPageDocumentManager.isSecuritySystemActive)
		$("#distanceThresholdCmInput").val(rh.fbSettingsPageDocumentManager.distanceThreshold);
		$("#coolDownTimeSInput").val(rh.fbSettingsPageDocumentManager.timeThreshold);
	}
	updateRadioElements(elements, isOn) {
		// Element order: onButton, onInput, offButton, offInput
		elements.forEach((element, index) => {
			if (index == 0 || index == 2) { // The buttons
				// Buttons: 0 is the on button, 2 is the off button
				if (index == 0 && isOn || index == 2 && !isOn) {
					$(element).addClass("active");
				} else {
					$(element).removeClass("active");
				}
			} else {
				// Inputs: 1 is the on input, 3 is the off input
				$(element).prop('checked', index == 1 && isOn || index == 3 && !isOn);
			}
		});
	}
}

rh.FbSettingsPageDocumentManager = class {
	constructor() {
		this._feedbackStreamDocument = {};
		this._securitySystemDocument = {};
		this._unsubscribeFeedbackStream = null;
		this._unsubscribeSecuritySystem = null;
		this._refManualCommandDoc = firebase.firestore().collection(rh.COLLECTION_SETTINGS_PAGE).doc(rh.DOC_ID_MANUAL_COMMAND);
		this._refFeedbackStreamDoc = firebase.firestore().collection(rh.COLLECTION_SETTINGS_PAGE).doc(rh.DOC_ID_FEEDBACK_STREAM);
		this._refSecuritySystemDoc = firebase.firestore().collection(rh.COLLECTION_SETTINGS_PAGE).doc(rh.DOC_ID_SECURITY_SYSTEM);
	}
	beginListeningForFeedbackStreamDocument(changeListener) {
		this._refFeedbackStreamDoc.onSnapshot(docSnapshot => {
			if (docSnapshot.exists) {
				this._feedbackStreamDocument = docSnapshot;
				changeListener();
			} else {
				console.log("There is no feedback stream document.  Make one.");
				this._refFeedbackStreamDoc.set({
					[rh.KEY_FEEDBACK_STREAM_IS_ACTIVE]: false,
				});
			}
		}, err => {
			console.log(`Encountered error getting reading: ${err}`);
		});
	}
	stopListeningForFeedbackStreamDocument() {
		this._unsubscribeFeedbackStream();
	}
	beginListeningForSecuritySystemDocument(changeListener) {
		this._refSecuritySystemDoc.onSnapshot(docSnapshot => {
			if (docSnapshot.exists) {
				this._securitySystemDocument = docSnapshot;
				changeListener();
			} else {
				console.log("There is no security system document.  Make one.");
				this._refSecuritySystemDoc.set({
					[rh.KEY_FEEDBACK_STREAM_IS_ACTIVE]: false,
					[rh.KEY_SECURITY_SYSTEM_DISTANCE_THRESHOLD]: 60,
					[rh.KEY_SECURITY_SYSTEM_COOL_DOWN_TIME_THRESHOLD]: 3600,
				});
			}
		}, err => {
			console.log(`Encountered error getting settings: ${err}`);
		});
	}
	stopListeningForSecuritySystemDocument() {
		this._unsubscribeSecuritySystem();
	}

	sendManualCommandToTakeAPhoto() {
		this._refManualCommandDoc.set({
			[rh.KEY_MANUAL_COMMAND_TYPE]: rh.VALUE_MANUAL_COMMAND_TAKE_PHOTO_TYPE,
			[rh.KEY_MANUAL_COMMAND_TIMESTAMP]: firebase.firestore.Timestamp.now(),
		});
		setTimeout(() => {
			this._refManualCommandDoc.update({
				[rh.KEY_MANUAL_COMMAND_TYPE]: ""
			});
		}, 2000);
	}
	updateFeedbackStreamIsActive(isFeedbackStreamActive) {
		this._refFeedbackStreamDoc.update({
			[rh.KEY_FEEDBACK_STREAM_IS_ACTIVE]: isFeedbackStreamActive
		});
	}
	updateThresholdSettings(distanceThresholdCm, coolDownTimeS) {
		this._refSecuritySystemDoc.update({
			[rh.KEY_SECURITY_SYSTEM_DISTANCE_THRESHOLD]: distanceThresholdCm,
			[rh.KEY_SECURITY_SYSTEM_COOL_DOWN_TIME_THRESHOLD]: coolDownTimeS
		});
	}
	updateSecuritySystemIsActive(isSecuritySystemActive) {
		this._refSecuritySystemDoc.update({
			[rh.KEY_SECURITY_SYSTEM_IS_ACTIVE]: isSecuritySystemActive
		});
	}
	// Getters for each field
	get isFeedbackStreamActive() {
		return this._feedbackStreamDocument.get(rh.KEY_FEEDBACK_STREAM_IS_ACTIVE);
	}
	get streamCurrentDistance() {
		return this._feedbackStreamDocument.get(rh.KEY_FEEDBACK_STREAM_CURRENT_DISTANCE) || -1;
	}
	get streamCurrentTime() {
		return this._feedbackStreamDocument.get(rh.KEY_FEEDBACK_STREAM_TIME_SINCE_LAST_SECURITY_PHOTO) || -1;
	}

	get isSecuritySystemActive() {
		return this._securitySystemDocument.get(rh.KEY_SECURITY_SYSTEM_IS_ACTIVE);
	}
	get distanceThreshold() {
		return this._securitySystemDocument.get(rh.KEY_SECURITY_SYSTEM_DISTANCE_THRESHOLD) || -1;
	}
	get timeThreshold() {
		return this._securitySystemDocument.get(rh.KEY_SECURITY_SYSTEM_COOL_DOWN_TIME_THRESHOLD) || -1
	}
}

// Photos List page
rh.Photo = class {
	constructor(id, url, caption) {
		this.id = id;
		this.url = url;
		this.caption = caption;
	}
}

rh.FbPhotosCollectionManager = class {
	constructor() {
		this._latestDocument = {};
		this._documentSnapshots = [];
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rh.COLLECTION_PHOTOS);
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.orderBy(rh.KEY_PHOTO_CREATED, "desc").limit(50).onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}

	beginListeningForLatestPhoto(changeListener) {
		this._unsubscribe = this._ref.orderBy(rh.KEY_PHOTO_CREATED, "desc").limit(1).onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;			
			this._latestDocument = null;
			if (querySnapshot.docs.length > 0) {
				this._latestDocument = querySnapshot.docs[0];
			}
			changeListener();
		});
	}

	delete(documentId) {
		this._ref.doc(documentId).delete();
	}

	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getPhotoAtIndex(index) {
		return new rh.Photo(
			this._documentSnapshots[index].id,
			this._documentSnapshots[index].get(rh.KEY_PHOTO_URL),
			this._documentSnapshots[index].get(rh.KEY_PHOTO_CAPTION)
		);
	}
	get latestUrl() {
		return this._latestDocument.get(rh.KEY_PHOTO_URL);
	}
	get latestCaption() {
		return this._latestDocument.get(rh.KEY_PHOTO_CAPTION);
	}

}

rh.ListPageController = class {
	constructor() {
		rh.fbPhotosCollectionManager.beginListening(this.updateList.bind(this));
	}

	updateList() {
		$("#columns").removeAttr("id").hide();
		let $newList = $("<div></div>").attr("id", "columns");
		for (let k = 0; k < rh.fbPhotosCollectionManager.length; k++) {
			const photo = rh.fbPhotosCollectionManager.getPhotoAtIndex(k)
			if (!photo.url) {
				continue;
			}
			const $newCard = this.createCard(photo);
			$newList.append($newCard);
		}
		$("#listPage").append($newList);
	}

	createCard(pic) {
		const $newCard = $(`<div class="pin"><i data-doc-id="${pic.id}" class="delete-button material-icons">delete</i><img src="${pic.url}" alt="${pic.caption}"><p class="caption">${pic.caption}</p></div>`);
		$newCard.click((event) => {
			console.log("Save the id", pic.id, " then change pages");
			window.location.href = `/photo.html?id=${pic.id}`; // Change the page to the detail view
		});
		$newCard.find(".delete-button").click((event) => {
			console.log(`Delete ${pic.id}`);
			rh.fbPhotosCollectionManager.delete(pic.id);
			return false;

		});
		return $newCard;
	}
}

// Detail page.
rh.FbSinglePhotoManager = class {
	constructor(picId) {
		this._document = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rh.COLLECTION_PHOTOS).doc(picId);
	}
	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
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
			[rh.KEY_PHOTO_CAPTION]: caption,
			[rh.KEY_PHOTO_CREATED]: firebase.firestore.Timestamp.now(),
		}).then(() => {
			console.log("Document has been updated");
		});
	}

	delete() {
		return this._ref.delete();
	}

	get caption() {
		return this._document.get(rh.KEY_PHOTO_CAPTION);
	}

	get url() {
		return this._document.get(rh.KEY_PHOTO_URL);
	}
};


rh.DetailPageController = class {
	constructor() {
		rh.fbSinglePhotoManager.beginListening(this.updateView.bind(this));
		$("#editCaptionDialog").on("show.bs.modal", function () {
			$("#inputCaption").val(rh.fbSinglePhotoManager.caption);
		});
		$("#editCaptionDialog").on("shown.bs.modal", function () {
			$("#inputCaption").trigger("focus");
		});
		$("#inputCaption").keypress(function (e) {
			if (e.which == 13) {
				const caption = $("#inputCaption").val();
				rh.fbSinglePhotoManager.update(caption);
				$('#editCaptionDialog').modal('hide')
				return false;
			}
		});
		$("#submitEditCaption").click(() => {
			const caption = $("#inputCaption").val();
			rh.fbSinglePhotoManager.update(caption);
		});
		$("#submitDeletePhoto").click(() => {
			rh.fbSinglePhotoManager.delete().then(() => {
				window.location.href = "/"; // Go back to the list of pics.
			});;
		});
	}
	updateView() {
		$("#image").attr("src", rh.fbSinglePhotoManager.url);
		$("#image").attr("alt", rh.fbSinglePhotoManager.caption);
		$("#image").attr("title", rh.fbSinglePhotoManager.caption);
		$("#caption").html(rh.fbSinglePhotoManager.caption);
	}
}

rh.checkForRedirects = function() {
	if (document.querySelector("#loginPage") && rh.fbAuthManager.isSignedIn) {
		window.location.href = "/photos.html";
	}
	if (!document.querySelector("#loginPage") && !rh.fbAuthManager.isSignedIn) {
		window.location.href = "/";
	}
};


rh.initializePage = function() {
	
	if ($("#loginPage").length) {
		console.log("On the login page");
		new rh.LoginPageController();
	} else {
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rh.fbAuthManager.signOut();
		});
	}
	if ($("#settingsPage").length) {
		console.log("On the settings page");
		rh.fbSettingsPageDocumentManager = new rh.FbSettingsPageDocumentManager();
		rh.fbPhotosCollectionManager = new rh.FbPhotosCollectionManager();
		new rh.SettingsPageController();
	}
	if ($("#listPage").length) {
		console.log("On the list page");
		rh.fbPhotosCollectionManager = new rh.FbPhotosCollectionManager();
		new rh.ListPageController();
	}
	if ($("#detailPage").length) {
		console.log("On the detail page");
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const picId = urlParams.get("id");
		if (picId) {
			rh.fbSinglePhotoManager = new rh.FbSinglePhotoManager(picId);
			new rh.DetailPageController();
		} else {
			console.log("There is no pic id to use.  Abort!");
			window.location.href = "/"; // Go back to the home page (ListPage)
		}
	}
}

/* Main */
$(document).ready(() => {
	console.log("Ready");
	rh.fbAuthManager = new rh.FbAuthManager();
	rh.fbAuthManager.beginListening(() => {
		console.log("isSignedIn = ", rh.fbAuthManager.isSignedIn);
		rh.checkForRedirects();
		rh.initializePage();
	});

});