const request = require("request");

const reverseGeocode = ({ latitude, longitude }, callback) => {
  const url = `http://api.positionstack.com/v1/reverse?access_key=ed5c3eb6717d752dabf7708eb9e5f728&query=${latitude},${longitude}&limit=1`;
  request({ url, json: true }, async (error, { body: { data } }) => {
    if (error) {
      callback(`Unable to connect to location services.`);
    } else {
      callback(undefined, data[0].label);
    }
  });
};

module.exports = reverseGeocode;
