
const mongoose = require('mongoose');
module.exports = async function connect(){
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/prm_gamification';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { autoIndex: true });
  console.log('Mongo connected');
};
