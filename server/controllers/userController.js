const User = require('../models/userModel'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt');

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

async function checkEmailExist(email) {

    const res = await User.find({email: email});
    return await (res.length > 0 ? true : false);
}

exports.signup = async (req, res, next) => {
    try {
        const {role, name, email, password} = req.body,
            emailAlreadyExist = await checkEmailExist(email);

        if (emailAlreadyExist) {

            res.json({
                success: false,
                message: "Already exists with this email try with other email address"
            })
        }
        else {

            const hashedPassword = await hashPassword(password),
                newUser = new User({email, name, password: hashedPassword, role: role || "basic"}),
                accessToken = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {
                    expiresIn: "1d"
                });
            newUser.accessToken = accessToken;
            await newUser.save();
            res.json({
                success: true,
                data: newUser,
                message: "You have signed up successfully"
            })
        }
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body,
            user = await User.findOne({email});

        if (!user) return next(res.json({success: false, error: 'Email does not exist'}));
        const validPassword = await validatePassword(password, user.password);

        if (!validPassword) return next(res.json({success: false, error: 'Password is not correct'}))
        const accessToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        await User.findByIdAndUpdate(user._id, {accessToken})
        res.status(200).json({
            success: true,
            data: {accessToken},
            message: "Access token get success fully."

        })
    } catch (error) {
        next(error);
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            data: users,
            message: "All user list."
        });
    } catch (error) {
        next(error)
    }

}

exports.updateUser = async (req, res, next) => {
    try {
        const {role, name, userId} = req.body,
            updatedValues = {};

        //update the incomming input not all.
        if (role) {
            updatedValues.role = role;
        }
        if (name) {
            updatedValues.name = name
        }

        const result = await User.findByIdAndUpdate(userId, updatedValues);
        if (result) {

            const user = await User.findById(userId)
            res.status(200).json({
                success: true,
                data: user,
                message: "Successfully updated user."
            });
        }
        else {
            res.json({
                success: false,
                data: {},
                message: "User against this id not found."
            });
        }
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId,
            result = await User.findByIdAndDelete(userId);
        if (result) {
            res.status(200).json({
                success: true,
                data: null,
                message: 'User has been deleted'
            });
        }
        else {
            res.json({
                success: false,
                data: null,
                message: 'User not found on this id to delete.'
            });
        }

    } catch (error) {
        next(error)
    }
}