import { body, validationResult } from "express-validator";
//Hoisted declaration => a function keyword
//a class
//assignment expression
const validateRequest = async (req, res, next) => {
    //validate data on server side

    //====validation using nodejs=====

    //   const { name, price, imageUrl } = req.body;
    //   let errors = [];

    //   try {
    //     const validUrl = new URL(imageUrl);
    //   } catch (err) {
    //     errors.push('URL is invalid');
    //   }
    //   if (!name || name.trim() == '') {
    //     errors.push('Name is required');
    //   }
    //   if (!price || parseFloat(price) < 1) {
    //     errors.push('Price should be positive');
    //   }
    //if any error found then we are sending that error back to the client
    //   if (errors.length > 0) {
    //     return res.render('new-product', { errorMessage: errors[0] });
    //   }

    //====validation using express=====
    //1. setup the rules for validation
    const rules = [
        body('name').notEmpty().withMessage('Name is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price should be positive value'),
        body('imageUrl').custom((value, { req }) => {
                if (!req.file) {
                    throw new Error("Image is required");
                }
                return true;
            }),
    ];

    //2. run those rules
    await Promise.all(rules.map(rule => rule.run(req)));

    //3. check if there are any errors after running the rules
    var validationErrors = validationResult(req);

    //4. if errors,return the error message
    if (!validationErrors.isEmpty()) {
        return res.render('new-product',
            { errorMessage: validationErrors.array()[0].msg });
    }

    //if there is no error then it will call the next middleware in the pipeline
    next();
}

export default validateRequest;