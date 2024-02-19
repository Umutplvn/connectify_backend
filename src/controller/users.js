"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

require("express-async-errors");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const User = require("../models/users");
const Token = require("../models/token");
const sendVerificationEmail=require('./emailVerification')

module.exports = {
  list: async (req, res) => {
    const data = await req.getModelList(User);

    res.status(200).send({
      error: false,
      count: data.length,
      result: data,
    });
  },


  create: async (req, res) => {
    let passcode = Math.floor(Math.random() * 10000) + 2000;
    const { email, password, name, username } = req.body;
    const upName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const user = await User.findOne({ username });
    if (user) {
        res.status(400).send({ error: true, message: "Username has already been taken." });
        return;
    }

    const newUser = await User.create({ email, username, password, name });
    const tokenData = "Token " + passwordEncrypt(newUser._id + `${new Date()}`);
    await Token.create({ userId: newUser._id, token: tokenData });
    sendVerificationEmail(email, passcode, upName);
    
    res.status(201).send({
        error: false,
        result: newUser,
        Token: tokenData, 
        passcode
    });
},


  read: async (req, res) => {
    const data = await User.findOne({ _id: req.params.userId });

    res.status(200).send({
      error: false,
      result: data,
    });
  },

  filterUser: async (req, res) => {
    const {username} = req.body;
    const regex = new RegExp(username, 'i')
    const data = await User.find({ username: { $regex: username, $options: 'i' } });

    res.status(200).send({
      error: false,
      result: data,
    });
  },

  update: async (req, res) => {
    const data = await User.updateOne({ _id: req.params.userId }, req.body, {runValidators: true,
    });
    const tokenData=await Token.findOne({userId:req.params.userId })
    res.status(202).send({
      error: false,
      Token:tokenData.token,
      body: req.body,
      result: await User.findOne({ _id: req.params.userId }),
    });
  },


  delete: async (req, res) => {
    const data = await User.deleteOne({ _id: req.params.userId });
    await Token.deleteOne({userId:req.params.userId})
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


  updatePassword:async(req, res)=>{

    const password=req.body.password
    
    await User.updateOne({_id:req.user}, {password:password}, {
      runValidators: true,
    })
    const newData= await User.findOne({_id:req.user})

    res.status(202).send({
      error:false,
      message:"Password has changed successfully.",
      result:newData
    })
  }
};
