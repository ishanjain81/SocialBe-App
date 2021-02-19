const express = require('express');
const router = express.Router();
const passport = require('../../../config/passport-jwt-strategy');

const postsApi = require("../../../controllers/api/v1/posts_api");

router.get('/',postsApi.index);
router.delete('/:id', passport.authenticate('jwt',{session: false}), postsApi.destroy);

module.exports = router;