const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default:1  
    },
    message: {
        type: String,
        required: true
    },
    image:{
        type:String,
    },
    imagename:{
        type:String
    }
}, {
    timestamps: true,
    versionKey: false
});

// Create an index on the status field
notificationSchema.index({ status: 1 });

// Create a text index on the title field
notificationSchema.index({ title: 'text' });
//compound index
notificationSchema.index({ status: 1, title: 'text' });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
