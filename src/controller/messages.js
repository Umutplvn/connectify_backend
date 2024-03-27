"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

require("express-async-errors");
const Messages = require("../models/messages");
const Users = require("../models/users");
const Chats = require("../models/chats");

module.exports = {
  createMessage: async (req, res) => {
    const { chatId, text, messageId } = req.body;
    const senderId=req.user
    
    const sender = await Users.findOne({_id:senderId})
    const{_id, email, username, name}=sender
    const replyto= await Messages.findOne({_id:messageId})
    const message = await Messages.create({ chatId, sender:{_id, email, username, name}, text, replyto });
    await Chats.updateOne({_id:chatId}, {show:true}, {runValidators: true})

    try {
      if(messageId){
        const response = await message.save();
        res.status(200).send({
          error: false,
          response,
          replyto
        });
      }else{
        const response = await message.save();
        res.status(200).send({
          error: false,
          response,
        })
      }
    
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  getMessages: async (req, res) => {
    const { chatId } = req.params;
    try {
      const messages = await Messages.find({ chatId:chatId });
      res.status(200).send(messages);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  favMessage: async (req, res) => {
     const {info} = req.body

    try {

      await Users.updateOne({ _id: req.user }, { $push: { favMessages: {info} }});
      const user= await Users.findOne({_id: req.user }) 
      res.status(200).send(user.favMessages);


    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  addReaction: async (req, res) => {
     const {messageId} = req.body
     const {reaction}=req.body
     const val=await Messages.findOne({_id:messageId })

    try {

      await Messages.updateOne({ _id:messageId },  {reaction:reaction}, {
      runValidators: true});

      const upMessage = await Messages.findOne({_id:messageId})
      res.status(200).send(upMessage);

    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  deleteMessage: async (req, res) => {
    const data = await Messages.deleteOne({ _id: req.body.messageId });

    if (data.deletedCount >= 1) {
      res.send({
        message: "Message successfully deleted",
      });
    } else {
      res.send({
        message: "There is no recording to be deleted.",
      });
    }
  },


};
