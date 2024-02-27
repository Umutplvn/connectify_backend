"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

require("express-async-errors");
const Stories = require("../models/stories");
const Users = require("../models/users");
const multer = require('multer');

module.exports = {
  
  createStory: async (req, res) => {
    const userId = req.user;
    const { content } = req.body;

    try {
      const newImage=await Stories.create({userId, content})
      newImage.save()
      const stories= await Stories.find()

      res.status(200).send({message:"Successfully added.", response:stories} )    

    } catch (error) {
        res.status(500).send(error);
    }
},

  deleteStory: async (req, res) => {
    const userId=req.user

    const data = await Stories.deleteOne({ userId: userId });
   
    if (data.deletedCount >= 1) {
      res.send({
        message: "Successfully deleted",
      });
    } else {
      res.send({
        message: "There is no recording to be deleted.",
      });
    }
  },

  getStories: async (req, res) => {
    const userId = req.user;
  
    try {
      const user = await Users.findOne({ _id: userId });
      const contacts = user?.contacts?.map((contact) => contact?._id);
      const stories = await Stories.find({ userId: { $in: contacts } }).populate("userId");
      const myStory=await Stories.findOne({ userId: { $in: userId}})


      res.status(200).send({ response: stories, myStory:myStory });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },


};
