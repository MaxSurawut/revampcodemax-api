const db = require('../db/customer');

const addPortFolio = (title, link, category, image, res) => {
    sql = 'INSERT into portfolio (title, link, category, thumbnail) VALUE (?, ?, ?, ?)'

    db.connection.query(sql, [title, link, category, image], (err, result) => {
        if (err) throw err;
        res.json({Status: "Success"});
    })
}

const getAllPortfolio = (res) => {
    sql = 'SELECT * FROM portfolio'

    db.connection.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result)
    })
}

module.exports = {
    addPortFolio,
    getAllPortfolio
}