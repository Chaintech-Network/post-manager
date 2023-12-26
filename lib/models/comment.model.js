const mongoose = require('mongoose');
// const User = require('../config/db.config')
const User = "user"

const commentSchema = new mongoose.Schema({
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', 
    },
    text: {
        type: String,
        required: true,
        trim: true
    }
},
    {
        timestamps: true,
    }
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment