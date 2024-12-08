const bcrypt = require('bcrypt');
const UserModel = require('../models/User');
const JWT = require('jsonwebtoken');

// Hash the user's password and create a new user
module.exports.createUser = async (userInfo) => {
    try{
        let hashedPassword = await bcrypt.hash(userInfo.password, 12);

        const newUser = new UserModel({
            username: userInfo.username,
            password: hashedPassword,
            name: userInfo.name
        });

        await newUser.save();
    } catch(error){
        console.log(error)
    }
};

// Check if a user already exists by their username
module.exports.doesUserExist = async (username) => {
    const existingUser = await UserModel.findOne({ username: username });
    
    if(existingUser){
        return true;
    } else{
        return false;
    }
};

// Verify the user's credentials by comparing the password
module.exports.checkCredentials = async (username, password) => {
    try{
        const user = await UserModel.findOne({ username: username });

        let isCorrectPassword = await bcrypt.compare(password, user.password);

        if(isCorrectPassword){
            return user;
        } else{
            return null;
        }
    } catch(error){
        throw new Error('Error logging in, please try again later.');
    }
};

// Generate a JWT for the authenticated user
module.exports.generateJWT = (user) => {
    const jwtPayload = {
        userId: user._id,
        username: user.username
    };

    const jwtSecret = process.env.JWT_SECRET;

    try{
        let token = JWT.sign(jwtPayload, jwtSecret, { expiresIn: '1d' });
        return token;
    } catch(error){
        throw new Error('Failure to sign in, please try again later.');
    }
};

// Decrypt the JWT to retrieve user information
module.exports.decryptJWT = async (token) => {
    const jwtSecret = process.env.JWT_SECRET;

    try {
        const decoded = JWT.verify(token, jwtSecret);

        const user = await UserModel.findById(decoded.userId).select('-password');
        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};