const db = require('../db/customer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const env = require('dotenv').config();
const saltRounds = 10;


const createAdminTable = () => {
    sql = `CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    )`

    db.connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating Admin table: ', err);
            return;
        }

        console.log('Admin table created successfully!');
    })
}

const loginValidation = (email, password, res) => {
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    const sql = 'SELECT * FROM admin WHERE email =  ?'

    db.connection.query(sql, [email], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Internal server erorr' })
        }

        if (result.length === 0) {
            return res.status(401).json({ message: 'Email or password is incorrect' })
        }

        const user = result[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ message: 'Internal server erorr' })
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Email or password is incorrect' })
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET)

            return res.status(200).json({ token })
        })
    })
}

const adminRegister = (email, password, res) => {

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err)
                return res.status(500).json({ message: 'Server error' })
            }

            const sql = 'INSERT INTO admin (email, password) VALUES (?, ?)'
            db.connection.query(sql, [email, hash], (err, result) => {
                if (err) {
                    console.error('Error inserting admin:', err);
                    return res.status(500).json({ message: 'Server error' })
                }

                res.json({ message: 'Admin registered successfully' })
            })
        })
    })

}

const validateToken = (token, req, res, next) => {
    if (!token) {
        return res.status(401).json({ message: 'Missing token' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid token' })
    }
}

module.exports = {
    createAdminTable,
    loginValidation,
    adminRegister,
    validateToken
}