const mongoose = require('mongoose');


const mediaSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['img', 'pdf', 'video', 'gif', 'emoji', 'other'],
    },
    url: {
      type: String,
    },
  });


const communitySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    title: {
        type: String,
        trim: true
    },
    is_owner: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    media: [mediaSchema], // Array of media objects
    // img: [String],
    slug: String,
    commentCount: { type: Number, default: 0 },
    reactionCount: { type: Number, default: 0 }
},
    {
        timestamps: true,
    }
)

const Community = mongoose.model('Community', communitySchema)

module.exports = Community