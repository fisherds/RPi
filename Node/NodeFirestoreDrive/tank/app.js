var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fisherds-movie-quotes-571d2.firebaseio.com"
});

const rosebot = require("./rosebot");
const robot = new rosebot.RoseBot()

const db = admin.firestore();
const ref = db.collection("Commands").doc("command");

ref.onSnapshot(docSnapshot => {
    if (docSnapshot.exists) {
        console.log("Snapshot data: ", docSnapshot.data());
        const message_type = docSnapshot.get("type");
        console.log("message_type: ", message_type);

        let payload = docSnapshot.get("payload");
        if (payload) {
            payload = JSON.parse(payload);
        }
        console.log("payload", payload);
        
        if (message_type == "motor/go") {
            const left_wheel_speed = payload[0];
            const right_wheel_speed = payload[1];
            console.log("Motor go @ ", left_wheel_speed, right_wheel_speed);
            robot.driveSystem.go(left_wheel_speed, right_wheel_speed)
        } else if (message_type == "motor/stop") {
            console.log("Motor Stop");
            robot.driveSystem.stop();
        }
    }
}, err => {
    console.log(`Encountered error: ${err}`);
});