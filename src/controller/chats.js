"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

require("express-async-errors");
const Chats = require("../models/chats");
const Users = require("../models/users");

module.exports = {

    createChat: async (req, res) => {
        const userId = req.user.toString()
        const { secondId } = req.params
        try {
            const user = await Users.findOne({ _id: secondId }) // await kullanarak kullanıcıyı bulun
            const{name, image, _id}=user
            const chat = await Chats.findOne({ members: { $all: [userId, secondId] } })
    
            if (chat) {
                return res.status(200).send({
                    result: chat
                }) 
            }
            const newChat = await Chats.create({ members: [userId, secondId], user: {name, image, _id} }) // Yeni sohbeti oluşturun ve 'second' alanını 'user' olarak ayarlayın
            const response = await newChat.save() 
    
            res.status(200).json({
                result: response,         
            })
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    },
    
  findAllChats:async(req, res)=>{
    const userId=req.user.toString()

    try {
        const response=await Chats.find({members:{$in: [userId]}})
        res.status(200).send({      
           result:response
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
  },

  findChat:async(req, res)=>{
    const userId=req.user
    const {secondId}=req.params
    try {
        const chat=await Chats.findOne({members:{$in: [userId, secondId]}})
        res.status(200).send({
            result:{
                chat:chat,
               
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
  },

  deleteChat:async(req, res)=>{

    const {chatId}=req.params
    const data=await Chats.deleteOne({ _id: chatId})

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

