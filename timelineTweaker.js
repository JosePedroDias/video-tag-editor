var timelineTweaker = function(o) {
	var arr        = o.arr        || [];
	var labels     = o.labels     || [];
	var dims       = o.dims       || [600, 100];
	var windowSize = o.windowSize || 3;
	var bgColor    = o.bgColor    || '#444';
	var ctColor    = o.ctColor    || '#000';
	var tagColor   = o.tagColor   || '#FFF';

	var mode = 'no op'; // add delete move


	var range = function(n) {
		var fakeArr = new Array(paletteSteps+1).join(',').split('');
		return fakeArr.map(function(bogus, idx) {
			return idx;
		});
	};

	// https://github.com/gka/chroma.js/blob/master/doc/api.md
	var paletteSteps = 6;
	var palette = range(paletteSteps).map(function(v) {
		return chroma.hsv(v * 360 / paletteSteps, 0.8, 0.5).hex();
	});

	var canvasEl = document.createElement('canvas');
	canvasEl.setAttribute('width',  dims[0]);
	canvasEl.setAttribute('height', dims[1]);
	document.body.appendChild(canvasEl);
	var ctx = canvasEl.getContext('2d');

	ctx.font = '15px sans-serif';
	ctx.textAlign    = 'start'; // x: start end left right center
	ctx.textBaseline = 'middle'; // y: top hanging middle alphabetic ideographic bottom

	var api = {};

	var w  = dims[0];
	var w2 = ~~(w/2);
	var h  = dims[1];
	var h2 = ~~(h/2);

	var lastT;
	var lastInWindow;

	var windowSize2 = windowSize/2;
	var timeDensity = windowSize / w;

	var buildTag = function(idx, t) {
		if (t === undefined) { t = arr[idx] || 0; }
		return {
			index: idx,
			time:  t,
			label: (idx+1)+''
		};
	};

	var onClick = function(ev) {
		var x = ev.clientX - ev.target.getBoundingClientRect().left;
		var t = lastT - windowSize2 + x * timeDensity;
		var closestIndex = -1;
		var smallestDT = 10000;
		var isBefore = false;
		for (var i = 0, I = lastInWindow.length, dT; i < I; ++i) {
			dT = Math.abs(lastInWindow[i].time - t);
			if (dT < smallestDT) {
				smallestDT = dT;
				closestIndex = lastInWindow[i].index;
			}
		}
		if (closestIndex === -1) { closestIndex = lastIndex; }
		//console.log('mode', mode, 'x', x, 't', t, 'closestIndex', closestIndex, 'dT', dT);

		if (mode === 'delete') {
			arr.splice(closestIndex, 1);
		}
		else if (mode === 'add') {
			var isBefore = t < arr[closestIndex];
			console.log('isBefore', isBefore);
			arr.splice(closestIndex + (isBefore ? 0 : 1), 0, t);
			if (isBefore) {
				++lastIndex;
			}
		}
		else if (mode === 'move') {
			arr[closestIndex] = t;
		}
		else {
			return;
		}

		console.log(JSON.stringify(arr));

		api.update(lastT, lastIndex);
	};

	canvasEl.addEventListener('click', onClick);

	api.update = function(t, currentIdx) {
		var t0 = t - windowSize2;
		var t1 = t + windowSize2;


		// clean bg
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, w, h);


		// find transitions in window -> inWindow
		var inWindow = [];
		for (var i = 0, I = arr.length, item; i < I; ++i) {
			tCurr = arr[i];
			if (tCurr > t1) { break; }
			if (tCurr > t0 && tCurr < t1) {
				inWindow.push( buildTag(i, tCurr) );
			}
		}


		// build segments in window
		var inWindow2 = inWindow.slice();
		var item0, item1;
		if (inWindow2.length === 0) {
			item0 = buildTag(currentIdx  );
			item1 = buildTag(currentIdx+1);
		}
		else {
			item0 = buildTag( inWindow[0                ].index - 1 );
			item1 = buildTag( inWindow[inWindow.length-1].index + 1 );
		}
		if (!item0) { item0 = buildTag(0, t0); }
		if (!item1) { item1 = buildTag(I, t1); }

		if (item1.time === 0) { item1.time = t1; }

		inWindow2.unshift(item0);
		inWindow2.push(   item1);

		// console.log('inWindow',  inWindow);
		// console.log('inWindow2', inWindow2);

		// draw segment areas
		var oPrev, xPrev = 0;
		inWindow2.forEach(function(o, i) {
			var pct = (o.time - t0) / windowSize;
			pct = clamp(pct, 0, 1);
			// console.log(i, pct);
			var x = ~~(pct * w);
				
			if (i > 0) {
				ctx.fillStyle = palette[o.index % 6];
				ctx.fillRect(xPrev, 0, x - xPrev, h);
			}
			
			oPrev = o;
			xPrev = x;
		});

		// draw transitions
		ctx.fillStyle = tagColor;
		inWindow.forEach(function(o) {
			var pct = (o.time - t0) / windowSize;
			var x = ~~(pct * w);
			var l = o.label;
			ctx.fillRect(x, 0, 1, h);

			if (l !== undefined) {
				ctx.fillText(l, x, h2);
			}
		});

		// draw current time
		ctx.fillStyle = ctColor;
		ctx.fillRect(w2, 0, 1, h);

		ctx.fillText(t.toFixed(2), w2, h2);

		lastT = t;
		lastInWindow = inWindow;
		lastIndex = currentIdx;
	};

	api.setMode = function(mode_) {
		//console.log('setMode', mode_);
		mode = mode_;
	};

	api.update(0, -1);

	return api;
};
