const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(403).json({
                success: false,
                message: "token not found"
            })
        }

        try {
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodeToken;
            // will help in other verification
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Please login again to continue",
            })
        }
        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "error while validating the user",
            error: err.message
        })
    }
}

exports.isHOD = (req, res, next) => {
    try {
        if (req.user.accountType !== "HOD") {
            return res.status(403).json({
                success: false,
                message: "you are not authorized to access this route"
            })
        }
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "user role is not matching",
            error: err.message
        })
    }
}

exports.isRegistrar = (req, res, next) => {
    try {
        if (req.user.accountType !== "Registrar") {
            return res.status(403).json({
                success: false,
                message: "you are not authorized to access this route"
            })
        }
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "user role is not matching",
            error: err.message
        })
    }
}

exports.isDirector = (req, res, next) => {
    try {
        if (req.user.accountType !== "Director") {
            return res.status(403).json({
                success: false,
                message: "you are not authorized to access this route"
            })
        }
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "user role is not matching",
            error: err.message
        })
    }
}

exports.isAssistantProfessor = (req, res, next) => {
    try {
        if (req.user.accountType !== "Assistant Professor") {
            return res.status(403).json({
                success: false,
                message: "you are not authorized to access this route"
            })
        }
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "user role is not matching",
            error: err.message
        })
    }
}

exports.isOther = (req, res, next) => {
    try {
        if (req.user.accountType !== "Other") {
            return res.status(403).json({
                success: false,
                message: "you are not authorized to access this route"
            })
        }
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "user role is not matching",
            error: err.message
        })
    }
}