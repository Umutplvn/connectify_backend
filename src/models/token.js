"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const mongoose = require('mongoose')

const tokenSchema= new mongoose.Schema({
   
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    token:{
        type:String,
        trim:true,
        required:true
    }

},{collection:'token', timestamps:true})

module.exports= mongoose.model('Token', tokenSchema)