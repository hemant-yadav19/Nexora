import { Router } from "express";
import multer from "multer";
import { activeCheck, allPosts, createPost, deletePost,  getCommentsByThePost, incrementPostLikes, postComments } from "../controllers/posts.controllers.js";
const router = Router();

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb) =>{
        cb(null,file.originalname)
    },

})

const uploads = multer({storage:storage});
router.route("/").get(activeCheck);
router.route("/post").post(uploads.single('file'), createPost);
router.route("/posts").get(allPosts);   
router.route("/deletePost").post(deletePost);
router.route("/increment_post_likes").post(incrementPostLikes);
router.route("/get_comments").get(getCommentsByThePost)
router.route("/post_comment").post(postComments);
export default router;