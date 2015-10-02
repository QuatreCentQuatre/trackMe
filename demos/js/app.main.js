$(document).ready(function() {
    Me.track.page(window.location);
	Me.track.event("Category", "Action", "Label", function() {
		console.log("after callback");
	});
});