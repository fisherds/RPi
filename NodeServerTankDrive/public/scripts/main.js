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

/* Main */
rhit.main = function () {
	console.log("Ready");

};

rhit.main();
