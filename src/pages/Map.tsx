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
import L, {Icon, LatLngExpression} from 'leaflet';
import {DocumentUser, useFirestore} from '../utils/hooks/useFirestore';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SkeletonComponent from '../components/SkeletonComponent';
import type {User} from 'firebase/auth';
import SelectComponent from '../components/SelectComponent';
import {BoldText} from '../components/FormDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DynamicText from '../components/DynamicText';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MarkerData {
  id: string;
  location: Coordinate;
  description: string;
  madeBy: string;
  nick: string;
  title: string;
  type: string;
}

const handleDocType = (docType: string, madeBy: string) => {
  switch (madeBy) {
    case 'app':
      return `${docType}_red`;

    default:
      return docType;
  }
};

const FlyToSelector = ({markers}: {markers: MarkerData[]}) => {
  const map = useMap();
  const [center, setCenter] = useState([
    markers[0].location.latitude,
    markers[0].location.longitude,
  ]);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    const selectedMarker = markers.filter(
      (d: MarkerData) => d.title === value,
    )[0];
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

  const selectValues = markers.map(s => ({
    value: s.title,
    label: s.nick,
    colour: s.madeBy === 'app' ? 'red' : 'black',
  }));

  return (
    <SelectComponent onChange={handleSelectChange} options={selectValues} />
  );
};

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

interface Props {
  documentUser: DocumentUser | null;
}

