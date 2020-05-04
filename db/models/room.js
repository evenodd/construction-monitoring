const mongoose = require('mongoose');
const RoomSchema = require('./roomSchema');
const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;