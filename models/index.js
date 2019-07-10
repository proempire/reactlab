const mongoose = require('mongoose');

const Grid = require('./grid');
const Road = require('./road');
const GridPrediction = require('./gridPrediction');

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL);
}

const models = { Grid, Road, GridPrediction };

// export { connectDb };

// export default models;

module.exports = {
    connectDb,
    models
}