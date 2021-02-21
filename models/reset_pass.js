const mongoose = require('mongoose');

const resetPassSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token:{
        type: String,
    },
    isvalid:{
        type: Boolean
    }
},{
    timestamps: true
});


const Reset_Pass = mongoose.model('Reset_Pass',resetPassSchema);

module.exports = Reset_Pass;