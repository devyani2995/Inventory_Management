import path from 'path';
import ProductModel from '../models/product.model.js';

export default class ProductController {
  //render product page
  //this method is serving response of HTML to client side
  getProducts(req, res, next) {
    let products = ProductModel.getAll();
    res.render("products", { products,userEmail:req.session.userEmail});
    //"path.resolve()" will give the root directory
    // return res.sendFile(path.join(path.resolve(),'src','views','products.html'));
  }

  //to render new-product page
  getAddForm(req, res, next) {
    return res.render('new-product', { errorMessage: null,userEmail:req.session.userEmail });
  }

  //to add new product in 'products array' and will render product page
  addNewProduct(req, res, next) {
    //access data from form
    // console.log(req.body);
    const {name,desc,price} = req.body;
    const imageUrl = 'images/'+req.file.filename;
    //passing data into model
    ProductModel.add(name,desc,price,imageUrl);
    //retreive the updated products again
    let products = ProductModel.getAll();
    return res.render("products", { products ,userEmail:req.session.userEmail});
  }

  getUpdateProductView(req, res, next) {
    //1.if product exists then return view
    const id  =req.params.id;
    const productFound = ProductModel.getById(id);
    if (productFound) {
      res.render('update-product', { product: productFound, errorMessage: null,userEmail:req.session.userEmail });
    } else {
      //2.else return error
      res.status(401).send('Product not found');
    }
  }

  postUpdateProduct(req,res){
    ProductModel.update(req.body);
    let products = ProductModel.getAll();
    return res.render("products", { products });
  }

  deleteProduct(req,res){
    const id  = req.params.id;
    const productFound = ProductModel.getById(id);
    if (!productFound) {
      return res.status(401).send('Product not found');
    }

    ProductModel.delete(id);
    var products = ProductModel.getAll();
    res.render("products", { products });
  }
}