const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema(
    {
        // set custom id to avoid confusion with parent comment id
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String,
            required: 'Enter a reply!',
            trim: true
        },
        writtenBy: {
            type: String,
            required: 'Who wrote this!?'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const CommentSchema = new Schema(
    {
    writtenBy: {
        type: String,
        required: 'Enter the writer!'
    },
    commentBody: {
        type: String,
        required: 'Enter a comment!'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    replies: [ReplySchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
}
);

// keep track of replies on each comment
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

// create the Comment model using the CommentSchema
const Comment = model('Comment', CommentSchema);


// export the Comment model
module.exports = Comment;