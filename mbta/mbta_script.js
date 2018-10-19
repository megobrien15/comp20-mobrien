var lat;
var lng;
var me;
var map;
var stations = [{name: "South Station", id: "place-sstat", lat:  42.352271, lng: -71.05524200000001, schedule: ""},
				{name: "Andrew", id: "place-andrw", lat: 42.330154, lng: -71.057655, schedule: ""},
				{name: "Porter Square", id: "place-portr", lat: 42.3884, lng: -71.11914899999999, schedule: ""},
				{name: "Harvard Square", id: "place-harsq", lat: 42.373362, lng: -71.118956, schedule: ""},
				{name: "JFK/UMass", id: "place-jfk", lat: 42.320685, lng: -71.052391, schedule: ""},
				{name: "Savin Hill", id: "place-shmnl", lat: 42.31129, lng: -71.053331, schedule: ""},
				{name: "Park Street", id: "place-pktrm", lat: 42.35639457, lng: -71.0624242, schedule: ""},
				{name: "Broadway", id: "place-brdwy", lat: 42.342622, lng: -71.056967, schedule: ""},
				{name: "North Quincy", id: "place-nqncy", lat: 42.275275, lng: -71.029583, schedule: ""},
				{name: "Shawmut", id: "place-smmnl", lat: 42.29312583, lng: -71.06573796000001, schedule: ""},
				{name: "Davis Square", id: "place-davis", lat: 42.39674, lng: -71.121815, schedule: ""},
				{name: "Alewife", id: "place-alfcl", lat: 42.395428, lng: -71.142483, schedule: ""},
				{name: "Kendall/MIT", id: "place-knncl", lat: 42.36249079, lng: -71.08617653, schedule: ""},
				{name: "Charles/MGH", id: "place-chmnl", lat: 42.361166, lng: -71.070628, schedule: ""},
				{name: "Downtown Crossing", id: "place-dwnxg", lat: 42.355518, lng: -71.060225, schedule: ""},
				{name: "Quincy Center", id: "place-qnctr", lat: 42.251809, lng: -71.005409, schedule: ""},
				{name: "Quincy Adams", id: "place-qamnl", lat: 42.233391, lng: -71.007153, schedule: ""},
				{name: "Ashmont", id: "place-asmnl", lat: 42.284652, lng: -71.06448899999999, schedule: ""},
				{name: "Wollaston", id: "place-wlsta", lat: 42.2665139, lng: -71.0203369, schedule: ""},
				{name: "Fields Corner", id: "place-fldcr", lat: 42.300093, lng: -71.061667, schedule: ""},
				{name: "Central Square", id: "place-cntsq", lat: 42.365486, lng: -71.103802, schedule: ""},
				{name: "Braintree", id: "place-brntn", lat: 42.2078543, lng: -71.0011385, schedule: ""}];
var ashmontLine = [{lat: stations[11].lat, lng: stations[11].lng},
						{lat: stations[10].lat, lng: stations[10].lng},
						{lat: stations[2].lat, lng: stations[2].lng},
						{lat: stations[3].lat, lng: stations[3].lng},
						{lat: stations[20].lat, lng: stations[20].lng},
						{lat: stations[12].lat, lng: stations[12].lng},
						{lat: stations[13].lat, lng: stations[13].lng},
						{lat: stations[6].lat, lng: stations[6].lng},
						{lat: stations[14].lat, lng: stations[14].lng},
						{lat: stations[0].lat, lng: stations[0].lng},
						{lat: stations[7].lat, lng: stations[7].lng},
						{lat: stations[1].lat, lng: stations[1].lng},
						{lat: stations[4].lat, lng: stations[4].lng},
						{lat: stations[5].lat, lng: stations[5].lng},
						{lat: stations[19].lat, lng: stations[19].lng},
						{lat: stations[9].lat, lng: stations[9].lng},
						{lat: stations[17].lat, lng: stations[17].lng}];
var braintreeLine = [{lat: stations[4].lat, lng: stations[4].lng},
						{lat: stations[8].lat, lng: stations[8].lng},
						{lat: stations[18].lat, lng: stations[18].lng},
						{lat: stations[15].lat, lng: stations[15].lng},
						{lat: stations[16].lat, lng: stations[16].lng},
						{lat: stations[21].lat, lng: stations[21].lng}]

