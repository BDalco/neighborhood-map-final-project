
var stringHasText = function (string, startsWith) {
	string = string || "";
	if (startsWith.length > string.length)
		return false;
	return (string.indexOf(startsWith) !== -1);
};

var map;
var clientID = 'UUGLJUVJDKXWWANBKH1MEQFXPU4NR23AWMHCHORPC3K2THZI';
var clientSecret = 'ZSKC3L3IBME0TIQ2NDTOPRTWK0ZA4HENFBOTD0XJ3VVDLYPT';
var foursquareVersion = '20171023';


//  View Model
var ViewModel = function () {
	var self = this;
	this.locationFilter = ko.observable();

	this.items = ko.observableArray(data.locations);

	this.ph = ko.observable("Filter bars..."); 

	this.filteredBars = ko.computed(function () {
		var filter = this.locationFilter();
			if (!filter) {
				return mapHandler.filterPage(this.items());
			} else {
				return mapHandler.filterPage(ko.utils.arrayFilter(this.items(), function (item) {
				return stringHasText(item.title.toLowerCase(), filter.toLowerCase());
			}));

		}
    }, this);

	this.reset = function () {
		self.locationFilter(null);
	};
};

// Map Handler
var mapHandler = {
	bounds: null,
	infoWindow: null,
	map: null,
	markers: [],
	model: null,
	previousMarker:null,
	service: null,

    toggleBounce: function (marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    },
    
    mouseEffect: function (bars) {
        for (var i = 0; i < mapHandler.markers.length; i++) {
            if (bars.title === (mapHandler.markers[i].title)) {
                //animate it
                mapHandler.toggleBounce(mapHandler.markers[i]);
            }
        }
    },

    // load information about the bar
    loadInfo: function (place, status, marker, infowindow) {
        if (mapHandler.previousMarker !== null){
            mapHandler.previousMarker.setIcon(null);
            mapHandler.previousMarker.setAnimation(null);
        }

        // Adds the information to the infoWindow
        var innerHTML = '<div class="barContent">';
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            if (place.name) {
                innerHTML +=
            		'<h3>' + place.name + '</h3>';
            } else {
                innerHTML += 
            		'<h3>' + marker.title + '</h3>';
            }
            if (place.formatted_address) {
                innerHTML += 
                	place.formatted_address +
	                '<br>';
            } else {
                innerHTML += "" +
                    '<br>';
            }
            if (place.formatted_phone_number) {
                innerHTML +=
                    '<br>' +'<strong>Phone Number:</strong> ' + place.formatted_phone_number +
                    '<br>';
            } else {
                innerHTML +=
                    '<br>' +'<strong>Phone Number</strong>: NONE' +
                    '<br>';
            }
            if (place.opening_hours) {
            innerHTML += '<br><strong>Hours:</strong><br>' +
                place.opening_hours.weekday_text[0] + '<br>' +
                place.opening_hours.weekday_text[1] + '<br>' +
                place.opening_hours.weekday_text[2] + '<br>' +
                place.opening_hours.weekday_text[3] + '<br>' +
                place.opening_hours.weekday_text[4] + '<br>' +
                place.opening_hours.weekday_text[5] + '<br>' +
                place.opening_hours.weekday_text[6] + '<br>';
         	 } else {
                innerHTML += "" +
                    '<br>';
            }
            if (place.rating) {
                innerHTML +=
                    '<br>' +'<strong>Rating</strong>: ' + place.rating +
                    '<br>';
            } else {
                innerHTML +=
                    '<br>' +'<strong>Rating</strong>: NONE' +
                    '<br>';
            }
            data.locations.forEach(function (place) {
                if (marker.title == place.title) {
                    innerHTML += 
                        '<br>' + 
                        '<strong>Foursquare Rating:</strong> ' + 
                        place.foursquare_rating + 
                        '<br>';
                }
            });
            if (place.website) {
                innerHTML +=
                    '<br>' +
                    '<a target="_blank" href="'+ place.website + '">' + 'View Website' + '</a>' +
                    '<br>';
            } else {
                innerHTML +=
                    '<br>' +'No Website' +
                    '<br>';
            }
            if (place.photos) {
            innerHTML += '<br><img src="' + place.photos[0].getUrl(
                {maxHeight: 200, maxWidth: 200}) + '">';
          	} else {
                innerHTML += "" +
                    '<br>';
          	}


        }
        infowindow.setContent(innerHTML);
        infowindow.open(self.map, marker);
        mapHandler.previousMarker = marker;    
    },
    filterPage: function (barsList) {
        var reference = mapHandler;
        var barsListNames = [];
        console.log(barsList);
        barsList.forEach(function (element) { barsListNames.push(element.title); });
        for (var i = 0; i < reference.markers.length; i++) {
            if (barsListNames.includes(reference.markers[i].title)) {
                reference.markers[i].setVisible(true);
            } else {
                reference.markers[i].setVisible(false);
            }
        }
        return barsList;

    },
    focusOnMarker: function (bars) {

        var reference = mapHandler;
        if (reference.model !== null) {
            reference.model.reset();
        }
        if (reference.map !== null) {
            var boundsFocus = new google.maps.LatLngBounds();
            for (var i = 0; i < reference.markers.length; i++) {
                if (bars === "All bars") {
                    reference.infoWindow.close();
                    reference.markers[i].setVisible(true);
                    reference.markers[i].setAnimation(null);
                    reference.markers[i].setIcon(null);
                    boundsFocus.extend(reference.markers[i].position);
                }
                else {
                    if (bars.title === (reference.markers[i].title)) {
                        reference.markers[i].setVisible(true);
                        boundsFocus.extend(reference.markers[i].position);
                        reference.toggleBounce(reference.markers[i]);
                        reference.populateInfoWindow(reference.markers[i], reference.infoWindow);
                    }
                }
            }
        }
    },


    populateInfoWindow: function (marker, infowindow) {
        var self = this;

        if (infowindow.marker != marker) {

            infowindow.marker = marker;

            var request = {
                placeId: marker.place_id
            };
            self.service.getDetails(request, ((place, status) => self.loadInfo(place, status, marker, infowindow)));
            infowindow.addListener('closeclick', function () {
                infowindow.setMarker = null;
                marker.setIcon(null);
                self.focusOnMarker("All bars");
                self.map.fitBounds(self.bounds);
            });
        }
    },
    init: function() {
        var self = this;
        self.model = new ViewModel();
        ko.options.deferUpdates = true;

        // Start View Model
        ko.applyBindings(this.model);

        // Starts the Map
        self.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 41.9243734, lng: -87.6916102 },
            zoom: 12,
            mapTypeControl: false
        });
        self.service = new google.maps.places.PlacesService(self.map);
        self.infoWindow = new google.maps.InfoWindow();
        self.bounds = new google.maps.LatLngBounds();

        var i = 0;
        data.locations.forEach(function (element) {
            var marker = new google.maps.Marker({
                map: self.map,
                position: element.location,
                title: element.title,
                animation: google.maps.Animation.DROP,
                place_id: element.place_id
            });
            
            $.ajax({
                url: "https://api.foursquare.com/v2/venues/" + element.foursquare_id + "?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=" + foursquareVersion,
                ratingResult: i
            }).done(function (result) {
                data.fourSquareRating(result, true, this.ratingResult);
            }).fail(function () {
                data.fourSquareRating(null, false, this.ratingResult);
            });

            i += 1;

            self.markers.push(marker);
            marker.addListener('click', function () {
                self.populateInfoWindow(this, self.infoWindow);
                self.toggleBounce(marker);
            });
            self.bounds.extend(marker.position);

        });

        self.map.fitBounds(self.bounds);

    }
};

function errorHandling() {
    alert("I am sorry, Google Maps has failed to load. Please check to be sure you are connected to the internet and try again.");
}