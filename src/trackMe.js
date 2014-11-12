(function($, window, document, undefined) {
	var TrackMe = function(options) {
		var defaults = {
			debug:true
		};
		this.options = $.extend({}, defaults, options);
		this._initialize();
	};

	var p = TrackMe.prototype;
	p.options = null;

	p._initialize = function() {
		var scope = this;
		$('body').on('click', 'a.track-outbound', function(e) {
			e.preventDefault();
			var cat = $(this).attr('me:track:category');
			if (!cat) {
				console.warn('Need to set attribute: "me:track:category" on %o', $(this));
				return;
			}
			var action = ($(this).attr('me:track:action')) ? $(this).attr('me:track:action') : 'click';
			var label = ($(this).attr('me:track:label')) ? $(this).attr('me:track:label') : '';
			scope.outbound(cat, action, label, $(this).attr('href'));
		});

		$('body').on('click', 'a.track-event', function(e) {
			var cat = $(this).attr('me:track:category');
			if (!cat) {
				console.warn('Need to set attribute: "me:track:category" on %o', $(this));
				return;
			}
			var action = ($(this).attr('me:track:action')) ? $(this).attr('me:track:action') : 'click';
			var label = ($(this).attr('me:track:label')) ? $(this).attr('me:track:label') : '';
			scope.event(cat, action, label);
		});
	};

	p.page = function(url) {
		if (this.options.debug) {
			console.log("TrackMe :: pageview :: " + "/" + url);
		}
		if(window._gaq){
			_gaq.push(['_trackPageview', "/" + url]);
		}
		if(window.ga){
			ga('send', 'pageview', "/" + url);
		}
	};

	p.social = function(network, action, targetURL) {
		var newTargetURL;
		if (network == 'facebook' || network == 'gplus') {
			newTargetURL = targetURL.replace('/' + SETTINGS.BASE_URL, '');
		} else {
			newTargetURL = targetURL;
		}

		if (this.options.debug) {
			console.log("TrackMe :: social event :: {network:'" + network + "', action:'" + action + "', url:'" + newTargetURL + "'}");
		}
		if (window._gaq) {
			_gaq.push(['_trackSocial', network, action, newTargetURL]);
		}
		if (window.ga) {
			ga('send', 'social', network, action, newTargetURL);
		}
	};

	p.event = function(category, action, label, callback) {
		if (this.options.debug) {
			console.log("TrackMe :: event :: {category:'" + category + "', action:'" + action + "', label:'" + label + "'}");
		}

		if (window._gaq) {
			if (callback) {
				_gaq.push(['_trackEvent', category, action, label, {'hitCallback':callback}]);
			} else {
				_gaq.push(['_trackEvent', category, action, label]);
			}
		}
		if (window.ga) {
			if (callback) {
				ga('send', 'event', category, action, label, {'hitCallback':callback});
			} else {
				ga('send', 'event', category, action, label);
			}
		}
	};


	/**
	 * Function that tracks a click on an outbound link in Google Analytics.
	 * This function takes a valid URL string as an argument, and uses that URL string
	 * as the event label.
	 **/
	p.outbound = function(category, action, label, url) {
		if (this.options.debug) {
			console.log("TrackMe :: outbound event :: {category:'" + category + "', action:'" + action + "', label:'" + label + "', redirectUrl:'" + url + "'}");
		}
		this.event(category, action, label, function() {
			document.location = url;
		});
	};

	var privateMethods = {
	};

	if(!window.Me){
		window.Me = {};
	}
	window.Me.track = new TrackMe();
}(jQuery, window, document));