var fs = require('fs');

var text = fs.readFileSync('scenes.txt').toString();
var lines = text.split('\n');

var regex = /best_effort_timestamp_time=([^|]+)/;
var times = [];

lines.forEach(function(line) {
	var m = regex.exec(line);
	if (m && m[1]) {
		var t = parseFloat(m[1]);
		times.push(t);
	}
});

console.log(times);
console.log(times.length);

fs.writeFileSync('sceneTimes.json', JSON.stringify(times));
