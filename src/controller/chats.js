"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

require("express-async-errors");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const Chats = require("../models/chats");

module.exports = {

  createChat:async(req,res)=>{
    const userId=req.user
    const {secondId}=req.params

    try {
        const chat = await Chats.findOne({members:{$all:[userId, secondId]}}) // check if chat is already exist or not
        if(chat) return res.status(200).send(chat) // if chat is exist, return it
        const newChat=await Chats.create({ members:[userId, secondId]}) // if not exist create new one
        const response=await newChat.save() // The save() method uses either the insert or the update command
        res.status(200).json(response)

    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
  },

  findAllChats:async(req, res)=>{
    const userId=req.user
    try {
        const chats=await Chats.find({members:{$in: [userId]}})
        res.status(200).send(chats)

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
  },

  findChat:async(req, res)=>{
    const userId=req.user
    const {secondId}=req.params

    try {
        const chat=await Chats.findOne({members:{$all: [userId, secondId]}})
        res.status(200).send(chat)

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
  },

  deleteChat:async(req, res)=>{

    const data=await Chats.deleteOne({ _id: req.body.chatId})

    if((data.deletedCount >= 1)){

        res.send({
            message:'Chat successfully deleted'
        })
    }else{
        res.send({
            message:"There is no recording to be deleted."
        })
    }
},
}

