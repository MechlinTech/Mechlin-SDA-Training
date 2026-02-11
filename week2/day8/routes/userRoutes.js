const express= require("express");
const router = express.Router();

const { getUsers } = require("../controllers/userControllers");

const User = require("../models/userModel");

router.get('/' , getUsers);

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

module.exports=router;