"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const mongoose=require('mongoose')

const MessageSchema= new mongoose.Schema({

    chatId:String,
    sender:Object,
    text:String,
    fav:{
        type:Boolean,
        default:false
    },
    reaction:String,
    replyto:Object

    
},{timestamps:true, collection:"messages"})

module.exports = mongoose.model('Messages', MessageSchema)