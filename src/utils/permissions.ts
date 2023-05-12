export const checkLocationPermission = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        if (position.coords.latitude && position.coords.longitude) return true;
      },
      function (error) {
        return false;
      },
    );
  } else {
    return false;
  }
};
