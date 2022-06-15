const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HolidaySchema = new Schema({
    holidayDate: {
        type: Date, required: true
    },
    reason: String,

    createdAt: {
        type: Date, default: Date.now
    },
    updatedAt: {
        type: Date, default: Date.now
    },

}, {
    collection: 'Holiday',
    restrict: true,
    minimize: false,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    usePushEach: true
});

/**
 * Pre-save hook
 */
HolidaySchema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next()
});

module.exports = mongoose.model('Holiday', HolidaySchema);