/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */


const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Users API",
    version: req.apiVersion || "v1",
    data: [],
  });
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 */

router.get("/:id", (req, res) => {
  res.json({
    success: true,
    message: "User details",
    userId: req.params.id,
    version: req.apiVersion || "v1",
  });
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 */

router.post("/", (req, res) => {
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: req.body,
  });
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */

router.put("/:id", (req, res) => {
  res.json({
    success: true,
    message: "User updated successfully",
    userId: req.params.id,
    data: req.body,
  });
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

router.delete("/:id", (req, res) => {
  res.json({
    success: true,
    message: "User deleted successfully",
    userId: req.params.id,
  });
});

module.exports = router;