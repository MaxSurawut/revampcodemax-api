const express = require('express');
const db = require('./db/customer');
const blogModule = require('./blog/blogSchema')
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*'
}))



db.createCustomersTable();
blogModule.createBlogTable()


app.get('/allcustomer', (req, res) => {
  db.showAllCustomer(res)
})

app.post('/customers', db.upload.single('image'), (req, res) => {
  let image = '';
  const {name, email, phone} = req.body;

  if(req.file){
    image = req.file.filename
  }
  db.insertCustomer(name, email, phone, image, res);
});

app.get('/blog/:id', (req, res) => {
  const id = req.params.id;
  blogModule.loadBlog(id, res);
});

app.get('/allblog', (req, res) => {
  blogModule.showAllBlogContent(res)
})

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
