const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaveApplicationSchema = new Schema({
    employeeId: {
        type: String, required: true
    },
    employeeName: String,
    department: String,
    fromDate: {
        type: Date, required: true,
    },
    toDate: {
        type: Date, required: true,
    },
    noOfLeave: {
        type: Number, required: true,
    },
    createdAt: {
        type: Date, default: Date.now
    },
    updatedAt: {
        type: Date, default: Date.now
    },

}, {
    collection: 'LeaveApplication',
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

module.exports = mongoose.model('LeaveApplication', LeaveApplicationSchema);

/**
 * Pre-save hook
 */
LeaveApplicationSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next()
});