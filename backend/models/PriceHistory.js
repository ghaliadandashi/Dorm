const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
    dorm: { type: mongoose.Schema.Types.ObjectId, ref: 'Dorm', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    pricePerSemester: { type: Number, required: true },
    summerPrice: { type: Number, required: true },
    date: { type: Date, default: Date.now, required: true }
});

const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);
module.exports = PriceHistory;
