const mongoose = require('mongoose');

// password - MkLFuM7BihpNC33M
// username - syadavbhu00016
// mongodb+srv://syadavbhu00016:MkLFuM7BihpNC33M@employeedashboard.cmpfq.mongodb.net/

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://syadavbhu00016:MkLFuM7BihpNC33M@employeedashboard.cmpfq.mongodb.net/', {
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
