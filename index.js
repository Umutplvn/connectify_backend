"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const express=require('express')
const app=express()
require('dotenv').config()
const PORT=process.env.PORT
const HOST=process.env.HOST
const cron=require('node-cron')
const notes = require('./src/models/notes')
const stories = require('./src/models/stories')
/*--------------------------------------*/

app.use(express.json())
app.use(require('cors')())

/*--------------------------------------*/
//! Connect to MongoDB with Mongoose:
require('./src/configs/dbConnection')
app.use(require('./src/middlewares/authorization'))
/*--------------------------------------*/
//! Searching&Sorting&Pagination:
app.use(require('./src/middlewares/findSearchSortPage'))

/*--------------------------------------*/
//! Home Page

app.all('/', (req, res)=>{
    res.send({
        err:false,
        message:'Welcome to Chat APP',
    })
})

/*--------------------------------------*/
cron.schedule('* * * * *', async() => {
    try {
        await notes.deleteMany({expiresAt:{$lte:new Date()}})
        await stories.deleteMany({expiresAt:{$lte:new Date()}})
    } catch (error) {
        console.log(error);
    }
})


/*--------------------------------------*/
//! Routes:

app.use('/auth', require('./src/routes/users'))
app.use('/auth', require('./src/routes/auth'))
app.use('/chats', require('./src/routes/chats'))
app.use('/message', require('./src/routes/messages'))
app.use('/app', require('./src/routes/notes'))
app.use('/app', require('./src/routes/stories'))


/*--------------------------------------*/

//! errorHandler:
app.use(require('./src/errorHandler'))


/*--------------------------------------*/
app.listen(PORT, ()=>console.log(`App is running: ${HOST}:${PORT} `))