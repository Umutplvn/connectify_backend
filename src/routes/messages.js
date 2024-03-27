"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const router = require('express').Router()
const Messages = require('../controller/messages')


router.route('/').post(Messages.createMessage)
router.route('/find/:chatId').get(Messages.getMessages)
router.route('/delete/:messageId').delete(Messages.deleteMessage)
router.route('/fav').put(Messages.favMessage)
router.route('/reaction').put(Messages.addReaction)


    

module.exports = router