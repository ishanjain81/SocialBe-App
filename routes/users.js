const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update);


router.get('/sign-up',usersController.signUp);

router.get('/sign-in',usersController.signIn);


router.post('/create',usersController.create);
//router.post('/create-session',usersController.createSession);

//use passport as a middleware to autenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: 'sign-in'},
),usersController.createSession);

router.get('/sign-out',usersController.destroySession);


router.get('/auth/google', passport.authenticate('google',{scope: ['profile','email',]}));
router.get('/auth/google/callback', passport.authenticate('google',{failureRedirect: '/users/sign-in'}),usersController.createSession);

router.get('/resetPassForm',usersController.EnteringEmail);
router.post('/resetPass',usersController.updatePass);
router.get('/resetpass',usersController.PassingResetForm);
router.post('/resetPass/:id',usersController.updatePassword);

module.exports = router;