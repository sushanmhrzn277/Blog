const router=require('express').Router();
const authController=require('../controller/auth')
const {signupValidation,loginValidation}=require('../common/validation');

router.post('/register',signupValidation,authController.register);
router.post('/login',loginValidation,authController.login);
router.post('/verifyOtp',authController.verifyOtp);
// router.post('/signup',register);

module.exports=router;