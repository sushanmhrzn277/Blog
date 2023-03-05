const express=require('express');
const app= express();
const port=3000;
const cors=require('cors');
const authRoutes=require('./routes/auth');
const postRoutes=require('./routes/post');
const usersRoutes=require('./routes/users');
const bodyParser=require('body-parser');
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/api/post',postRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/users',usersRoutes);

app.listen(port,()=>{
    console.log("Server running on http://localhost:"+port);
})