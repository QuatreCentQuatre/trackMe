/*
 * TrackMe from the MeLibs
 * Library that let you easily track
 *
 * Version :
 *  - 2.0.0
 *
 * Supported Libraries :
 * 	- google analytics 4
 *  - google tag manager
 *
 * Public Methods :
 *	- addEvents
 *	- removeEvents
 *
 * Private Methods :
 *	- init
 *  - __pushClickEvent
 */

defaultConfigs = {
    'currency': 'CAD',
    'country': 'CA'
}

/**
 * @desc Initialise defaults for gtag and trigger TrackMe addEvents
 * @returns {boolean}
 */
function init() {
    if (!window.dataLayer) {
        console.error('No dataLayer found.');

        return false;
    }

    gtag('set', defaultConfigs);
    gtag('consent', 'default', {'ad_storage': 'allowed', 'analytics_storage': 'allowed'});

    Me.track.addEvents();

    return true;
}

class TrackMe {
    /**
     * @desc Remove all events added through me:track:click attribute inside target
     * @param target
     */
    removeEvents(target = document) {
        const self = this;

        target.querySelectorAll('[me\\:track\\:click]').forEach(function (el) {
            el.removeEventListener('click', self.__pushClickEvent);
        });
    }

    /**
     * @desc Add click event on all elements with attribute me:track:click inside target
     * @param target
     */
    addEvents(target = document) {
        const self = this;

        target.querySelectorAll('[me\\:track\\:click]').forEach(function (el) {
            el.addEventListener('click', self.__pushClickEvent);
        });
    }

    /**
     * @desc Push to dataLayer meTrack event with data taken from me:track:data attribute
     * @param e
     * @private
     */
    __pushClickEvent(e) {
        const data = JSON.parse(e.target.getAttribute('me:track:data'));

        window.dataLayer.push('meTrack', data);
    }
}

window.Me = window.Me || {};
Me.track = new TrackMe();

document.addEventListener('DOMContentLoaded', function () {
    init();
});