const { check } = require("express-validator");

exports.signupValidation=[
    check('username',"Name is required").not().isEmpty(),
    check('email',"Please enter a valid mail").isEmail().normalizeEmail({ gmail_remove_dots:true}),
    check('password',"Please enter password or Password length must be minimum 6").isLength({min:6}),
    check('address',"Address is required").not().isEmpty(),
],

exports.loginValidation=[
    check('email',"Please enter a valid mail").isEmail().normalizeEmail({ gmail_remove_dots:true}),
    check('password',"Please enter password").not().isEmpty(),
]
    
