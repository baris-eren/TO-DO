const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    completed: Boolean,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
