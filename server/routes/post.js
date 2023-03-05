const router=require('express').Router();
const {addPost,deletePost,getPosts,updatePost,getPost}=require('./../controller/post');
const {verifyToken}=require('../common/authentication')

router.post('/add',verifyToken,addPost);
router.get('/get/:slug',verifyToken,getPost);
router.get('/getAll/',verifyToken,getPosts);
router.put('/update/:id',verifyToken,updatePost);
router.delete('/delete/:id',verifyToken,deletePost);

// router.get('/delete',deletePost);

module.exports=router;