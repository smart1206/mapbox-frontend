import './App.css';
import { useState, useRef, useEffect } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import axios from 'axios';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PK;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-121.9263491953451); // center point longitude
  const [lat, setLat] = useState(37.33238732457649); // center point latitude
  const [zoom, setZoom] = useState(11); // zoom level of Mapbox

  useEffect(() => {
    let coordinatesArr = [];

    // fetch random coordinates from server
    async function fetchData() {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/random_coordinates`, {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        });

        if (data.success) {
          coordinatesArr = data.result;
        } else {
          alert('Data fetch was failed.')
        }
      } catch (error) {
        console.log(error);
      }
    }

    Promise.all([fetchData()]).then(() => {
      if (map.current) return; // initialize map only once

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
      });

      // add markers to map
      coordinatesArr.map((point) => {
        const el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add it to the map
        new mapboxgl.Marker(el)
          .setLngLat([point.longitude, point.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<p>Longitude: ${point.longitude}</p><p>Latitude: ${point.latitude}</p>`
              )
          )
          .addTo(map.current);
      });
    })
  }, []);

  return (
    <div className="App" >
      <div ref={mapContainer} className="map-container" />
    </div >
  );
}

export default App;
