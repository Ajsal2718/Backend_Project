const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dllyckgxd', 
  api_key: '983767951556158', 
  api_secret: 'PV5h8ORIU7hmQIA2GCqBKWXZ8Vo' 
});

module.exports = cloudinary;