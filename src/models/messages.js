"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const mongoose=require('mongoose')

const MessageSchema= new mongoose.Schema({

    chatId:String,
    senderId:String,
    text:String,
    fav:{
        type:Boolean,
        default:false
    }

    
},{timestamps:true, collection:"messages"})

module.exports = mongoose.model('Messages', MessageSchema)