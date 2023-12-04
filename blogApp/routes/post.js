const router=require('express').Router();
const {addPost,deletePost,getPosts,updatePost,getPost}=require('./../controller/post');
const {verifyToken}=require('../common/authentication')
const multer= require('multer');
const path=require('path');

const storage =multer.diskStorage({
    destination:'./img/',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload=multer({
    storage:storage
})

router.post('/add',upload.single('image'),verifyToken,addPost);
router.get('/get/:slug',verifyToken,getPost);
router.get('/getAll/',verifyToken,getPosts);
router.put('/update/:id',verifyToken,updatePost);
router.delete('/delete/:id',verifyToken,deletePost);

// router.get('/delete',deletePost);

module.exports=router;