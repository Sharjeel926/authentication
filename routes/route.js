const express = require("express");
const exp_valid = require("../utils/exp_validator");
const app = express();
const verifyToken = require("../utils/authentication");
const router = express.Router();
const mongoose = require("mongoose");

const specialCharacterRegex = /[!@#$%^&*]/;
const route = require("../controllers/controller");
const { login } = require("../controllers/controller");
/*/
router.get("/route", route.route);
router.post("/login", route.login);
router.get("/profile", route.profile);
router.post("/registration", exp_valid(), route.registration);
/*/

/**
 * @swagger
 * /api/auth/route:
 *   get:
 *     summary: Get route information
 *     description: Retrieve information about the route.
 *     responses:
 *       200:
 *         description: Route information retrieved successfully
 */
router.get("/route", route.route);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login User
 *     description: Authenticate and log in a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 token:
 *                   type: string
 *                   description: JSON Web Token (JWT) for authentication.
 *       401:
 *         description: Authentication failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating authentication failure.
 *       500:
 *         description: An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating an internal server error.
 */
router.post("/login", route.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the user's profile information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *         description: JWT token for authentication
 *         example: Bearer YOUR_JWT_TOKEN_HERE
 *     responses:
 *       200:
 *         description: Profile information retrieved successfully
 *       403:
 *         description: Invalid token
 *       404:
 *         description: User not found
 */

router.get("/profile", verifyToken, route.profile);

/**
 * @swagger
 * /api/auth/registration:
 *   post:
 *     summary: User registration
 *     description: Register a new user.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: An error occurred while processing the request
 */
router.get("/getRecipient", route.getRecipient);
router.post("/chatStart", route.chatStart);
router.post("/sendMessage", route.sendMessage);
router.post("/registration", exp_valid(), route.registration);
/**
 * @swagger
 * /api/auth/verifyOtp:
 *   post:
 *     summary: OTP Verification
 *     description: Verify user OTP
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       201:
 *         description: OTP is verified
 *       400:
 *         description: OTP is not verified
 */
router.post("/verifyOtp", route.verifyOtp);

module.exports = router;
