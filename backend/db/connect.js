const mongoose = require('mongoose');

// const connectDB = url => {
//   return mongoose.connect(url, {
//     authSource: 'admin',
//     user: 'admin',
//     pass: 'ZJUSRE',
//   });
// };

const connectDB = url => {
  return mongoose.connect(url, {});
};
module.exports = connectDB;
