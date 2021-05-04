var rh = rh || {};

/** globals */
rh.COLLECTION_PICS = "Pics";
rh.KEY_URL = "url";
rh.KEY_CAPTION = "caption";
rh.KEY_LAST_TOUCHED = "lastTouched";
rh.fbPicsManager = null;

rh.Pic = class {
	constructor(id, url, caption) {
		this.id = id;
		this.url = url;
		this.caption = caption;
	}
}

rh.FbPicsManager = class {
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
		rh.fbPicsManager.beginListening(this.updateList.bind(this));
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
			rh.fbPicsManager.add(url, caption);
		});
		$("#inputCaption").keypress(function (e) {
			if (e.which == 13) {
				const url = $("#inputUrl").val();
				const caption = $("#inputCaption").val();
				rh.fbPicsManager.add(url, caption);
				$('#addPicDialog').modal('hide')
				return false;
			}
		});
	}
	updateList() {
		console.log("Update the  list on the page.", this);
		$("#columns").removeAttr("id").hide();
		let $newList = $("<div></div>").attr("id", "columns");
		for (let k = 0; k < rh.fbPicsManager.length; k++) {
			const $newCard = this.createCard(
				rh.fbPicsManager.getPicAtIndex(k)
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
			rh.storage.setPicId(pic.id);
			window.location.href = "/pic.html"; // Change the page to the detail view
		});
		return $newCard;
	}

}

// Session Storage
rh.storage = {};
rh.storage = rh.storage || {};
rh.storage.PIC_KEY = "picId";
rh.storage.getPicId = function () {
	const picId = sessionStorage.getItem(rh.storage.PIC_KEY);
	if (!picId) {
		console.log("Missing a pic id!");
	}
	return picId;
}

rh.storage.setPicId = function (picId) {
	sessionStorage.setItem(rh.storage.PIC_KEY, picId);
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
	if ($("#listPage").length) {
		console.log("On the list page");
		rh.fbPicsManager = new rh.FbPicsManager();
		new rh.ListPageController();
	}
	if ($("#detailPage").length) {
		console.log("On the detail page");
		const picId = rh.storage.getPicId();
		if (picId) {
			rh.fbSinglePicManager = new rh.FbSinglePicManager(picId);
			new rh.DetailPageController();
		} else {
			console.log("There is no pic id in storage to use.  Abort!");
			window.location.href = "/"; // Go back to the home page (ListPage)
		}
	}
});
