const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const auth = require('../middleware/auth');

router.post('/register', async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await userService.authenticateUser(email, password);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

router.get('/me', auth, async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.userId);
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