const Map = ({documentUser}: Props) => {
  const {
    docs: markers,
    loading,
    updatingDoc,
    deletingDoc,
  } = useFirestore<MarkerData>('map', 'type');
  const [userPosition, setUserPosition] = useState<
    LatLngExpression | undefined
  >(undefined);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentMarker, setCurrentMarker] = useState<MarkerData | undefined>(
    undefined,
  );

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('sm'));

  const windowHeight = useRef(window.innerHeight);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setUserPosition(
          L.latLng(position.coords.latitude, position.coords.longitude),
        );
      },
      error => console.error(error),
    );
  }, []);

  const minusHeaderBottom = small ? 150 : 60;
  const vh =
    ((windowHeight.current - minusHeaderBottom) * 100) / windowHeight.current;

  if (loading) {
    return <SkeletonComponent />;
  }

  const handleOpenEditMarker = (marker: MarkerData) => {
    setShowEdit(true);
    setCurrentMarker(marker);
  };

  const handleOpenDeleteModal = (marker: MarkerData) => {
    setShowDeleteModal(true);
    setCurrentMarker(marker);
  };

  const handleDeleteMarker = () => {
    if (currentMarker?.id) {
      deletingDoc(currentMarker.id);
    }
    setShowDeleteModal(false);
    setCurrentMarker(undefined);
  };

  const handleChangeMarker = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = event.target;
    setCurrentMarker(old => {
      if (old) {
        return {
          ...old,
          [id]: value,
        };
      }
    });
  };

  const handleSubmitMarker = () => {
    if (currentMarker?.id) {
      updatingDoc(currentMarker.id, {...currentMarker});
    }
    setShowEdit(false);
    setCurrentMarker(undefined);
  };

  const canEdit = documentUser?.isSuperAdmin || false;

  return (
    <>
      {userPosition && (
        <>
          <MapContainer
            center={userPosition}
            zoom={20}
            style={{height: `${vh}vh`, width: '100wh'}}>
            <Stack direction="row" justifyContent="flex-end">
              <UserMapButton />
              {markers && <FlyToSelector markers={markers} />}
            </Stack>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={userPosition}
              icon={
                new Icon({
                  iconUrl: `${process.env.PUBLIC_URL}/images/avatars/${
                    documentUser?.avatar || 'marker-icon'
                  }.png`,
                  iconSize: [25, 25],
                  iconAnchor: [18, 18],
                  popupAnchor: [0, -10],
                })
              }>
              <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                {documentUser?.nick}
              </Tooltip>
            </Marker>
            {markers &&
              markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={[
                    marker.location.latitude,
                    marker.location.longitude,
                  ]}
                  icon={
                    new Icon({
                      iconUrl: `${
                        process.env.PUBLIC_URL
                      }/images/markers/${handleDocType(
                        marker.type,
                        marker.madeBy,
                      )}.png`,
                      iconSize: [25, 25],
                      iconAnchor: [18, 18],
                      popupAnchor: [0, -10],
                    })
                  }>
                  <Popup>
                    <div>
                      {!showEdit && (
                        <>
                          <Stack spacing={2}>
                            <DynamicText desktop="h5" mobile="h6">
                              {marker.title}
                            </DynamicText>
                          </Stack>
                          <DynamicText>{marker.description}</DynamicText>
                          <Stack
                            direction="row"
                            spacing={3}
                            justifyContent="flex-end">
                            <EditIcon
                              fontSize="small"
                              onClick={() => handleOpenEditMarker(marker)}
                            />
                            {documentUser?.nick === 'Redacteur' && (
                              <DeleteIcon
                                fontSize="small"
                                onClick={() => handleOpenDeleteModal(marker)}
                              />
                            )}
                          </Stack>
                        </>
                      )}
                      {showEdit && canEdit && currentMarker && (
                        <Typography>
                          <Typography>
                            <Stack spacing={1} sx={{pt: 2}}>
                              <>
                                <Stack>
                                  <BoldText variant="subtitle1">Titel</BoldText>
                                  <TextField
                                    id="title"
                                    type="text"
                                    value={currentMarker?.title}
                                    onChange={handleChangeMarker}
                                    placeholder={
                                      currentMarker?.title || 'Titel'
                                    }
                                    size="small"
                                  />
                                </Stack>
                                <Stack>
                                  <BoldText variant="subtitle1">Nick</BoldText>
                                  <TextField
                                    id="nick"
                                    type="text"
                                    value={currentMarker?.nick}
                                    onChange={handleChangeMarker}
                                    placeholder={currentMarker?.nick || 'Nick'}
                                    size="small"
                                  />
                                </Stack>
                                <Stack>
                                  <BoldText variant="subtitle1">Type</BoldText>
                                  <TextField
                                    id="madeBy"
                                    type="text"
                                    value={currentMarker?.madeBy}
                                    onChange={handleChangeMarker}
                                    placeholder={
                                      currentMarker?.madeBy ||
                                      'Type: app eller user'
                                    }
                                    size="small"
                                  />
                                </Stack>
                                <Stack>
                                  <BoldText variant="subtitle1">
                                    Beskrivelse
                                  </BoldText>
                                  <TextField
                                    id="description"
                                    type="text"
                                    value={currentMarker?.description}
                                    multiline
                                    onChange={handleChangeMarker}
                                    placeholder={
                                      currentMarker?.description ||
                                      'Beskrivelse'
                                    }
                                    size="small"
                                  />
                                </Stack>
                              </>
                            </Stack>
                          </Typography>
                          <Stack direction="row" justifyContent="space-between">
                            <Button
                              variant="outlined"
                              onClick={() => setShowEdit(false)}
                              color={'error'}>
                              Fortryd
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={handleSubmitMarker}>
                              Ændr
                            </Button>
                          </Stack>
                        </Typography>
                      )}
                    </div>
                  </Popup>
                  <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                    {marker.nick}
                  </Tooltip>
                </Marker>
              ))}
          </MapContainer>
          {showDeleteModal && (
            <>
              <Dialog
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}>
                <DialogTitle>Er du sikker på du vil slette markør?</DialogTitle>
                <DialogContent>
                  <p>Denne handling kan ikke ændres.</p>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowDeleteModal(false)}>
                    Fortryd
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDeleteMarker}>
                    Slet
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </>
      )}
    </>
  );
};

export default memo(Map);
