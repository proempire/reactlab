const mongoose = require('mongoose');

const gridPredictionUnitSchema = new mongoose.Schema({
    x: {
        type: Number
    },
    y: {
        type: Number
    },
    count: {
        type: Number
    }
});

const gridPredictionSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    data: [gridPredictionUnitSchema]
});

gridPredictionSchema.statics.findById = async function (id) {
    let gridPrediction = await this.findOne({
        id
    });

    return gridPrediction;
}

const GridPrediction = mongoose.model('GridPrediction', gridPredictionSchema);

module.exports = GridPrediction;