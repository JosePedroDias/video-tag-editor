var ajax = function(o) {
	var xhr = new XMLHttpRequest();
    if (o.creds) { xhr.withCredentials = true; }
	xhr.open(o.verb || 'GET', o.uri, true);
	var cbInner = function() {
		if (xhr.readyState === 4 && xhr.status > 199 && xhr.status < 300) {
			return o.cb(null, xhr.response);
		}
		o.cb('error requesting ' + o.uri);
	};
	xhr.onload  = cbInner;
	xhr.onerror = cbInner;
	xhr.send(o.payload || null);
};



var clone = function(o) {
	return JSON.parse( JSON.stringify(o) );
};

var clamp = function(v, m, M) {
	if (v < m) { return m; }
	if (v > M) { return M; }
	return v;
};



ajax({
	uri: 'sceneTimes.json',
	cb: function(err, res) {
		if (err) { return alert(err); }

		var sceneTimes = JSON.parse(res);
		//console.log('sceneTimes', sceneTimes);

		ajax({
			uri: 'videos.txt',
			cb: function(err, res2) {
				if (err) { return alert(err); }

				var videos = res2.split('\n');

				var tt = timelineTweaker({
					arr:    sceneTimes,
					labels: videos,
					dims:   [600, 100]
				});

				//console.log('videos', videos);

				var videoEl = document.querySelector('video');
				var buttonEl = document.querySelector('button');
				var indexDivEl = document.querySelector('div');

				var whichIndex = function(t, arr) {
					var item, i = 0;
					while (true) {
						item = arr[i];
						if (item === undefined) { return arr.length-1; }
						if (item > t) {
							return i - 1;
						}
						++i;
					}
				};

				var ft = function(t) {
					if (t === undefined) { return '--'; }
					return t.toFixed(2);
				};

				videoEl.addEventListener('timeupdate', function() {
					var t = videoEl.currentTime;
					var idx = whichIndex(t, sceneTimes);
					var label = videos[idx];

					t0 = sceneTimes[idx-1];
					t1 = sceneTimes[idx  ];
					t2 = sceneTimes[idx+1];
					
					indexDivEl.innerHTML = [
						't: ', ft(t),
						'<br/>',
						
						'i: ', (idx+1),
						'<br/>',

						'label:', label,
						'<br/>',
						
						'neighbours are: [',
							ft(t0),
						',',
							ft(t1),
						',',
							ft(t2),
						']'
					].join('');

					tt.update(t, idx);
				});
			}
		});
	}
});
