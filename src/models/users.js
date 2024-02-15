"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const mongoose=require('mongoose')
const passwordEncrypt=require('../helpers/passwordEncrypt')

const UserSchema= new mongoose.Schema({

    email: {
        type: String,
        trim: true,
        unique:true,
        required:true,
    },

    password: {
        type: String,
        trim: true,
        required: true,
        set: (password) => passwordEncrypt(password)
    },

    image:{
        type: String,
        trim: true,
    },

    bio:{
        type: String,
        trim: true,
    },
    
    name: {
        type:String,
        required:true
    },
    status:String,
 

},{timestamps:true, collection:"user"})

module.exports = mongoose.model('User', UserSchema)