const mapStyle = [{
    'featureType': 'administrative',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'on',
    },
    {
      'lightness': 33,
    },
    ],
  },
  {
    'featureType': 'landscape',
    'elementType': 'all',
    'stylers': [{
      'color': '#f2e5d4',
    }],
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [{
      'color': '#c5dac6',
    }],
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels',
    'stylers': [{
      'visibility': 'on',
    },
    {
      'lightness': 20,
    },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'all',
    'stylers': [{
      'lightness': 20,
    }],
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [{
      'color': '#c5c6c6',
    }],
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'geometry',
    'stylers': [{
      'color': '#e4d7c6',
    }],
  },
  {
    'featureType': 'road.local',
    'elementType': 'geometry',
    'stylers': [{
      'color': '#fbfaf7',
    }],
  },
  {
    'featureType': 'water',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'on',
    },
    {
      'color': '#acbcc9',
    },
    ],
  },
  ];
  
  function initMap() {
    // Create the map.
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {lat: 52.632469, lng: -1.689423},
      styles: mapStyle,
    });
  
    // Load the stores GeoJSON onto the map.
    map.data.loadGeoJson('surgeries.json', {idPropertyName: 'storeid'});
  
    // Define the custom marker icons, using the store's "category".
    map.data.setStyle((feature) => {
      return {
        icon: {
          url: `img/icons8-map-pin-30.png`,
          scaledSize: new google.maps.Size(36, 36),
        },
      };
    });
  
    const apiKey = 'AIzaSyAb5BKeyZAxMxLlhemqMcO0Csutw6ebs2E';
    const infoWindow = new google.maps.InfoWindow();
  
    // "total_patients_2013": 2916.0,
    // "total_patients_2022": 3244.0,
    // "patient_change_pc": 11.248285322359397,
    // "total_gp_hc_2013": 2.0,
    // "total_gp_hc_2022": 2.0,
    // "gp_hc_change_pc": 0.0,
    // "total_gp_fte_2013": 1.5,
    // "total_gp_fte_2022": 1.266666667,
    // "gp_fte_change_pc": -15.555555533333335
    // Show the information for a store when its marker is clicked.
    map.data.addListener('click', (event) => {
        const name = event.feature.getProperty('name');
        const postcode = event.feature.getProperty('postcode');
        const openDate = event.feature.getProperty('open_date');
        const closeDate = event.feature.getProperty('close_date');
        const constituency = event.feature.getProperty('constituency');
        const mp = event.feature.getProperty('MP');
        const party = event.feature.getProperty('Party');
        const patients2013 = event.feature.getProperty('total_patients_2013');
        const patients2022 = event.feature.getProperty('total_patients_2022');
        const fte2013 = event.feature.getProperty('total_gp_fte_2013');
        const fte2022 = event.feature.getProperty('total_gp_fte_2022');
        const patientsPerGP2013 = Math.floor(parseFloat(patients2013) / parseFloat(fte2013));
        const patientsPerGP2022 = Math.floor(parseFloat(patients2022) / parseFloat(fte2022));

        const position = event.feature.getGeometry().get();
        let content = `
        <div style="margin-left:20px; margin-bottom:20px;">
            <h2>${name}</h2><p>${postcode}</p>
        `;
        if (openDate != null || closeDate != null) {
            content += `<p>`
            if (openDate != null) {
            content += `<b>Opened:</b> ${openDate}<br/>`;
            }
            if (closeDate != null) {
            content += `<b>Closed:</b> ${closeDate}`;
            } 
            content += `</p>`;
        } 
        if (party != null) {
            content += `<br/><b>Party</b>: ${party}`;
        }
        if (mp != null) {
            content += `<br/><b>MP</b>: ${mp}`;
        }
        content += `<br/><br/><b>Total Patients</b>`;
        content += `<br/><b>2013</b>: ${patients2013} <b>2022</b>: ${patients2022}`;
        content += `<br/><br/><b>FTEs</b>`;
        content += `<br/><b>2013</b>: ${fte2013} <b>2022</b>: ${fte2022}`;
        content += `<br/></br><b>Patients per GP in 2013</b>: ${patientsPerGP2013}`;
        content += `</br><b>Patients per GP in 2022</b>: ${patientsPerGP2022}`;

        
        

        content += `
            </div>
        `;
        infoWindow.setContent(content);
        infoWindow.setPosition(position);
        infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
        infoWindow.open(map);
    });

    // Build and add the search bar
    const card = document.createElement('div');
    const titleBar = document.createElement('div');
    const title = document.createElement('div');
    const container = document.createElement('div');
    const input = document.createElement('input');
    const options = {
        types: ['address'],
        componentRestrictions: {country: 'gb'},
    };

    card.setAttribute('id', 'pac-card');
    title.setAttribute('id', 'title');
    title.textContent = 'Find the nearest store';
    titleBar.appendChild(title);
    container.setAttribute('id', 'pac-container');
    input.setAttribute('id', 'pac-input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Enter an address');
    container.appendChild(input);
    card.appendChild(titleBar);
    card.appendChild(container);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    // Make the search bar into a Places Autocomplete search bar and select
    // which detail fields should be returned about the place that
    // the user selects from the suggestions.
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.setFields(
        ['address_components', 'geometry', 'name']);

     // Set the origin point when the user selects an address
    const originMarker = new google.maps.Marker({map: map});
    originMarker.setVisible(false);
    let originLocation = map.getCenter();

    autocomplete.addListener('place_changed', async () => {
        originMarker.setVisible(false);
        originLocation = map.getCenter();
        const place = autocomplete.getPlace();

        if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert('No address available for input: \'' + place.name + '\'');
        return;
        }

        // Recenter the map to the selected address
        originLocation = place.geometry.location;
        map.setCenter(originLocation);
        map.setZoom(15);
        console.log(place);

        originMarker.setPosition(originLocation);
        originMarker.setVisible(true);

        // Use the selected address as the origin to calculate distances
        // to each of the store locations
        const rankedStores = await calculateDistances(map.data, originLocation);
        showStoresList(map.data, rankedStores);

        return;
    });
  }

  async function calculateDistances(data, origin) {
    const stores = [];
    const destinations = [];
  
    // Build parallel arrays for the store IDs and destinations
    data.forEach((store) => {
      const storeNum = store.getProperty('storeid');
      const storeLoc = store.getGeometry().get();
  
      stores.push(storeNum);
      destinations.push(storeLoc);
    });
  
    // Retrieve the distances of each store from the origin
    // The returned list will be in the same order as the destinations list
    const service = new google.maps.DistanceMatrixService();
    const getDistanceMatrix =
      (service, parameters) => new Promise((resolve, reject) => {
        service.getDistanceMatrix(parameters, (response, status) => {
          if (status != google.maps.DistanceMatrixStatus.OK) {
            reject(response);
          } else {
            const distances = [];
            const results = response.rows[0].elements;
            for (let j = 0; j < results.length; j++) {
              const element = results[j];
              const distanceText = element.distance.text;
              const distanceVal = element.distance.value;
              const distanceObject = {
                storeid: stores[j],
                distanceText: distanceText,
                distanceVal: distanceVal,
              };
              distances.push(distanceObject);
            }
  
            resolve(distances);
          }
        });
      });
  
    const distancesList = await getDistanceMatrix(service, {
      origins: [origin],
      destinations: destinations,
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
    });
  
    distancesList.sort((first, second) => {
      return first.distanceVal - second.distanceVal;
    });
  
    return distancesList;
  }

  function showStoresList(data, stores) {
    if (stores.length == 0) {
      console.log('empty stores');
      return;
    }
  
    let panel = document.createElement('div');
    // If the panel already exists, use it. Else, create it and add to the page.
    if (document.getElementById('panel')) {
      panel = document.getElementById('panel');
      // If panel is already open, close it
      if (panel.classList.contains('open')) {
        panel.classList.remove('open');
      }
    } else {
      panel.setAttribute('id', 'panel');
      const body = document.body;
      body.insertBefore(panel, body.childNodes[0]);
    }
  
  
    // Clear the previous details
    while (panel.lastChild) {
      panel.removeChild(panel.lastChild);
    }
  
    stores.forEach((store) => {
      // Add store details with text formatting
      const name = document.createElement('p');
      name.classList.add('place');
      const currentStore = data.getFeatureById(store.storeid);
      name.textContent = currentStore.getProperty('name');
      panel.appendChild(name);
      const distanceText = document.createElement('p');
      distanceText.classList.add('distanceText');
      distanceText.textContent = store.distanceText;
      panel.appendChild(distanceText);
    });
  
    // Open the panel
    panel.classList.add('open');
  
    return;
  }