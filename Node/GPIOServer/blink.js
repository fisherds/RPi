var rpio = require('rpio');

rpio.open(16, rpio.OUTPUT, rpio.LOW);

for (var i = 0; i < 5; i++) {
        /* On for 1 second */
        rpio.write(16, rpio.HIGH);
        rpio.sleep(1);

        /* Off for half a second (500ms) */
        rpio.write(16, rpio.LOW);
        rpio.msleep(500);
}