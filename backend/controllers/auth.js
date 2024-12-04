const AuthService = require('../services/auth');

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