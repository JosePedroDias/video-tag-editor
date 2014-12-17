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
			uri: 'videos.json',
			cb: function(err, res2) {
				if (err) { return alert(err); }

				var videos = JSON.parse(res2);
				//console.log('videos', videos);

				var tt = timelineTweaker({
					arr:    sceneTimes,
					labels: videos,
					dims:   [600, 100]
				});				

				var videoEl    = document.querySelector('video');
				var buttonsEl  = document.querySelector('#buttons');
				var labelEl    = document.querySelector('#label');

				window.v = videoEl;

				buttonsEl.addEventListener('click', function(ev) {
					var el = ev.target;
					if (el.nodeName.toLowerCase() !== 'button') { return; }
					tt.setMode(el.className);
					buttonsEl.className = el.className;
				});

				window.export = function() {
					console.log( JSON.stringify(sceneTimes) );
				};

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
					var label = videos[idx] || '-- #';
					var parts = label.split(' ');

					t0 = sceneTimes[idx-1];
					t1 = sceneTimes[idx  ];
					t2 = sceneTimes[idx+1];
					
					labelEl.innerHTML = [
						'<b>label:</b>       <a href="', parts[1], '" target="_blank">', parts[0], '</a><br/>',
						'<b>next cut at:</b> ', ft(t2), ' (', ft(t2-t), ' left)'
					].join('');

					tt.update(t, idx);
				});
			}
		});
	}
});
