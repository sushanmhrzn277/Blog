const slugify = require("slugify");
const { db } = require("../dbConnection");

/*
@param
{
    "title":"MyFirstApp",
    "description":"This is the first app that i have created using the node js"
    "category":"arts"
}
*/
const addPost = async (req, res) => {
  const { title, description, category } = req.body;
  const uid = req.user.id;
  const image = req.file.filename;
  // console.log(uid,title,description,category,slugify(category));
  const q = "INSERT INTO posts(title,img,description,category,uid,slug) VALUES(?)";
  const values = [title, image, description, category, uid, slugify(category)];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).send("Post has been created");
  });
};
const getPost = async (req, res) => {
  const slug = req.params.slug;
  console.log(slug);
  console.log(req.user.id);
  if (slug) {
    const sql =
      "Select user.username,posts.title,posts.description,posts.img,posts.category from posts INNer join user on posts.uid=user.id and slug=?";
    db.query(sql, [slug], (err, data) => {
      if (err) return res.json(err);
      if (data.length == 0) return res.status(200).send("No Posts about " + slug + " yet");
      return res.status(200).send({
        data,
      });
    });
  }
};
const getPosts = async (req, res) => {
  const uid = req.user.id;
  const sql =
    "Select user.username,posts.title,posts.description,posts.img,posts.category from posts INNer join user on posts.uid=user.id";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    if (data.length == 0) return res.status(200).send("No one has posted any blog yet");
    let mainData = data;
    console.log(mainData.length);

    // let object=Object.assign(mainData);
    // for(i=0;i<mainData.length;i++){
    //     console.log(mainData[i]);
    // }
    return res.status(200).send(mainData);
  });
};
const deletePost = async (req, res) => {
  const id = req.params.id;
  const uid = req.user.id;
  const sql = "DELETE FROM posts where id=? and uid=?";

  db.query(sql, [id, uid], (err, data) => {
    if (err) return res.json(err);

    res.status(200).send("Data successfully deleted");
  });
};

/*
@params 
"title":"This is an updated title",
"description":"The description has been updated",
"category":"Technology"


"title":"",
"description":"",
"category":""
*/
const updatePost = async (req, res) => {
  // res.json("From controller");
  const id = req.params.id;
  uid = req.user.id;
  const { title, description, category } = req.body;
  var result = "";
  console.log(title, description, category);
  if (!title && !description && !category) {
    res.status(404).send("Please enter a value if you want to update");
  }
  if (title) {
    result += "Title";
    const q = "Update posts set title=? where id=? and uid=?";
    db.query(q, [title, id, uid], (err, data) => {
      if (err) return res.json(err);
    });
  }
  if (description) {
    result += " Description";
    const q = "Update posts set description=? where id=? and uid=?";
    db.query(q, [description, id, uid], (err, data) => {
      if (err) return res.json(err);
    });
  }
  if (category) {
    result += " Category";
    const q = "Update posts set category=? , slug=? where id=? and uid=?";
    db.query(q, [category, slugify(category), id, uid], (err, data) => {
      if (err) return res.json(err);
    });
  }
  console.log(result, " are updated");
  return res.status(200).send("Data Updated Successfully");
  // const {}
};
// const deletePost=async(req,res)=>{
//     res.json("Deletepost from controller");
// }
module.exports = {
  addPost,
  deletePost,
  updatePost,
  getPost,
  getPosts,
};
