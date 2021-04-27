var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fisherds-movie-quotes-571d2.firebaseio.com"
});

const db = admin.firestore();
const ref = db.collection("MovieQuotes");

ref.onSnapshot(querySnapshot => {
    console.log(`Received query snapshot of size ${querySnapshot.size}`);
    querySnapshot.docs.forEach((doc, index) => {
        console.log(doc.data());
    })
  }, err => {
    console.log(`Encountered error: ${err}`);
  });