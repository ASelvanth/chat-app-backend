const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId :{
        type : Schema.Types.ObjectId,
        ref : 'Users',
        // Users - usersModel collection name
        required : true
    },
    token :{
        type : String,
        required : true
    },
    createAt :{
        type : Date,
        default : Date.now,
        expires : 3600 
        //3600 - expires in 1 hour
    }
});

module.exports = mongoose.model('Tokens', tokenSchema)