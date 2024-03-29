const router = require('express').Router();
const User = require('../Models/User');
const joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcrypt');

//REGISTER CODE LOGIC
router.post('/register', async (req, res) => {

    //Validation using @hapi/joi
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //Checking if email already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
        return res.status(400).send('Email Already Exist');
    }

    //Hashing a Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //Creating a new User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

//LOGIN CODE LOGIC
router.post('/login', async (req, res) => {

    //Validation using @hapi/joi
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //Checking if email exist in Data Base 
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Email or Password Incorrect');
    }

    //Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if (!validPass) {
        return res.status(400).send('Password Incorrect');
    }

    //Creating and assigning a token
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
});

module.exports = router;