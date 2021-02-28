const { Schema, model } = require('mongoose');

const reviewSchema = new Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Review = model('Review', reviewSchema);

module.exports = Review;
