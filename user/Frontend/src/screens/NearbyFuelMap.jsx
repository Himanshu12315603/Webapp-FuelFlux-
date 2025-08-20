 

// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import axios from 'axios';
// import 'leaflet/dist/leaflet.css';
// import axiosInstance from '../../Utils/axiosInstance';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import HeaderComp from '../components/HeaderComp';
// import { useNavigate } from 'react-router';
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// const ORS_API_KEY = '5b3ce3597851110001cf6248b8e4c592a256423483fb0fdbc3fd5062';
// const radiusOptions = [5000, 10000, 20000, 50000];

// const ChangeMapView = ({ coords }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (coords) map.setView(coords, 14);
//   }, [coords]);
//   return null;
// };

// const NearbyFuelMap = () => {
//   const navigate = useNavigate() ;
//   const [userLocation, setUserLocation] = useState(null);
//   const [stations, setStations] = useState([]);
//   const [selectedRadius, setSelectedRadius] = useState(5000);
//   const [routeCoords, setRouteCoords] = useState([]);
//   const [selectedStation, setSelectedStation] = useState(null);
//   const [distanceKm, setDistanceKm] = useState(null);
//   const [stationAddresses, setStationAddresses] = useState({});
 
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         });
//       },
//       () => alert('Failed to get your location.')
//     );
//   }, []);

//   const getAddressFromCoords = async (lat, lon, id) => {
//   try {
//     const apiKey = 'cffd4711030d452a97a1d40ddfe8e242'; // Replace with your real key
//     const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

//     const response = await axios.get(url);
//     const address = response.data.results[0]?.formatted || 'Address not found';
//     setStationAddresses((prev) => ({ ...prev, [id]: address }));
//   } catch (error) {
//     console.error('Reverse geocoding failed:', error);
//     setStationAddresses((prev) => ({ ...prev, [id]: 'Address not found' }));
//   }
// };



//   useEffect(() => {
//     const fetchStations = async () => {
//       if (!userLocation) return;

//       const { lat, lng } = userLocation;
//       const query = `
//         [out:json];
//         node["amenity"="fuel"](around:${selectedRadius},${lat},${lng});
//         out;
//       `;
//       const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

//       try {
//         const res = await axios.get(url);
//         const validStations = (res.data.elements || []).filter((s) => s.lat && s.lon);
//         setStations(validStations);

//         // Fetch addresses for new stations
//         validStations.forEach((station) => {
//           if (!stationAddresses[station.id]) {
//             getAddressFromCoords(station.lat, station.lon, station.id);
//           }
//         });
//       } catch (error) {
//         console.error('Error fetching stations:', error);
//         setStations([]);
//       }
//     };

//     fetchStations();
//   }, [userLocation, selectedRadius]);

//   // const savePump = async (station) => {
//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     const response = await axiosInstance.post(
//   //       '/api/stations/stationsave',
//   //       {
//   //         lat: station.lat,
//   //         lon: station.lon,
//   //         name: station.tags?.name || 'Unknown Station',
//   //         operator: station.tags?.operator || 'Unknown Operator',
//   //         address: station.tags?.address||'Unknow address' ,
//   //       },
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       }
//   //     );
//   //     alert('Pump saved successfully!');
//   //     console.log('Saved station:', response.data);
//   //   } catch (err) {
//   //     console.error('Failed to save pump:', err.response?.data || err.message);
//   //     alert(`Failed to save pump: ${err.response?.data?.error || err.message}`);
//   //   }
//   // };

//   const savePump = async (station) => {
//   try {
//     const token = localStorage.getItem('token');
//     const stationAddress = stationAddresses[station.id] || 'Address not found';

//     const response = await axiosInstance.post(
//       '/api/stations/stationsave',
//       {
//         lat: station.lat,
//         lon: station.lon,
//         name: station.tags?.name || 'Unknown Station',
//         operator: station.tags?.operator || 'Unknown Operator',
//         address: stationAddress,   
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     alert('Pump saved successfully!');
//     navigate('/bookings')
    
//     console.log('Saved station:', response.data);
    
//   } catch (err) {
//     console.error('Failed to save pump:', err.response?.data || err.message);
//     alert(`Failed to save pump: ${err.response?.data?.error || err.message}`);
//   }
// };

