/*
 * TrackMe from the MeLibs
 * Library that let you easily track
 * Supported Libraries :
 * 	- google analytics old tag
 *  - google analytics new universal tag
 *  - google tag manager (only for event)
 *
 * Dependencies :
 *  - Jquery
 *
 * Private Methods :
 *	- handleClick
 *
 * Public Methods :
 *  - setOptions
 *  - getOptions
 *  - page
 *  - social
 *  - event
 *  - outbound
 */

(function($, window, document, undefined) {
	"use strict";
	/* Private Variables */
	var instanceID   = 1;
	var instanceName = "TrackMe";
	var defaults     = {
		debug: true
	};
	var overwriteKeys = [
		'debug'
	];

	/* Private Methods */
	var privatesMethods = {};

	/**
	 *
	 * handleClick
	 * this will be called when you click on a binded link
	 *
	 * @param   $el  the jquery element will be pass
	 * @return  void
	 * @access  private
	 */
	privatesMethods.handleClick = function($el) {
		var cat    = $el.attr('me:track:category');
		var action = ($el.attr('me:track:action')) ? $el.attr('me:track:action') : 'click';
		var label  = ($el.attr('me:track:label')) ? $el.attr('me:track:label') : '';
		if (!cat) {console.warn('Need to set attribute: "me:track:category" on %o', $el); return;}

		if ($el.attr('me:track:outbound') != undefined) {
			this.outbound(cat, action, label, $el.attr('href'));
		} else if ($el.attr('me:track:event') != undefined) {
			this.event(cat, action, label);
		}
	};

	/* Builder Method */
	var TrackMe = function(options) {
		this.__construct(options);
	};

	var proto = TrackMe.prototype;

	proto.debug       = null;
	proto.id          = null;
	proto.name        = null;
	proto.dname       = null;
	proto.options     = null;
	proto.baseUrl     = window.location.protocol + "//" + window.location.host + "/";

	/**
	 *
	 * __construct
	 * the first method that will be executed.
	 *
	 * @param   options  all the options that you need
	 * @return  object    null || scope
	 * @access  private
	 */
	proto.__construct = function(options) {
		this.id    = instanceID;
		this.name  = instanceName;
		this.dname = this.name + ":: ";
		this.setOptions(options);

		if (!this.__validateDependencies()) {return null;}
		if (!this.__validateOptions()) {return null;}
		instanceID ++;

		this.__initialize();
		return this;
	};

	/**
	 *
	 * __validateDependencies
	 * Will check if you got all the dependencies needed to use that plugins
	 *
	 * @return  boolean
	 * @access  private
	 *
	 */
	proto.__validateDependencies = function() {
		var isValid = true;
		if (!window.jQuery) {
			isValid = false;
			console.warn(this.dname + "You need jquery");
		}
		return isValid;
	};

	/**
	 *
	 * __validateOptions
	 * Will check if you got all the required options needed to use that plugins
	 *
	 * @return  boolean
	 * @access  private
	 *
	 */
	proto.__validateOptions = function() {
		var isValid = true;
		return isValid;
	};

	/**
	 *
	 * setOptions
	 * will merge options to the plugin defaultKeys and the rest will be set as additionnal options
	 *
	 * @param   options
	 * @return  object scope
	 * @access  public
	 *
	 */
	proto.setOptions = function(options) {
		var $scope = this;
		var settings = $.extend({}, defaults, options);
		$.each(settings, function(index, value) {
			if ($.inArray(index, overwriteKeys) != -1) {
				$scope[index] = value;
				delete settings[index];
			}
		});
		this.options = settings;
		return this;
	};

	/**
	 *
	 * getOptions
	 * return the additional options that left
	 *
	 * @return  object options
	 * @access  public
	 *
	 */
	proto.getOptions = function() {
		return this.options;
	};

	/**
	 *
	 * __initialize
	 * set the basics
	 *
	 * @return  object scope
	 * @access  private
	 *
	 */
	proto.__initialize = function() {
		var $scope = this;
		$(document).ready(function() {
			var $body  = $('body');
			$body.on('click', 'a[me\\:track\\:outbound], [me\\:track\\:event]', function(e) {
				e.preventDefault();
				var $el = $(e.currentTarget);
				privatesMethods.handleClick.call($scope, $el);
			});
		});
		return this;
	};

	/**
	 *
	 * page
	 * send a pageview event
	 *
	 * @return  object scope
	 * @access  public
	 *
	 */
	proto.page = function(url) {
		if (this.debug) {console.info(this.dname, "pageview :: " + url);}

		if (window._gaq) {
			_gaq.push(['_trackPageview', url]);
		} else if (window.ga) {
			ga('send', 'pageview', url);
		}
		return this;
	};

	/**
	 *
	 * social
	 * send a social event
	 *
	 * @return  object scope
	 * @access  public
	 *
	 */
	proto.social = function(network, action, targetURL) {
		var newTargetURL = targetURL.replace(this.baseUrl, '');
		if (this.debug) {console.info(this.dname, "social :: {network:'" + network + "', action:'" + action + "', url:'" + newTargetURL + "'}");}

		if (window._gaq) {
			_gaq.push(['_trackSocial', network, action, newTargetURL]);
		} else if (window.ga) {
			ga('send', 'social', network, action, newTargetURL);
		}
		return this;
	};

	/**
	 *
	 * event
	 * send a event
	 *
	 * @return  object scope
	 * @access  public
	 *
	 */
	proto.event = function(category, action, label, callback) {
		if (!callback) {if (this.debug) {console.info(this.dname, "event :: {category:'" + category + "', action:'" + action + "', label:'" + label + "'}");}}

		if (window.dataLayer) {
			dataLayer.push({'event': 'GAEvent', 'eventCategory': category, 'eventAction': action, 'eventLabel': label});
		} else if (window._gaq) {
			if (callback) {_gaq.push(['_trackEvent', category, action, label, {'hitCallback':callback}]);}
			else {_gaq.push(['_trackEvent', category, action, label]);}
		} else if (window.ga) {
			if (callback) {ga('send', 'event', category, action, label, {'hitCallback':callback});}
			else {ga('send', 'event', category, action, label);}
		}
		return this;
	};

	/**
	 *
	 * outbound
	 * this will track a outbound link with event before and will then redirect when analytics got the track to the url
	 *
	 * @return  object scope
	 * @access  public
	 *
	 */
	proto.outbound = function(category, action, label, url) {
		if (this.debug) {console.info(this.dname, "outbound :: {category:'" + category + "', action:'" + action + "', label:'" + label + "', redirectUrl:'" + url + "'}");}

		this.event(category, action, label, function(){document.location = url;});
		return this;
	};

	proto.toString = function(){
		return "[" + this.name + "]";
	};

	/* Create Me reference if does'nt exist */
	if(!window.Me){window.Me = {};}
	/* Initiate to make a Singleton */
	window.Me.track = new TrackMe({test:"asd"});
}(jQuery, window, document));