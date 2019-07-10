const mongoose = require('mongoose');

const gridUnitSchema = new mongoose.Schema({
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

const gridSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    data: [gridUnitSchema]
});

gridSchema.statics.findById = async function (id) {
    let grid = await this.findOne({
        id
    });

    return grid;
}

const Grid = mongoose.model('Grid', gridSchema);

module.exports = Grid;

// fucking szb