//   const getRoute = async (station) => {
//     if (!userLocation) return;

//     try {
//       const body = {
//         coordinates: [
//           [userLocation.lng, userLocation.lat],
//           [station.lon, station.lat],
//         ],
//       };

//       const response = await axios.post(
//         'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
//         body,
//         {
//           headers: {
//             Authorization: ORS_API_KEY,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       const coords = response.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
//       const distanceMeters = response.data.features[0].properties.summary.distance;
//       setRouteCoords(coords);
//       setDistanceKm((distanceMeters / 1000).toFixed(2));
//       setSelectedStation(station);
//     } catch (error) {
//       console.error('Error fetching route:', error);
//       alert('No route found between your location and this fuel station.');
//     }
//   };

//   return (
//     <div>
//       <HeaderComp />
//       <h2 className="mt-52 md:mt-4 text-center">Nearby Fuel Stations</h2>

//       <div className="text-center mb-4">
//         {radiusOptions.map((radius) => (
//           <button
//             key={radius}
//             onClick={() => setSelectedRadius(radius)}
//             style={{
//               margin: '0 5px',
//               padding: '6px 12px',
//               backgroundColor: radius === selectedRadius ? '#ffa500' : '#ccc',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//             }}
//           >
//             {radius / 1000} KM
//           </button>
//         ))}
//       </div>

//       {userLocation && (
//         <MapContainer center={userLocation} zoom={13} scrollWheelZoom style={{ height: '500px' }}>
//           <ChangeMapView coords={userLocation} />
//           <TileLayer
//             attribution='&copy; OpenStreetMap contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <Marker className='text-red-600' position={userLocation}>
//             <Popup>You are here</Popup>
//           </Marker>

//           {stations.map((station) => (
//             <Marker key={station.id} position={{ lat: station.lat, lng: station.lon }}>
//               <Popup>
//                 <strong>{station.tags?.name || 'Fuel Station'}</strong>
//                 <br />
//                 Operator: {station.tags?.operator || 'Unknown'}
//                 <br />
//                 Address: {stationAddresses[station.id] || 'Loading address...'}
//                 <br />
//                 <button onClick={() => getRoute(station)}>Show Route</button>
//                 <br />
//                 <button
//                   onClick={() => savePump(station)}
//                   style={{
//                     backgroundColor: '#28a745',
//                     color: '#fff',
//                     padding: '5px',
//                     borderRadius: '5px',
//                     margin: '5px 0',
//                     border: 'none',
//                     cursor: 'pointer',
//                   }}
//                 >
//                   Save Pump
//                 </button>
//                 <br />
//                 <a
//                   href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${station.lat},${station.lon}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   Open in Google Maps
//                 </a>
//               </Popup>
//             </Marker>
//           ))}

//           {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
//         </MapContainer>
//       )}

//       {selectedStation && (
//         <div style={{ margin: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '10px' }}>
//           <h3>Route Info</h3>
//           <p>
//             <strong>Station:</strong> {selectedStation.tags?.name || 'Fuel Station'}
//           </p>
//           <p>
//             <strong>Distance:</strong> {distanceKm} km
//           </p>
//           <p>
//             <strong>Address:</strong> {stationAddresses[selectedStation.id] || 'Loading address...'}
//           </p>
//         </div>
//       )}

//       <div style={{ padding: '10px' }}>
//         {stations.length === 0 ? (
//           <p style={{ textAlign: 'center' }}>No stations found in this radius.</p>
//         ) : (
//           stations.map((station) => (
//             <div
//               key={station.id}
//               style={{
//                 border: '1px solid #ddd',
//                 borderRadius: '8px',
//                 padding: '10px',
//                 marginBottom: '10px',
//                 backgroundColor: '#f7f7f7',
//               }}
//             >
//               <h3>{station.tags?.name || 'Fuel Station'}</h3>
//               <p><strong>Address:</strong> {stationAddresses[station.id] || 'Loading address...'}</p>
//               <p>Operator: {station.tags?.operator || 'Unknown'}</p>

