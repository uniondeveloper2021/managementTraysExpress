const { Schema, model } = require('mongoose');

const technicalSupportSchema = new Schema({
    title: String,
    description: String,
    url_img: String,
    answer: String,
    date: String,
    status: Boolean,
    is_answered: Boolean,
    id_user: {
        ref: "User",
        type: Schema.Types.ObjectId,
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model('TechnicalSupport', technicalSupportSchema);