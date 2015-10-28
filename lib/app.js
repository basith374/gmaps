// (function(){

  var map;
  var directionsService;
  var directionsDisplay;

  function initMap() {
    console.log('[BLUROE] Initializing maps');
    var caltex = {lat: 11.876, lng: 75.373};
    var bluroe = {lat:11.874, lng:75.383};
    var home = {lat:11.775, lng:75.463};

    var hanHome = {lat:11.8545, lng:75.4195};
    var waxHome = {lat:11.9187, lng:75.354};
    var rixHome = {lat:11.8254, lng:75.4889};

    // INITIATE MAP
    map = new google.maps.Map(document.getElementById('map'), {
      center: caltex,
      zoom: 8
    });

    // COORDS WIDGET
    var coordsDiv = document.getElementById('coords');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(coordsDiv);
    map.addListener('mousemove', function(event) {
      coordsDiv.textContent = 'lat:' + Math.round10(event.latLng.lat(), -4) + ', ' + 'lng: ' + Math.round10(event.latLng.lng(), -4);
    });

    // MARKERS
    var blu = new google.maps.Marker({
      position: bluroe,
      map: map,
      title: 'Bluroe Labs!'
    });
    console.log('[BLUROE] marking bluroe labs');

    var han = new google.maps.Marker({
      position: hanHome,
      map: map,
      title: 'Hanjaz\'s home'
    });
    console.log('[BLUROE] marking hanjaz\'s home');

    var wax = new google.maps.Marker({
      position: waxHome,
      map: map,
      title: 'Waxx\'s home'
    });
    console.log('[BLUROE] marking waxx\'s home');

    var rix = new google.maps.Marker({
      position: rixHome,
      map: map,
      title: 'Rixx\'s home'
    });
    console.log('[BLUROE] marking rixx\'s home');

    // SYMBOL
    var lineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      strokeColor: '#393'
    }
    // var line = new google.maps.Polyline({
    //   path:[home, caltex],
    //   icons: [{
    //     icon: lineSymbol,
    //     offset: '100%'
    //   }],
    //   map: map
    // })

    // animateCircle(line);

    // DIRECTIONS SERVICE
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var dharmadom = new google.maps.LatLng(home.lat, home.lng);
    directionsDisplay.setMap(map);
    calcRoute(home, caltex);

    // DISTANCES
    var distanceService = new google.maps.DistanceMatrixService();
    var calTex = new google.maps.LatLng(caltex.lat, caltex.lng);
    var manal = new google.maps.LatLng(11.889, 75.3622);
    var nachu = new google.maps.LatLng(11.8033, 75.4851);
    distanceService.getDistanceMatrix({
      origins: [dharmadom,nachu],
      destinations: [calTex,manal],
      travelMode: google.maps.TravelMode.DRIVING,
      // transitOptions: TransitOptions,
      unitSystem: google.maps.UnitSystem.METRIC,
      durationInTraffic: true,
      avoidHighways: true,
      avoidTolls: true,
    }, function(response, status) {
      console.log(response);
      // for(origin in response.originAddresses) {
      for(var i=0;i<response.originAddresses.length;i++) {
        console.log('distance from ' + response.originAddresses[i]);
        // for(destination in response.destinationAddresses) {
        for(var j=0;j<response.destinationAddresses.length;j++) {
          console.log('to ' + response.destinationAddresses[j] + ' = ' + response.rows[i].elements[j].distance.text);
        }
      }
    });
  }

  function calcRoute(s, e) {
    // var start = document.getElementById('start').value;
    // var end = document.getElementById('end').value;
    console.log('[BLUROE] calculating route from (' + s.lat + ',' + s.lng + ') to (' + e.lat + ',' + e.lng + ')');
    var start = new google.maps.LatLng(s.lat,s.lng);
    var end = new google.maps.LatLng(e.lat,e.lng);
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
      if(status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
        console.log(result);

        var path = getPath(result);

        var line = createLine(path);

        animateCircle(line);
      }
    })
  }

  function getPath(result) {
    var paths = result.routes[0].legs[0].steps.map(function(step) {
      return step.path;
    });
    var newpath = [];
    for(path in paths) {
      newpath = newpath.concat(paths[path]);
    }
    return newpath;
  }

  function createLine(path) {
    return new google.maps.Polyline({
      path: path,
      icons: [{
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          strokeColor: '#393'
        },
        offset: '100%'
      }],
      map: map
    });
  }

  function animateCircle(line) {
    var count = 0;
    window.setInterval(function() {
      count = (count + 1) % 200;
      var icons = line.get('icons');
      icons[0].offset = (count / 2) + '%';
      line.set('icons', icons);
    }, 20);
  }

// })();