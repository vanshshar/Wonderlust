mapboxgl.accessToken = mapToken;


// Initialize the map
const map = new mapboxgl.Map({
  container: 'map', // Container element ID
  style: 'mapbox://styles/mapbox/streets-v12', // Style URL
  center: listing.geometry.coordinates, // [longitude, latitude] of the listing
  zoom: 9, // Zoom level
});

// When the map is loaded, add the custom marker
map.on('load', () => {
    // Load an image from an external URL
    map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png', // URL of the custom icon
        (error, image) => {
            if (error) throw error; // Throw an error if the image cannot load

            // Add the image to the map style with a custom name
            map.addImage('custom-marker', image);

            // Create an HTML element for the custom marker
            const customMarker = document.createElement('div');
            customMarker.className = 'custom-marker';
            customMarker.style.backgroundImage = `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEgSkWvf-m3Jn4VVFDobedrzGr2EuJRs9Opw&s)`; // Custom icon URL
            customMarker.style.width = '50px'; // Set width for the custom marker
            customMarker.style.height = '50px'; // Set height for the custom marker
            customMarker.style.backgroundSize = '100%'; // Scale the background image properly

            // Add a Marker using the custom element
            new mapboxgl.Marker({
                element: customMarker, // Use the custom element as the marker
                anchor: 'bottom' // Set the anchor point to the bottom of the marker
            })
            .setLngLat(listing.geometry.coordinates) // Set the position of the marker
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // Add a popup on marker click
                .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`)
            )
            .addTo(map); // Add the marker to the map
        }
    );
});
