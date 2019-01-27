'use strict'
//Create mongoose Schema for each user
const mongoose = require('mongoose');
const shortId = require('shortid');
const Schema = mongoose.Schema;

var Users = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,


        maxlength:[20, 'username too long']
    },
    _id:{
        type:String,
        default:shortId.generate

    }
});

module.exports = mongoose.model('Users', Users);
