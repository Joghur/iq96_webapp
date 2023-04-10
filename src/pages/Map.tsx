import React, {memo, useEffect, useRef, useState} from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  useMapEvents,
  Tooltip,
  TileLayer,
  useMap,
} from 'react-leaflet';
import L, {Icon} from 'leaflet';
import {useFirestore} from '../utils/hooks/useFirestore';
import {Button, Stack, useMediaQuery, useTheme} from '@mui/material';
import SkeletonComponent from '../components/SkeletonComponent';
import type {User} from 'firebase/auth';
import SelectComponent from '../components/SelectComponent';

// interface Coordinate {
//   lat: number;
//   lng: number;
// }

// interface MarkerData {
//   location: Coordinate;
//   description: string;
//   madeBy: string;
//   nick: string;
//   title: string;
//   type: string;
// }

interface Props {
  authUser: User | null;
  showLogin: (arg0: boolean) => void;
}

const handleDocType = (docType: string, madeBy: string) => {
  switch (madeBy) {
    case 'app':
      return `${docType}_red`;

    default:
      return docType;
  }
};

function FlyToSelector({markers}: any) {
  const map = useMap();
  const [center, setCenter] = useState([
    markers[0].location.latitude,
    markers[0].location.longitude,
  ]);

  const handleSelectChange = (event: any) => {
    const value = event.target.value;
    const selectedMarker = markers.filter((d: any) => d.title === value)[0];
    setCenter([
      selectedMarker.location.latitude,
      selectedMarker.location.longitude,
    ]);
  };

  useEffect(() => {
    const latlng = L.latLng(center[0], center[1]);
    map.flyTo(latlng, 18, {
      duration: 2,
    });
  }, [center[0]]);

  const selectValues = markers.map((s: any) => ({
    value: s.title,
    label: s.nick,
    colour: s.madeBy === 'app' ? 'red' : 'black',
  }));

  return (
    <SelectComponent onChange={handleSelectChange} options={selectValues} />
  );
}

// function UserMapComponent() {
//   const map = useMap();
//   const [pos, setPos] = useState<number[]>([]);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       position => {
//         const {latitude, longitude} = position.coords;
//         setPos([latitude, longitude]);
//         map.flyTo([latitude, longitude], map.getZoom());
//       },
//       error => console.error(error),
//       {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0,
//       },
//     );
//   }, [map]);

//   return (
//     <>
//       {pos.length > 0 && (
//         <Marker
//           position={[pos[0], pos[1]]}
//           icon={
//             new Icon({
//               iconUrl: `marker-icon.png`,
//               iconSize: [25, 25],
//               iconAnchor: [18, 18],
//               popupAnchor: [0, -10],
//             })
//           }>
//           <Popup>Du</Popup>
//         </Marker>
//       )}
//     </>
//   );
// }

function UserMapButton() {
  const map = useMapEvents({
    locationfound: location => {
      map.flyTo(location.latlng, map.getZoom());
    },
  });

  const handleFlyToUserLocation = () => {
    map.locate();
  };

  return (
    <Button
      variant="contained"
      onClick={handleFlyToUserLocation}
      sx={{
        zIndex: 9999,
        backgroundColor: 'gray',
      }}>
      Du
    </Button>
  );
}

const Map = ({authUser, showLogin}: Props) => {
  const {docs, loading} = useFirestore('map', 'type');

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('sm'));

  console.log('docs', docs);
  const windowHeight = useRef(window.innerHeight);

  const minusHeaderBottom = small ? 160 : 190;
  const vh =
    ((windowHeight.current - minusHeaderBottom) * 100) / windowHeight.current;

  if (!authUser) {
    return (
      <>
        <p>Mangler login...</p>
        <Button variant="outlined" onClick={() => showLogin(true)}>
          Login
        </Button>
      </>
    );
  }

  if (loading) {
    return <SkeletonComponent />;
  }
  const centerArray = docs?.filter(d => d.madeBy === 'app');

  return (
    <>
      <Stack direction="row"></Stack>
      <MapContainer
        center={
          centerArray.length === 1
            ? [
                centerArray[0].location.latitude,
                centerArray[0].location.longitude,
              ]
            : [
                docs[0]?.location?.latitude || 0,
                docs[0]?.location?.longitude || 0,
              ]
        }
        zoom={20}
        style={{height: `${vh}vh`, width: '100wh'}}>
        <Stack direction="row" justifyContent="flex-end">
          <UserMapButton />
          <FlyToSelector markers={docs} />
        </Stack>
        {/* <UserMapComponent /> */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {docs.map((doc, index) => (
          <Marker
            key={index}
            position={[doc.location.latitude, doc.location.longitude]}
            icon={
              new Icon({
                iconUrl: `${handleDocType(doc.type, doc.madeBy)}.png`,
                iconSize: [25, 25],
                iconAnchor: [18, 18],
                popupAnchor: [0, -10],
              })
            }>
            <Popup>
              <div>
                <h2>{doc.title}</h2>
                <p>{doc.description}</p>
              </div>
            </Popup>
            <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
              {doc.nick}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default memo(Map);
