//React
import { useEffect, useState,useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";

//module
import Loading from '../Loading/Loading'

//custom icons
import { ProfileCancelIcon } from '../SVGIcons/SvgComponent';

//CSS
import './ShowMap.css'

const ShowMap = () => 
{
    const [loading,Setloading]=useState(true)
    const [userLiveLocation]=useState({Latitude:'',Longitude:''})
    const user=useSelector((state)=>state.user)
    const Navigate=useNavigate()

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [zoom] = useState(4);
    maptilersdk.config.apiKey = 'wbrYhSY66HizG6tkiSmf';

    const createCustomMarker = (coords) => {
        const customMarker = document.createElement('div');
        customMarker.innerHTML = `<img src="https://www.svgrepo.com/show/143359/car-placeholder.svg"  style="width: 32px; height: 32px;" />`;
        return customMarker;
      };
    

    const PrintMap=async(data)=>
    {
  
        map.current = new maptilersdk.Map({
          container: mapContainer.current,
          style: maptilersdk.MapStyle.value,
          geolocate: maptilersdk.GeolocationType.COUNTRY,
          zoom: zoom,
          fullscreenControl:true
        });


        data.forEach(coords => {
            var popup = new maptilersdk.Popup({ offset: 25 }).setText(
                `${coords.Name}`
            );
        

           const marker= new maptilersdk.Marker({
                element: createCustomMarker(coords),
                anchor: 'center',
            })
            .setLngLat([coords.Longitude,coords.Latitude])
            .setPopup(popup) 
            .addTo(map.current);

            marker.getElement().addEventListener('click', async() => {
                if (userLiveLocation.Latitude !== '' && userLiveLocation.Longitude !== '') 
                {
                const {data} = await axios.get(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248d88fe5d28bfd4d0a8a9f79ea3ae0785f&start=${userLiveLocation.Longitude},${userLiveLocation.Latitude}&end=${coords.Longitude},${coords.Latitude}`);

                let lineStringCoordinates =data.features[0].geometry.coordinates;

                const lineStringSource = {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: lineStringCoordinates,
                    },
                  },
                };
              
                // Example: Dynamically update LineString coordinates
                if (!map.current.getSource('line-string-source')) {

                    map.current.addSource('line-string-source', lineStringSource);
                
                    map.current.addLayer({
                      id: 'line-string-layer',
                      type: 'line',
                      source: 'line-string-source',
                      layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                      },
                      paint: {
                        'line-color': '#333', 
                        'line-width': 3, 
                      },
                    });
                  } else {
                    
                    // Update the LineString source on the map if needed
                    map.current.getSource('line-string-source').setData({
                      type: 'Feature',
                      properties: {},
                      geometry: {
                        type: 'LineString',
                        coordinates: lineStringCoordinates,
                      },
                    });
                  }
              
                }
                else
                {
                    alert('Give Access to location for route')
                }

                map.current.flyTo({
                    center: [coords.Longitude, coords.Latitude],
                    essential: true
                });
            });
        });
      
        Setloading(false)

    }

 
    

  const getLocationDetails = async()=> 
  {
    const {data} = await axios.get('https://drive-easy-customer-server.vercel.app/getFile');
    PrintMap(data)
  }

  const ShowPosition = async(position) => {
   userLiveLocation.Latitude=position.coords.latitude;
   userLiveLocation.Longitude=position.coords.longitude;

  };

  function errorHandler(err) {
    if(err.code == 1) {
       alert("Error: Access is denied!");
    } else if( err.code == 2) {
       alert("Error: Position is unavailable!");
    }
 }


  const getLiveLocation=async()=>
  {
    if(navigator.geolocation)
    {
        navigator.geolocation.watchPosition(ShowPosition,errorHandler)
    }
  }


  useEffect(() => {
   if(user.isAuth)
   {
        getLocationDetails();
        getLiveLocation()
   }
   else
   {
    Navigate('/Login')
   }

  }, []);


  if(loading)
  {
    <Loading/>
  }

  return (
    <div className="ShowMap">
      <div className="ShowMap-title">
        <div className='ShowMap-title-btns'>
          <Link to='/ViewBooking' className='ShowMap-title-btn' ><ProfileCancelIcon width='30px' height='30px' /></Link>
        </div>
        <div className='ShowMap-info'>
           <h2>Our Service Centers</h2>
        </div>
      </div>
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
        </div>  
   
    </div>
  );
};

export default ShowMap;
