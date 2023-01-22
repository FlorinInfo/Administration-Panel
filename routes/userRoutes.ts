import { Request, Response, NextFunction } from "express";
const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");


router.route("/")
    .get(userController.getAllUsers)
    .post()
    .patch()
    .delete()

module.exports = router;