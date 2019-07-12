/*
 * TrackMe from the MeLibs
 * Library that let you easily track
 *
 * Version :
 *  - 1.0.3
 *
 * Supported Libraries :
 * 	- google analytics old tag
 *  - google analytics new universal tag
 *  - google tag manager (only for event)
 *
 * Dependencies :
 *  - jQuery (http://jquery.com/download/)
 *
 * Public Methods :
 *  - setOptions
 *  - getOptions
 *  - page
 *  - social
 *  - event
 *  - outbound
 *
 * Private Methods :
 *	- handleClick
 *
 * Updates Needed :
 *  -
 */

(function($, window, document, undefined) {
	"use strict";

	/* Private Variables */
	var instanceID      = 1;
	var instanceName    = "TrackMe";
	var defaults        = {
		debug: true
	};
	var overwriteKeys   = [
		'debug'
	];

	/* Private Methods */
	var privatesMethods = {};

	/* Builder Method */
	var TrackMe = function(options) {
		this.__construct(options);
	};

	var proto = TrackMe.prototype;

    /* Private Variables */
    proto.__id          = null;
    proto.__name        = null;
    proto.__debugName   = null;

    /* Publics Variables */
    proto.debug         = null;
    proto.options       = null;
	proto.baseUrl       = window.location.protocol + "//" + window.location.host + "/";

	/**
	 *
	 * __construct
	 * the first method that will be executed.
	 *
	 * @param   options     all the options that you need
	 * @return  object      null || scope
	 * @access  private
	 */
	proto.__construct = function(options) {
        this.__id        = instanceID;
        this.__name      = instanceName;
        this.__debugName = this.__name + " :: ";

		this.setOptions(options);

        if (!this.__validateDependencies()) {return null;}
        if (!this.__validateArguments()) {return null;}

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
            if (this.debug) {console.warn(this.__debugName + "required jQuery (http://jquery.com/download/)");}
		}

		return isValid;
	};

	/**
	 *
	 * __validateArguments
	 * Will check if you got all the required options needed to use that plugins
	 *
	 * @return  boolean
	 * @access  private
	 *
	 */
	proto.__validateArguments = function() {
		var isValid = true;

		return isValid;
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
        var scope = this;

        $(document).ready(function() {
            var $body = $('body');

            $body.on('click', 'a[me\\:track\\:outbound], [me\\:track\\:event]', function(e) {
                var $el = $(e.currentTarget);

                if ($el.attr('me:track:outbound')) {e.preventDefault();}
                privatesMethods.handleClick.call(scope, $el);
            });
        });

        return this;
    };

    /**
     *
     * handleClick
     * this will be called when you click on a binded link
     *
     * @param   $el         the jQuery element will be pass
     * @return  void
     * @access  private
     */
    privatesMethods.handleClick = function($el) {
        var cat    = $el.attr('me:track:category');
        var action = ($el.attr('me:track:action')) ? $el.attr('me:track:action') : 'click';
        var label  = ($el.attr('me:track:label')) ? $el.attr('me:track:label') : '';

        if (!cat) {
            if (this.debug) {console.warn(this.__debugName + 'need to set attribute: "me:track:category" on %o', $el);}
            return;
        }

        if ($el.attr('me:track:outbound') != undefined) {
            this.outbound(cat, action, label, $el.attr('href'));
        } else if ($el.attr('me:track:event') != undefined) {
            this.event(cat, action, label);
        }
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
        var scope    = this;
        var settings = (this.options) ? $.extend({}, this.options, options) : $.extend({}, defaults, options);

        $.each(settings, function(index, value) {
            if ($.inArray(index, overwriteKeys) != -1) {
                scope[index] = value;
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
	 * page
	 * send a pageview event
	 *
	 * @return  object scope
	 * @access  public
	 *
	 */
	proto.page = function(url) {
		if (this.debug) {console.info(this.__debugName, "pageview :: " + url);}

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

		if (this.debug) {console.info(this.__debugName, "social :: {network:'" + network + "', action:'" + action + "', url:'" + newTargetURL + "'}");}

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
		if (!callback) {
            if (this.debug) {console.info(this.__debugName, "event :: {category:'" + category + "', action:'" + action + "', label:'" + label + "'}");}
        }

		if(window.dataLayer){
			dataLayer.push({'event': 'GAEvent', 'eventCategory': category, 'eventAction': action, 'eventLabel': label});
		} else if (window.gtag) {
			gtag('event', action, {
				'event_category': category,
				'event_label': label
			});
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
		if (this.debug) {console.info(this.__debugName, "outbound :: {category:'" + category + "', action:'" + action + "', label:'" + label + "', redirectUrl:'" + url + "'}");}

		this.event(category, action, label, function() {
            document.location = url;
        });

		return this;
	};

	proto.toString = function() {
		return "[" + this.__name + "]";
	};

    /* Create Me reference if does'nt exist */
    if (!window.Me) {window.Me = {};}

	/*  */
	Me.track = new TrackMe();
}(jQuery, window, document));