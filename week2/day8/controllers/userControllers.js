const userService = require("../services/userService");

exports.getUsers = (req, res) => {
    console.log("✅ Controller: getUsers called");
    const users = userService.fetchUsers();
    res.status(200).json({ users });
};

