const router = module.exports = require('express').Router();

router.use('/', require('./auth/auth'));
router.use('/user', require('./collections/user'));
router.use('/calendar', require('./collections/calendar'));
router.use('/note', require('./collections/note'));
router.use('/todo', require('./collections/todo'));