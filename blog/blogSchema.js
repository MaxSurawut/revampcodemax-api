const db = require('../db/customer');



const createBlogTable = () => {
    sql = `CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title varchar(255) NOT NULL,
        body TEXT NOT NULL,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP
    );`

    db.connection.query(sql , (err, result)=> {
        if (err) {
            console.error('Error creating Blogs table: ', err);
            return;
          }
  
          console.log('Blogs table created successfully!');
    })
}

const showAllBlogContent = (res) =>{
    const sql = 'SELECT * FROM Blogs'

    db.connection.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result)
    })
}

const loadBlog = (id, res) => {
    const sql = `SELECT * FROM blogs WHERE id = ?`;

    db.connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
};


module.exports = {
    createBlogTable,
    loadBlog,
    showAllBlogContent
}