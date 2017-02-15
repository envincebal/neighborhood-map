var map;

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

var markers = [];

function initMap(){
 	map = new google.maps.Map(document.getElementById("map"), {
	center: {lat: 45.519692, lng: -122.680496},
	zoom: 16
	});
	var largeInfoWindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < locations.length; i++) {
		var name = locations[i].title;
		var position = locations[i].coordinates;
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: name,
			animation: google.maps.Animation.DROP,
	    id: i
		});
		markers.push(marker);
		bounds.extend(marker.position);
		marker.addListener("click", function(){
			populateInfoWindow(this, largeInfoWindow);
		});
	}

	function populateInfoWindow(marker, infowindow){
		if (infowindow.marker != marker) {
			infowindow.marker = marker;
			infowindow.setContent("<div>" + marker.title + "</div>");
			infowindow.open(map, marker);
			infowindow.addListener("closeclick", function(){
				infowindow.setMarker(null);
			});
		}
		map.fitBounds(bounds);
	}
}

// Map View Model
var ViewModel = function(){

}
