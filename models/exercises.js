'use strict'

//Create new mongoose Schema representing Exercise Data
//will include: description,duration, date, username,userId



const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Exercises = new Schema({
    description:{
        type:String,
        required:true,
        maxlength:[25, 'Exercise description too long']
    },
    duration:{
        type:Number,
        required:true,
        min:[1,'Exercise duration is too short']
    },
    date:{
        type:Date,
        default:Date.now()
    },
    username : {type:String},
    userId:{
        type:String,
         ref:'Users',
        required:true


    }
})

Exercises.pre('save', function(next){
    let idtemp = this.userId;
    mongoose.model('Users').findById(idtemp, (err,user)=>{
    if (err) return err;
    //no user error
    if(!user){
        console.log(this.description);
        const err = new Error('unknown userId')
        err.status = 400
        return next(err);}
    //if user exists, save user
    this.username = user.username;
    //if no date, set default date
    if(!this.date){
        this.date = Date.now()
    }
    next();

    })
})

module.exports = mongoose.model('Exercise', Exercises)