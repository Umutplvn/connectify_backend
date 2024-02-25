"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const mongoose=require('mongoose')

const NotesSchema= new mongoose.Schema({

   userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
   content:{
       type:String,
       required:true,
},
   expiresAt:{
    type:Date,
    default:()=> new Date(+new Date()+24*60*60*1000) 
   }
    
},{timestamps:true, collection:"notes"})

module.exports = mongoose.model('Notes', NotesSchema)