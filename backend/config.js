const mongoose = require('mongoose');

// password - M33M
// username - sy16
// mongodb+srv://syadodb.net/

const connectDB = async () => {
  try {
    await mongoose.connect('', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
