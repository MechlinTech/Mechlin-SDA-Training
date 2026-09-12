const express = require("express");

const router = express.Router();

module.exports = (userService) => {

  router.get("/", async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  });


  router.post("/", async (req, res, next) => {
    try {
      const user = await userService.createUser(req.body);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  });


  router.get("/:id", async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  });

  
  router.put("/:id", async (req, res, next) => {
    try {
      const user = await userService.updateUser(
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const result = await userService.deleteUser(req.params.id);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};