const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    text:{
        type:String,
        required: true,
        trim:true
    }
},
{
    timestamps:true,
}
)

const Reaction = mongoose.model('Reaction',reactionSchema)

module.exports =Reaction