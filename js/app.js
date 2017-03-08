// Locations Model
var locations = [
{
	title: "Powell's Books",
	address: "1005 W Burnside St, Portland, OR 97209",
	coordinates: {lat: 45.523096, lng: -122.681354},
},
{
	title: "Ground Kontrol",
	address: "511 NW Couch St, Portland, OR 97209",
	coordinates: {lat: 45.523943, lng: -122.675872},
},
{
	title: "Portland Art Museum",
	address: "1219 SW Park Ave, Portland, OR 97205",
	coordinates: {lat: 45.51615, lng: -122.683357},
},
{
	title: "Roseland Theater",
	address: "8 NW 6th Ave, Portland, OR 97209",
	coordinates: {lat: 45.52328, lng: -122.676297},
},
{
	title: "Voodoo Doughnuts",
	address: "22 SW 3rd Ave, Portland, OR 97204",
	coordinates: {lat: 45.522713, lng: -122.672944},
},
{
	title: "Arlene Schnitzer Concert Hall",
	address: "1037 SW Broadway, Portland, OR 97205",
	coordinates: {lat: 45.517197, lng: -122.681419},
},
{
	title: "Pioneer Place",
	address: "700 SW 5th Ave, Portland, OR 97204",
	coordinates: {lat: 45.518335, lng: -122.677261},
}];

var map;
var largeInfoWindow;
var markers = [];

// This constructor's properties are tied to observables that automatically update
var Place = function(data){
	this.title = ko.observable(data.title);
	this.address = ko.observable(data.address);
	this.coordinates = ko.observable(data.coordinates);
}

// Renders Google Maps and location markers onto browser
function initMap(){
	map = new google.maps.Map(document.getElementById("map"), {
		center: {lat: 45.519692, lng: -122.680496},
		zoom: 16,
		mapTypeControl: false
	});

	largeInfoWindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	// Loops through array of locations properties and adds them to each marker
	for (var i = 0; i < locations.length; i++) {
		var name = locations[i].title;
		var position = locations[i].coordinates;
		var address = locations[i].address;
		
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: name,
			address: address,
			animation: google.maps.Animation.DROP,
	    id: i
		});
		locations[i].marker = marker;
		bounds.extend(marker.position);

		// When user clicks a marker, it displays its information window and makes it bounce
		marker.addListener("click", function(){
			populateInfoWindow(this);
			toggleBounce(this);
		});
	}
	// Automatically centralizes all markers to fit on browser	
	map.fitBounds(bounds);
}

// Sets bounce animation when marker is clicked
function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
  	// Pans marker and info window to center of page when clicked
  	map.panTo(marker.position);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    // Sets time limit for bounce animation to 1.4 seconds
    setTimeout(function(){
    	marker.setAnimation(null);
    }, 1400);
  }
}

// Populates info window with relevant details
function populateInfoWindow(marker){
	if (largeInfoWindow.marker != marker) {
		largeInfoWindow.marker = marker;
		
		// Opens up 'loading...' message while AJAX call is retrieving data
		largeInfoWindow.open(map, marker);
		largeInfoWindow.setContent('Loading...');

		// Wikipedia endpoint
		var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&callback?";
    // Creates ajax request object
    $.ajax({
  		type: "GET",
  		async: false,
      url: wikiUrl,
      dataType: "jsonp",
      success: function(data) {
        console.log(data);
        
        // Info window closes when 'close' button is clicked
				largeInfoWindow.addListener("closeclick", function(){
					largeInfoWindow.marker = null;
				});

				// Appends Wikipedia content and locations array data into info window
	      largeInfoWindow.setContent("<p><strong>" + marker.title + "</strong><br>" + marker.address + "</p><p>" + data[2][0] + "</p><p>" + "Click <a href='" + data[3][0] + "' target='_blank'><strong>HERE</strong></a> for more information on " + marker.title + ".</p>");
      }
    }).fail(function(jqXHR, textStatus, errorThrown){
			largeInfoWindow.addListener("closeclick", function(){
				largeInfoWindow.marker = null;
			});

			// If AJAX call fails, an error is appended to info window instead
      largeInfoWindow.setContent("<p><strong>" + marker.title + "</strong><br>" + marker.address + "</p><p> Sorry. Could not retrieve data for " + marker.title + ".</p>");
    });
	}
}

// Map View Model
var ViewModel = function(){

	// Binds each marker with it's respective list view item when clicked
	this.listItemClick = function() {
		google.maps.event.trigger(this.marker, 'click');
	}

	// Search filter is made into an observable
	this.filter = ko.observable("");

	// This ko.dependentObservable function will return and filter out list view items to match search input
	this.filterLocations = ko.dependentObservable(function(){
		var search = this.filter().toLowerCase();
		return ko.utils.arrayFilter(locations, function(place){
			if (place.title.toLowerCase().indexOf(search) >= 0){
				// check if the marker exists and sets markers to visible if true
				if(typeof place.marker === "object"){
					place.marker.setVisible(true);
				}
					return true;
				}else{
					// marker does not exists then it sets markers to be invisble
				if (typeof place.marker === 'object') {
					place.marker.setVisible(false);
				}
					return false;
				}
			});
	},this); 
}

// Applies binding to new View Model object
	ko.applyBindings(new ViewModel());