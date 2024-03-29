"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const mongoose=require('mongoose')

const ChatSchema= new mongoose.Schema({

    members:Array,
    show:{
        type:Boolean,
        default:false
    },
    user:{type:Object}
        
},{timestamps:true, collection:"chats"})

module.exports = mongoose.model('Chats', ChatSchema)