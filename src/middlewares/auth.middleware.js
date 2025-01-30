export const auth = (req,res,next) => {
    //if it is true that means user is logged in then we call next middleware in the pipeline
    if(req.session.userEmail){
      next();
    }else{
        res.redirect('/login');
    }
}