//               <button
//                 onClick={() => getRoute(station)}
//                 style={{
//                   backgroundColor: '#ffa500',
//                   color: '#fff',
//                   border: 'none',
//                   borderRadius: '4px',
//                   padding: '5px 10px',
//                   cursor: 'pointer',
//                   marginRight: '10px',
//                 }}
//               >
//                 Show Route
//               </button>

//               <button
//                 onClick={() => savePump(station)}
//                 style={{
//                   padding: '6px 12px',
//                   backgroundColor: '#28a745',
//                   color: '#fff',
//                   border: 'none',
//                   borderRadius: '5px',
//                   marginRight: '10px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Save Pump
//               </button>

//               <a
//                 href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${station.lat},${station.lon}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600"
//               >
//                 Open in Google Maps
//               </a>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default NearbyFuelMap;


// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import axios from 'axios';
// import 'leaflet/dist/leaflet.css';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import { useNavigate } from 'react-router';
// import axiosInstance from '../../Utils/axiosInstance';

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// const ORS_API_KEY = 'cffd4711030d452a97a1d40ddfe8e242';
// const radiusOptions = [5000, 10000, 20000, 50000];  // Radius in meters

// const ChangeMapView = ({ coords }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (coords) map.setView(coords, 13);
//   }, [coords]);
//   return null;
// };

// const NearbyFuelMap = () => {
//   const navigate = useNavigate();
//   const [userLocation, setUserLocation] = useState(null);
//   const [stations, setStations] = useState([]);
//   const [routeCoords, setRouteCoords] = useState([]);
//   const [selectedStation, setSelectedStation] = useState(null);
//   const [distanceKm, setDistanceKm] = useState(null);
//   const [selectedRadius, setSelectedRadius] = useState(5000);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         });
//       },
//       () => alert('Failed to get your location.')
//     );
//   }, []);

//   useEffect(() => {
//     const fetchStations = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/stations', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         const pumps = response.data.data || [];
//         console.log(pumps);
        
//         // Filter pumps based on selected radius
//         const filteredPumps = pumps.filter(pump => {
//           const distance = getDistance(userLocation?.lat, userLocation?.lng, pump.lat, pump.lon);
//           return distance <= selectedRadius / 1000;  // Convert meters to KM
//         });

//         setStations(filteredPumps);

//         filteredPumps.forEach(pump => {
//           console.log(`Pump: ${pump.name}, Latitude: ${pump.lat}, Longitude: ${pump.lon}`);
//         });
//       } catch (error) {
//         console.error('Error fetching pumps:', error);
//       }
//     };

//     if (userLocation) fetchStations();
//   }, [userLocation, selectedRadius]);

