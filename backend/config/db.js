// confic/db.js

const mongoose = require("mongoose");

const initDBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_URI);
    console.log("connected to DB server");
  } catch (error) {
    console.log(error);
  }
};

module.exports = initDBConnection;
