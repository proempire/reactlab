const mongoose = require('mongoose');

const roadUnitSchema = new mongoose.Schema({
    startId: {
        type: Number
    },
    endId: {
        type: Number
    },
    startLat: {
        type: Number
    },
    startLon: {
        type: Number
    },
    endLat: {
        type: Number
    },
    endLon: {
        type: Number
    },
    roadCount: {
        type: Number
    }
});

const roadSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    data: [roadUnitSchema]
});

roadSchema.statics.findById = async function (id) {
    let road = await this.findOne({
        id
    });

    return road;
}

const Road = mongoose.model('Road', roadSchema);

module.exports = Road;