function initMap() {

	lat = stations[0].lat;
	lng = stations[0].lng;

	me = new google.maps.LatLng(lat, lng);

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: lat, lng: lng}, zoom: 15
	});

	getLocation();
	renderMap();
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			lat = position.coords.latitude;
			lng = position.coords.longitude;
			centerMap();
			addLocMarker();
		});
	}
	else {
		alert("Geolocation not supported by your web browser");
	}
}

function centerMap() {

	me = new google.maps.LatLng(lat, lng);
	map.panTo(me);
}

function addLocMarker() {

	var closestStation = getClosestStation(lat, lng);

	var myMarker;
	var myMarkerImage = 'you_are_here_star.png';

	myMarker = new google.maps.Marker({
		position: me,
		map: map,
		title: "You are here!",
		icon: myMarkerImage
	});

	infoWindow = new google.maps.InfoWindow();
	google.maps.event.addListener(myMarker, 'click', function() {
		infoWindow.setContent("Closest Red Line Station: " + stations[closestStation.station].name + 
				"; \n Distance away: " + closestStation.distance + " miles.");
		infoWindow.open(map, myMarker);
	});
	
	var closestPath = new google.maps.Polyline({
		path: [{lat: lat, lng: lng}, {lat: stations[closestStation.station].lat, lng: stations[closestStation.station].lng}],
		map: map,
		geodesic: true,
		strokeColor: '#340499',
		strokeOpacity: 1.0,
		strokeWeight: 4
	});
}

function renderMap() {

	addMarkers();

	addLines();
	
}

function addMarkers() {

	var trainMarker;
	var trainMarkerImage = 'station.png';
	var infoWindow;

	//add marker at every station
	for (i = 0; i < stations.length; i++) {
		trainMarker = new google.maps.Marker({
			position: {lat: stations[i].lat, lng: stations[i].lng},
			map: map,
			title: stations[i].name,
			icon: trainMarkerImage
		});
		//for each station marker, get schedule and create infowindow
		getSchedule(i, trainMarker);
	}

}
function addLines(closestStation) {

	var ashmontPolyline = new google.maps.Polyline({
		path: ashmontLine,
		map: map,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 4
	});

	var braintreePolyline = new google.maps.Polyline({
		path: braintreeLine,
		map: map,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 4
	});
}

function getClosestStation(myLat, myLng) {
	var closestDist = haversineDistance({lat: myLat, lng: myLng}, {lat: stations[0].lat, lng: stations[0].lng}, true);
	var closestStation = 0;
	for (i = 0; i < stations.length; i++) {
		var curr = haversineDistance({lat: myLat, lng: myLng}, {lat: stations[i].lat, lng: stations[i].lng}, true);
		if (curr < closestDist) {
			closestDist = curr;
			closestStation = i;
		}
	}
	closestObject = {station: closestStation, distance: closestDist};
	return closestObject;
} 
// this function adapted from https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
function haversineDistance(myLatLng, stationLatLng, isMiles) {
	function toRad(x) {
		return x * Math.PI / 180;
	}

	myLat = myLatLng.lat;
	myLng = myLatLng.lng;
	stationLat = stationLatLng.lat;
	stationLng = stationLatLng.lng;

	var R = 6371 // in km

	var x1 = stationLat - myLat;
	var dLat = toRad(x1);
	var x2 = stationLng - myLng;
	var dLng = toRad(x2);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(toRad(myLat)) * Math.cos(toRad(stationLat)) *
			Math.sin(dLng / 2) * Math.sin(dLng / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;

	if (isMiles) {
		d /= 1.60934;
	}
	return d;
}

function getSchedule(stationNumber, trainMarker) {

	stationID = stations[stationNumber].id;
	var stationInfoWindow;
	
	var request = new XMLHttpRequest();
	
	request.open("GET", "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" + stationID, true);

	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var parsed = JSON.parse(request.responseText);
			var direction;
			for (i = 0; i < parsed.data.length; i++) {
				if (parsed.data[i].attributes.direction_id == 1) {
					direction = "Alewife";
				}
				else {
					direction = "Ashmont/Braintree";
				}
				stations[stationNumber].schedule += "<p>" + direction + " train arriving at: " + parsed.data[i].attributes.arrival_time + 
												" and departing at " + parsed.data[i].attributes.departure_time + ";" + "</p>";
			}
		}
	}
	request.send();

	//add infowindow with train schedule
	stationInfoWindow = new google.maps.InfoWindow();
	google.maps.event.addListener(trainMarker, 'click', function() {
		stationInfoWindow.setContent(stations[stationNumber].schedule);
		stationInfoWindow.open(map, trainMarker);
	});	
}