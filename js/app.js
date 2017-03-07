// Locations Model
var locations = [
{
	title: "Powell's Books",
	address: "1005 W Burnside St, Portland, OR 97209",
	coordinates: {lat: 45.523096, lng: -122.681354},
	showMe: ko.observable(true)
},
{
	title: "Ground Kontrol",
	address: "511 NW Couch St, Portland, OR 97209",
	coordinates: {lat: 45.523943, lng: -122.675872},
	showMe: ko.observable(true)
},
{
	title: "Portland Art Museum",
	address: "1219 SW Park Ave, Portland, OR 97205",
	coordinates: {lat: 45.51615, lng: -122.683357},
	showMe: ko.observable(true)
},
{
	title: "Roseland Theater",
	address: "8 NW 6th Ave, Portland, OR 97209",
	coordinates: {lat: 45.52328, lng: -122.676297},
	showMe: ko.observable(true)
},
{
	title: "Voodoo Doughnuts",
	address: "22 SW 3rd Ave, Portland, OR 97204",
	coordinates: {lat: 45.522713, lng: -122.672944},
	showMe: ko.observable(true)
},
{
	title: "Arlene Schnitzer Concert Hall",
	address: "1037 SW Broadway, Portland, OR 97205",
	coordinates: {lat: 45.517197, lng: -122.681419},
	showMe: ko.observable(true)
},
{
	title: "Pioneer Place",
	address: "700 SW 5th Ave, Portland, OR 97204",
	coordinates: {lat: 45.518335, lng: -122.677261},
	showMe: ko.observable(true)
}];

var map;
var largeInfoWindow;
var markers = [];

var Place = function(data){
	this.title = ko.observable(data.title);
	this.address = ko.observable(data.address);
	this.coordinates = ko.observable(data.coordinates);
}

function initMap(){
	map = new google.maps.Map(document.getElementById("map"), {
		center: {lat: 45.519692, lng: -122.680496},
		zoom: 16
	});

	largeInfoWindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();
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
		marker.addListener("click", function(){
			populateInfoWindow(this);
			toggleBounce(this);
		});
	}	
	map.fitBounds(bounds);
}

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){
    	marker.setAnimation(null);
    }, 1400);
  }
}

function populateInfoWindow(marker){
	if (largeInfoWindow.marker != marker) {
		largeInfoWindow.marker = marker;
		
		largeInfoWindow.open(map, marker);
		largeInfoWindow.setContent('Loading...');

		var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&callback?";
    //Create ajax request object
    $.ajax({
  		type: "GET",
  		async: false,
      url: wikiUrl,
      dataType: "jsonp",
      success: function(data) {
        console.log(data);
        
				largeInfoWindow.addListener("closeclick", function(){
					largeInfoWindow.marker = null;
				});
	      largeInfoWindow.setContent("<p><strong>" + marker.title + "</strong><br>" + marker.address + "</p><p>" + data[2][0] + "</p><p>" + "Click <a href='" + data[3][0] + "' target='_blank'><strong>HERE</strong></a> for more information on " + marker.title + ".</p>");
      }
    }).fail(function(jqXHR, textStatus, errorThrown){
				largeInfoWindow.addListener("closeclick", function(){
					largeInfoWindow.marker = null;
				});
	      largeInfoWindow.setContent("<p><strong>" + marker.title + "</strong><br>" + marker.address + "</p><p> Sorry. Could not retrieve data for " + marker.title + ".</p>");
    });
	}
}

// Map View Model
var ViewModel = function(){
	var self = this;

	this.filter = ko.observable("");

	this.locationList = ko.observableArray([]);

	locations.forEach(function(place){
		self.locationList.push(new Place(place));
	});

	this.listItemClick = function() {
		google.maps.event.trigger(this.marker, 'click');
	}

	this.filterLocations = ko.dependentObservable(function(){
		var search = this.filter().toLowerCase();
		return ko.utils.arrayFilter(locations, function(place){
			return place.title.toLowerCase().indexOf(search) >= 0;
		});
	},this); 
		// You can use this function to loop through locations and filter them
}

ko.applyBindings(new ViewModel());