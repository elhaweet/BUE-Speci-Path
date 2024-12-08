// controllers/auth.js

const AuthService = require('../services/auth');

// Creates a new user after checking if the username already exists
module.exports.postUser = async(req, res) => {
    try{
        const userInfo = {
            username: req.body.username,
            password: req.body.password,
            name: req.body.name
        };

        const userExists = await AuthService.doesUserExist(userInfo.username);

        if(userExists){
            return res.status(422).send({ error: 'A user with the same username already exists.' });
        } else{
            await AuthService.createUser(userInfo);
            res.status(201).json({ message: "User created successfully" });
        }

    } catch(error){
        res.status(500).send({ error: error.message });
    }
};

// Logs in the user by checking credentials and generating a JWT
module.exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    try{
        const user = await AuthService.checkCredentials(username, password);

        if(!user){
            return res.status(401).send({ error: 'Invalid credentials, please enter the correct username and password.' });
        }

        const jwt = await AuthService.generateJWT(user);
        res.send({
            jwt: jwt,
            message: 'Login successful!'
        });
    } catch(error){
        res.status(500).send({ "Error": 'Error occured while logging in.' });
    }
};

// Retrieves the user associated with the provided JWT token
module.exports.getUserFromToken = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(400).send({ error: 'Token is required' });
    }

    try {
        const user = await AuthService.decryptJWT(token);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
};

// Updates user information after validating the JWT token and allowed updates
module.exports.updateUserInfo = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(400).send({ error: 'Token is required' });
    }

    try {
        const user = await AuthService.decryptJWT(token);

        const allowedUpdates = ['name', 'password'];
        const updates = Object.keys(req.body);

        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates' });
        }

        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        if (req.body.password) {
            const bcrypt = require('bcrypt');
            user.password = await bcrypt.hash(req.body.password, 12);
        }

        await user.save();

        const updatedUser = {
            username: user.username,
            name: user.name,
            _id: user._id,
        };

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).send({ error: 'Failed to update user information' });
    }
};