//   const getDistance = (lat1, lon1, lat2, lon2) => {
//     if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
//     const R = 6371; // km
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   const getRoute = async (station) => {
//     if (!userLocation) return;

//     try {
//       const body = {
//         coordinates: [
//           [userLocation.lng, userLocation.lat],
//           [station.lon, station.lat],
//         ],
//       };

//       const response = await axios.post(
//         'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
//         body,
//         {
//           headers: {
//             Authorization: ORS_API_KEY,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       const coords = response.data.features[0].geometry.coordinates.map(
//         ([lng, lat]) => [lat, lng]
//       );
//       const distanceMeters = response.data.features[0].properties.summary.distance;
//       setRouteCoords(coords);
//       setDistanceKm((distanceMeters / 1000).toFixed(2));
//       setSelectedStation(station);
//     } catch (error) {
//       console.error('Error fetching route:', error);
//       alert('No route found between your location and this station.');
//     }
//   };

//   // ✅ Save pump
//   const savePump = async (station) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axiosInstance.post(
//         '/api/stations/stationsave',
//         {
//           lat: station.lat,
//           lon: station.lon,
//           name: station.name || 'Unknown Station',
//           operator: station.operator || 'Unknown Operator',
//           address: station.address || 'Address not found',
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       alert('Pump saved successfully!');
//       console.log('Saved pump:', response.data);
//       navigate('/bookings');
//     } catch (err) {
//       console.error('Failed to save pump:', err.response?.data || err.message);
//       alert(`Failed to save pump: ${err.response?.data?.error || err.message}`);
//     }
//   };

//   return (
//     <div>
//       <h2 className="mt-52 md:mt-4 text-center">Nearby Petrol Pumps</h2>

//       {/* ✅ Radius filter buttons */}
//       <div className="text-center mb-4">
//         {radiusOptions.map((radius) => (
//           <button
//             key={radius}
//             onClick={() => setSelectedRadius(radius)}
//             style={{
//               margin: '0 5px',
//               padding: '6px 12px',
//               backgroundColor: radius === selectedRadius ? '#ffa500' : '#ccc',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//             }}
//           >
//             {radius / 1000} KM
//           </button>
//         ))}
//       </div>

//       {/* ✅ Map */}
//       {userLocation && (
//         <MapContainer center={userLocation} zoom={13} scrollWheelZoom style={{ height: '500px' }}>
//           <ChangeMapView coords={userLocation} />
//           <TileLayer
//             attribution='&copy; OpenStreetMap contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <Marker position={userLocation}>
//             <Popup>You are here</Popup>
//           </Marker>

//           {stations.map((station) => (
//             <Marker key={station._id} position={{ lat: station.lat, lng: station.lon }}>
//               <Popup>
//                 <strong>{station.name}</strong>
//                 <br />
//                 Operator: {station.operator}
//                 <br />
//                 Address: {station.address || 'Address not found'}
//                 <br />
//                 <button onClick={() => getRoute(station)}>Show Route</button>
//                 <br />
//                 <button
//                   onClick={() => savePump(station)}
//                   style={{
//                     backgroundColor: '#28a745',
//                     color: '#fff',
//                     padding: '5px',
//                     borderRadius: '5px',
//                     margin: '5px 0',
//                     border: 'none',
//                     cursor: 'pointer',
//                   }}
//                 >
//                   Save Pump
//                 </button>
//                 <br />
//                 <a
//                   href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${station.lat},${station.lon}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   Open in Google Maps
//                 </a>
//               </Popup>
//             </Marker>
//           ))}

//           {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
//         </MapContainer>
//       )}

//       {/* ✅ Route Info */}
//       {selectedStation && (
//         <div style={{ margin: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '10px' }}>
//           <h3>Route Info</h3>
//           <p><strong>Station:</strong> {selectedStation.name}</p>
//           <p><strong>Distance:</strong> {distanceKm} km</p>
//           <p><strong>Address:</strong> {selectedStation.address}</p>
//         </div>
//       )}

//       {/* ✅ Pump list below */}
//       <div style={{ padding: '10px' }}>
//         {stations.length === 0 ? (
//           <p style={{ textAlign: 'center' }}>No stations found in this radius.</p>
//         ) : (
//           stations.map((station) => (
//             <div
//               key={station._id}
//               style={{
//                 border: '1px solid #ddd',
//                 borderRadius: '8px',
//                 padding: '10px',
//                 marginBottom: '10px',
//                 backgroundColor: '#f7f7f7',
//               }}
//             >
//               <h3>{station.name}</h3>
//               <p><strong>Address:</strong> {station.address || 'Address not found'}</p>
//               <p>Operator: {station.operator || 'Unknown'}</p>

//               <button
//                 onClick={() => getRoute(station)}
//                 style={{
//                   backgroundColor: '#ffa500',
//                   color: '#fff',
//                   border: 'none',
//                   borderRadius: '4px',
//                   padding: '5px 10px',
//                   cursor: 'pointer',
//                   marginRight: '10px',
//                 }}
//               >
//                 Show Route
//               </button>

//               <button
//                 onClick={() => savePump(station)}
//                 style={{
//                   padding: '6px 12px',
//                   backgroundColor: '#28a745',
//                   color: '#fff',
//                   border: 'none',
//                   borderRadius: '5px',
//                   marginRight: '10px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Save Pump
//               </button>

//               <a
//                 href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${station.lat},${station.lon}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600"
//               >
//                 Open in Google Maps
//               </a>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default NearbyFuelMap;


import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import { useNavigate } from 'react-router';
import axiosInstance from '../../Utils/axiosInstance';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// const ORS_API_KEY = 'cffd4711030d452a97a1d40ddfe8e242';
const OPENCAGE_API_KEY = 'cffd4711030d452a97a1d40ddfe8e242'; // ⛳ Replace this with your OpenCage key
const radiusOptions = [5000, 10000, 20000, 50000]; // Radius in meters

const ChangeMapView = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 13);
  }, [coords]);
  return null;
};

