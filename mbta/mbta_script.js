var lat;
var lon;
var me;
var map;
var marker;
var infoWindow;
var stations = [{name: "South Station", id: "place-sstat", lat:  42.352271, lon: -71.05524200000001},
				{name: "Andrew", id: "place-andrw", lat: 42.330154, lon: -71.057655},
				{name: "Porter Square", id: "place-portr", lat: 42.3884, lon: -71.11914899999999},
				{name: "Harvard Square", id: "place-harsq", lat: 42.373362, lon: -71.118956},
				{name: "JFK/UMass", id: "place-jfk", lat: 42.320685, lon: -71.052391},
				{name: "Savin Hill", id: "place-shmnl", lat: 42.31129, lon: -71.053331},
				{name: "Park Street", id: "place-pktrm", lat: 42.35639457, lon: -71.0624242},
				{name: "Broadway", id: "place-brdwy", lat: 42.275275, lon: -71.056967},
				{name: "North Quincy", id: "place-nqncy", lat: 42.275275, lon: -71.029583},
				{name: "Shawmut", id: "place-smmnl", lat: 42.29312583, lon: -71.029583},
				{name: "Davis", id: "place-davis", lat: 42.39674, lon: -71.121815},
				{name: "Alewife", id: "place-alfcl", lat: 42.39674, lon: -71.121815},
				{name: "Kendall/MIT", id: "place-knncl", lat: 42.36249079, lon: -71.08617653},
				{name: "Charles/MGH", id: "place-chmnl", lat: 42.361166, lon: -71.070628},
				{name: "Downtown Crossing", id: "place-dwnxg", lat: 42.355518, lon: -71.060225},
				{name: "Quincy Center", id: "place-qnctr", lat: 42.251809, lon: -71.005409},
				{name: "Quincy Adams", id: "place-qamnl", lat: 42.233391, lon: -71.007153},
				{name: "Ashmont", id: "place-asmnl", lat: 42.284652, lon: -71.06448899999999},
				{name: "Wollaston", id: "place-wlsta", lat: 42.2665139, lon: -71.0203369},
				{name: "Fields Corner", id: "place-fldcr", lat: 42.300093, lon: -71.061667},
				{name: "Central Square", id: "place-cntsq", lat: 42.365486, lon: -71.103802},
				{name: "Braintree", id: "place-brntn", lat: 42.2078543, lon: -71.0011385}];

function initMap() {

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: stations[0].lat, lng: stations[0].lon}, zoom: 20
	});
	getLocation();
}

/* the following two functions written with help from the example 
   geolocation_map.html in the comp20 github repo */

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			renderMap();
		});
	}
	else {
		alert("Geolocation not supported by your web browser");
	}
}

function renderMap() {
	me = new google.maps.LatLng(lat, lon);
	map.panTo(me);

	var closestStation = getClosestStation();

	var image = 'you_are_here_star.png';
	marker = new google.maps.Marker({
		position: me,
		map: map,
		title: "Closest Red Line Station: " + stations[closestStation].name + "\n" + 
				"Distance away: " + google.maps.geometry.spherical.computeDistanceBetween(me, {lat: stations[closestStation].lat, lng: stations[closestStation].lon}),
		icon: image
	});

	infoWindow = new google.maps.InfoWindow()
	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.setContent(marker.title);
		infoWindow.open(map, marker);
	});
}

function getClosestStation() {
	var closestDist = google.maps.geometry.spherical.computeDistanceBetween(me, {lat: stations[0].lat, lng: stations[0].lon});
	var closestStation = 0;
	for (i = 0; i < stations.count; i++) {
		var curr = google.maps.geometry.spherical.computeDistanceBetween(me, {lat: stations[i].lat, lng: stations[i].lon});
		if (curr < currClosest) {
			closestDist = curr;
			closestStation = i;
		}
	}
	return closestStation;
}
