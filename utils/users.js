const users = [];
const UserModel = require('../models/users');
const messageModel = require('../models/messages');

const moment = require('moment');

function userJoin(id, username, room) {
    
    const user = { id, username, room };
    users.push(user);

    const dbUser = new UserModel({ id, username, room })
    // dbUser.save()
    return user; 
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function getStatus(id) {
    const index = users.length
    let sts;
   if (index === 1 ){
    //    return sts = 'sent'
       return index, sts = '<i class="fas fa-check"></i>'
   } else if (index > 1){
       return sts = '<i class="fas fa-check-double"></i>'
    //    return index
   } else {
       return sts = 'done'
    // return index
   }
}

function getMessage(msg, user, room){
    let message = new messageModel({
        room : room,
        sender: user,
        message: msg,
        status : false,
        time : moment().format('hh:mm a'),
        date : moment().format('DD-MM-YYYY')
    })
    m = message.save();
    // console.log(m)
}

function showMessage(msg){
    msg = messageModel.find()
}

module.exports = {
    userJoin,
    getRoomUsers,
    userLeave,
    getCurrentUser,
    getStatus,
    getMessage,
    showMessage,
}
