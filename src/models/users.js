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

    username: {
        type: String,
        trim: true,
        unique:true,
        required:true,
        index:true
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
    verified:{
        type:Boolean,
        default:false
    },

    contacts:[{type:Object}],
    
    favMessages:[{type:Object}]


},{timestamps:true, collection:"user"})

module.exports = mongoose.model('User', UserSchema)