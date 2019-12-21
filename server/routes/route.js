const express = require('express'),
    router = express.Router(),
    userController = require('../controllers/userController'),
    authMiddleWare = require('../middlewares/auth'),
    validationMiddleWare = require("../middlewares/validation"),
    validationSchemas = require("../schemas-validation/schemas");


router.post('/signup', validationMiddleWare(validationSchemas.schemas.signUp, 'body'), userController.signup);

router.post('/login', validationMiddleWare(validationSchemas.schemas.signIn, 'body'), userController.login);

router.get('/users', authMiddleWare.allowIfLoggedin, authMiddleWare.grantAccess('readAny', 'user'), userController.getUsers);

router.put('/user', authMiddleWare.allowIfLoggedin, authMiddleWare.grantAccess('updateAny', 'user'), validationMiddleWare(validationSchemas.schemas.updateUser, 'body'), userController.updateUser);

router.delete('/user/:userId', authMiddleWare.allowIfLoggedin, authMiddleWare.grantAccess('deleteAny', 'user'), validationMiddleWare(validationSchemas.schemas.userId, 'params'), userController.deleteUser);

module.exports = router;