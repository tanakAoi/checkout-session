const axios = require("axios")

const servicePoints = async (req, res) => {
  const { city, postalCode, street } = req.body;
  try {
    const response = await axios.get(
      `http://atapi2.postnord.com/rest/businesslocation/v5/servicepoints/nearest/byaddress?apikey=${process.env.POSTNORD_KEY}&returnType=json&countryCode=SE&agreementCountry=SE&city=${city}&postalCode=${postalCode}&streetName=${street.streetName}&streetNumber=${street.streetNumber}&numberOfServicePoints=5&srId=EPSG:4326&context=optionalservicepoint&responseFilter=public`
    );
    res.status(200).json(response.data)
  } catch (error) {
    console.error("Error", error);
  }
};

module.exports = { servicePoints };
