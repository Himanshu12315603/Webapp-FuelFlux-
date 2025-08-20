// utils/getUserLocation.js
export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        error => reject(error),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };
  