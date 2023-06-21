const express = require('express');
const db = require('./db/customer');
const blogModule = require('./blog/blogSchema')
const adminModule = require('./admin/adminSchema')
const cors = require('cors')

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors({
  origin: '*'
}))



db.createCustomersTable();
blogModule.createBlogTable()
adminModule.createAdminTable();


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

app.post('/addblog', db.upload.single('image'), (req, res) => {
  let image = ''
  const {title, category, text} = req.body;

  if(req.file){
    image = req.file.filename
  }

  blogModule.insertBlog(title, category, text, image, res)
})

app.post('/login', (req, res)=> {
  const { email, password } = req.body;

  adminModule.loginValidation(email, password, res)
  
})

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  adminModule.adminRegister(email, password, res)
})

app.post('/validate-token', (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  console.log(token)
  adminModule.validateToken(token,req, res, next)
})

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
