// These are the bar/restaurant listings that will be shown to the user.
var data = {
	locations: [
		{
			title: 'Emporium Logan Square', 
			location: {lat: 41.9242, lng: -87.6993}, 
			place_id:'ChIJvxPg9mLND4gRZQkGFIME1b0',
			foursquare_id: '53c09447498e2e581dcab9ff'
		},
		{
			title: 'Logan Arcade', 
			location: {lat: 41.9243734, lng: -87.6916102}, 
			place_id:'ChIJPUOMoprSD4gRf8R-f-It5HA',
			foursquare_id: '53015818498ee35b40b8892b'
		},
		{
			title: 'Logan Hardware Records', 
			location: {lat: 41.9250107, lng: -87.6936709}, 
			place_id:'ChIJ9z8JoprSD4gRvkWDQVx0WeU',
			foursquare_id: '4b5378dff964a520a89e27e3'
		},
		{
			title: 'Revolution Brewing', 
			location: {lat: 41.9235734, lng: -87.6990944}, 
			place_id:'ChIJsxosZWLND4gRH7vbeVKbuLg',
			foursquare_id: '4b0b3062f964a520582e23e3'
		},
		{
			title: 'Slippery Slope', 
			location: {lat: 41.9239505, lng: -87.7001477}, 
			place_id:'ChIJdy7U9WLND4gRlsn7Bwe_NI8',
			foursquare_id: '5372cc32498ed9eb4bb2b3e4'
		},
		{
			title: 'WhirlyBall Chicago', 
			location: {lat: 41.9213616, lng: -87.6801861}, 
			place_id:'ChIJ36q9du3SD4gRc_oBbj74Fm4',
			foursquare_id: '40b28c80f964a52065fc1ee3'
		}
	],
	fourSquareRating: function (result, status, id) {
        if (!status) {
            data.locations[id].foursquare_rating = "NO RATING FOUND.";
        }
        else {
            data.locations[id].foursquare_rating = result.response.venue.rating;
        }
    }
};