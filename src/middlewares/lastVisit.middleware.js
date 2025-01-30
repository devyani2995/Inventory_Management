export const setLastVisit = (req,res,next) => {
    //1.if cookie is set,then add a local variable with last visit time data on response which can be used on views
    if(req.cookies.lastVisit){
        res.locals.lastVisit = new Date(req.cookies.lastVisit).toLocaleString();
    }
    //2.else set cookie on response object or update the last visit
    res.cookie('lastVisit',new Date().toISOString(),{
        maxAge: 2*24*60*60*1000 //2 days
    });
    next();
}