const fetchAddressFromLatLon = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`
    );
    const results = response.data.results;
    return results.length > 0 ? results[0].formatted : 'Address not found';
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Address not found';
  }
};

const NearbyFuelMap = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [selectedRadius, setSelectedRadius] = useState(5000);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert('Failed to get your location.')
    );
  }, []);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/stations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const pumps = response.data || [];
          console.log("pump data", pumps)
        // ✅ Filter only admin-created stations (userid is null)
        const adminStations = pumps.filter(pump => pump.userid === null);

        // ✅ Filter within radius
        const filteredPumps = adminStations.filter(pump => {
          const distance = getDistance(userLocation?.lat, userLocation?.lng, pump.lat, pump.lon);
          return distance <= selectedRadius / 1000;
        });

        // ✅ Get address from OpenCage for each
        const stationsWithAddress = await Promise.all(
          filteredPumps.map(async (pump) => {
            const address = await fetchAddressFromLatLon(pump.lat, pump.lon);
            return { ...pump, address };
          })
        );

        setStations(stationsWithAddress);
      } catch (error) {
        console.error('Error fetching pumps:', error);
      }
    };

    if (userLocation) fetchStations();
  }, [userLocation, selectedRadius]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getRoute = async (station) => {
    if (!userLocation) return;

    try {
      const body = {
        coordinates: [
          [userLocation.lng, userLocation.lat],
          [station.lon, station.lat],
        ],
      };

      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        body,
        {
          headers: {
            Authorization: ORS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const coords = response.data.features[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );
      const distanceMeters = response.data.features[0].properties.summary.distance;
      setRouteCoords(coords);
      setDistanceKm((distanceMeters / 1000).toFixed(2));
      setSelectedStation(station);
    } catch (error) {
      console.error('Error fetching route:', error);
      alert('No route found between your location and this station.');
    }
  };

  const savePump = async (station) => {
    try {
      const token = localStorage.getItem('token');
      // Save pump to DB (optional, can be kept)
      await axiosInstance.post(
        '/api/stations/stationsave',
        {
          lat: station.lat,
          lon: station.lon,
          name: station.name || 'Unknown Station',
          operator: station.operator || 'Unknown Operator',
          address: station.address || 'Address not found',
          fuelTypes: station.fuelTypes || [],
          prices: station.prices || {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Debug: log station object and fuelTypes before navigating
      console.log('Passing pump to Bookings.jsx:', station);
      console.log('Pump fuelTypes:', station.fuelTypes);
      // Pass full station object to Bookings.jsx
      navigate('/bookings', {
        state: {
          pump: station
        }
      });
    } catch (err) {
      console.error('Failed to save pump:', err.response?.data || err.message);
      alert(`Failed to save pump: ${err.response?.data?.error || err.message}`);
    }
  };



// const savePump = async (station) => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await axiosInstance.post('/api/stations/stationsave', {
//       lat: station.lat,
//       lon: station.lon,
//       name: station.name || 'Unknown Station',
//       operator: station.operator || 'Unknown Operator',
//       address: station.address || 'Address not found',
//       fuelTypes: station.fuelTypes || [],
//       prices: station.prices || {}
//     }, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     alert('Pump saved successfully!');

//     // ✅ Pass station data to booking via navigation state
//     navigate('/bookings', {
//       state: {
//         pump: station
//       }
//     });

//   } catch (err) {
//     console.error('Failed to save pump:', err.response?.data || err.message);
//     alert(`Failed to save pump: ${err.response?.data?.error || err.message}`);
//   }
// };




// const savePump = async (station) => {
//   try {
//     const token = localStorage.getItem('token');

//     // 🔍 Find first available fuel type from nozzles
//     let selectedFuel = '';
//     if (station.nozzles) {
//       for (let key in station.nozzles) {
//         if (station.nozzles[key] > 0) {
//           selectedFuel = key;
//           break;
//         }
//       }
//     }

//     // Attach selected fuel type to the station object before navigating
//     const enrichedStation = {
//       ...station,
//       selectedFuelType: selectedFuel
//     };

//     // Save to DB (optional, only if needed)
//     await axiosInstance.post('/api/stations/stationsave', {
//       lat: station.lat,
//       lon: station.lon,
//       name: station.name || 'Unknown Station',
//       operator: station.operator || 'Unknown Operator',
//       address: station.address || 'Address not found',
//       fuelTypes: station.fuelTypes || [],
//       prices: station.prices || {}
//     }, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     //  Pass data to booking screen
//     navigate('/bookings', {
//       state: { pump: enrichedStation }
//     });

//   } catch (err) {
//     console.error('Failed to save pump:', err.response?.data || err.message);
//     alert(`Failed to save pump: ${err.response?.data?.error || err.message}`);
//   }
// };


  return (
    <div>
      <h2 className="mt-52 md:mt-4 text-center">Nearby Petrol Pumps</h2>

      <div className="text-center mb-4">
        {radiusOptions.map((radius) => (
          <button
            key={radius}
            onClick={() => setSelectedRadius(radius)}
            style={{
              margin: '0 5px',
              padding: '6px 12px',
              backgroundColor: radius === selectedRadius ? '#ffa500' : '#ccc',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {radius / 1000} KM
          </button>
        ))}
      </div>

      {userLocation && (
        <MapContainer center={userLocation} zoom={13} scrollWheelZoom style={{ height: '500px' }}>
          <ChangeMapView coords={userLocation} />
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>

          {stations.map((station) => (
            <Marker key={station._id} position={{ lat: station.lat, lng: station.lon }}>
              <Popup>
                <strong>{station.name}</strong>
                <br />
                Operator: {station.operator}
                <br />
                Address: {station.address || 'Address not found'}
                <br />
                <button onClick={() => getRoute(station)}>Show Route</button>
                <br />
                <button
                  onClick={() => savePump(station)}
                  style={{
                    backgroundColor: '#28a745',
                    color: '#fff',
                    padding: '5px',
                    borderRadius: '5px',
                    margin: '5px 0',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Save Pump
                </button>
                <br />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${station.lat},${station.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </a>
              </Popup>
            </Marker>
          ))}

          {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
        </MapContainer>
      )}

{/*       {selectedStation && (
        <div style={{ margin: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '10px' }}>
          <h3>Route Info</h3>
          <p><strong>Station:</strong> {selectedStation.name}</p>
          <p><strong>Distance:</strong> {distanceKm} km</p>
          <p><strong>Address:</strong> {selectedStation.address}</p>
        </div>
      )} */}


{selectedStation && (
  <div className="mt-4 p-4 bg-white rounded shadow">
    <h2 className="text-xl font-semibold mb-2">Book from: {selectedStation.name}</h2>

    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
          await axiosInstance.post(
            '/api/booking', // replace with your actual API endpoint
            {
              stationId: selectedStation._id,
              fuelTypes: selectedStation.fuelTypes,
              name: selectedStation.name,
              lat: selectedStation.lat,
              lon: selectedStation.lon,
              address: selectedStation.address || '',
              operator: selectedStation.operator || 'Unknown',
              // add other form fields here if needed
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert('Booking successful!');
        } catch (err) {
          console.error(err);
          alert('Booking failed!');
        }
      }}
    >
      <div className="mb-2">
        <label className="block font-medium">Fuel Types:</label>
        <input
          type="text"
          value={selectedStation.fuelTypes.join(', ') || 'None'}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      {/* Optional: Show address or other info */}
      <div className="mb-2">
        <label className="block font-medium">Address:</label>
        <input
          type="text"
          value={selectedStation.address}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      <button
        type="submit"
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Book Now
      </button>
    </form>
  </div>
)}


      <div style={{ padding: '10px' }}>
        {stations.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No stations found in this radius.</p>
        ) : (
          stations.map((station) => (
            <div
              key={station._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#f7f7f7',
              }}
            >
              <h3>{station.name}</h3>
              <p><strong>Address:</strong> {station.address || 'Address not found'}</p>
              <p>Operator: {station.operator || 'Unknown'}</p>

              <button
                onClick={() => getRoute(station)}
                style={{
                  backgroundColor: '#ffa500',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  marginRight: '10px',
                }}
              >
                Show Route
              </button>

              <button
                onClick={() => savePump(station)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                Save Pump
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${station.lat},${station.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                Open in Google Maps
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NearbyFuelMap;
