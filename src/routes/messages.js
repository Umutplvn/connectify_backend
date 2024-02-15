"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const router = require('express').Router()
const Messages = require('../controller/messages')


router.route('/').post(Messages.createMessage)
router.route('/:chatId').get(Messages.getMessages)
router.route('/delete').delete(Messages.deleteMessage)
router.route('/fav').post(Messages.favMessage)


    

module.exports = router