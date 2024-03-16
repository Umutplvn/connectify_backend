"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const router = require('express').Router()
const Messages = require('../controller/messages')


router.route('/').post(Messages.createMessage)
router.route('/find/:chatId').get(Messages.getMessages)
router.route('/delete').delete(Messages.deleteMessage)
router.route('/fav').post(Messages.favMessage)
router.route('/reaction').put(Messages.addReaction)


    

module.exports = router