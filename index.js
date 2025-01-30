import express from 'express';
import path from 'path';
import session from 'express-session';
import ejsLayouts from 'express-ejs-layouts';
import ProductController from './src/controllers/product.controller.js';
import UserController from './src/controllers/user.controller.js';
import validateRequest from './src/middlewares/validation.middleware.js';
import { uploadFile } from './src/middlewares/file-upload.middleware.js';
import { auth } from './src/middlewares/auth.middleware.js';
import cookieParser from 'cookie-parser';
import {setLastVisit} from './src/middlewares/lastVisit.middleware.js';

//create server
const server = express();

//to directly access JS in views
server.use(express.static('public'));

//to specify we are using cookie parser to parse our cookie
server.use(cookieParser());

// server.use(setLastVisit);

//configure the session
server.use(session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, //here cookie secure is false because we are usingn http protocol not https
}));

//parse form data so that after submitting form data we get that data on server side
server.use(express.urlencoded({ extended: true }));

//setup view engine
server.set("view engine", "ejs");

//specify the folder or directory of views 
//here path.resolve() will give the name of current directory(the directory from where app is executing i.e index.js)
//here we use path.join() bcz if use "path.resolve()/src/views",it may work on mac but not on window 
server.set("views", path.join(path.resolve(), 'src', 'views'));

//wrap ejs layouts into server
server.use(ejsLayouts);

//create an instance of the class
const productController = new ProductController();
const userController = new UserController();

//get request
server.get('/register', userController.getRegister)
server.get('/login', userController.getLogin)
server.get('/',setLastVisit,auth,productController.getProducts);
server.get('/add-product',auth,productController.getAddForm);
server.get('/update-product/:id',auth,productController.getUpdateProductView);
server.get('/logout',userController.logout);


//post requests
server.post('/register', userController.postRegister);
server.post('/login', userController.postLogin);
//here it will first validate the form field before adding new product
server.post(
    '/',
    auth,
    uploadFile.single('imageUrl'),
    validateRequest,
    productController.addNewProduct
);
server.post('/update-product',auth,productController.postUpdateProduct);
server.post('/delete-product/:id',auth,productController.deleteProduct);

server.use(express.static('src/views'));

//listen port
server.listen(3700, () => {
    console.log("Server is listening on 3700");
});