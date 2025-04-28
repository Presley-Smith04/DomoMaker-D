const mongoose = require('mongoose');
const _ = require('underscore');


const setName = (name) => _.escape(name).trim();


const StatusSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  username: {
    type: String,
    required: true,
  },
  update: {
    type: String,
    required: true,
    trim: true,
  },
  mood: {
    type: String,
    required: true,
    trim: true,
  },
  emoji: {
    type: String,
    required: true,
    trim: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});




StatusSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  mood: doc.mood,
  emoji: doc.emoji,
});

const StatusModel = mongoose.model('Status', StatusSchema);
module.exports = {
  StatusModel,
  StatusSchema,
};
