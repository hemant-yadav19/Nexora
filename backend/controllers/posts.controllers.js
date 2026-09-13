import Post from "../models/posts.models.js";
import User from "../models/user.model.js";
import Comment from "../models/comments.model.js";
export const activeCheck = async (req,res) =>{
    return res.status(200).json({message:"RUNNING"});
}

export const createPost = async (req,res) =>{
    const token = req.body.token;
    try{
        const user =await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        const post = new Post({
            userId:user._id,
            body:req.body.body,
            media:req.file != undefined ? req.file.filename:"",
            fileType:req.file != undefined?req.file.mimetype.split("/")[1]:""  
        })
        await post.save();
        return res.status(200).json({message:"post created"});
    } catch(err){
        return res.status(500).json({message:err.message});
    }
}


export  const allPosts = async (req,res) => {
    // const token=req.body;
    try{
        const posts = await Post.find({}).populate('userId' , 'name username email profilePicture');
        // console.log(posts);
        return res.json({posts});       
    } catch(err){
        return res.status(500).json({message:err.message});
    }
}


export const deletePost = async(req,res)=>{
    const {token,post_id} = req.body.data;

        // console.log(token);
    try{
        const user =await User.findOne({token}).select("_id");
        // console.log(user);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const post = await Post.findOne({_id:post_id});
        
        // console.log("POST:", post);
// console.log("POST USER ID:", post?.userId);
// console.log("USER:", user);
// console.log("USER ID:", user?._id);
        
        if(!post){
            return res.status(404).json({message:"post not found"});
        }
        if(post.userId.toString() !== user._id.toString()){
            return res.status(404).json({message:"unauthorized"});
        }

        const result = await Post.deleteOne({_id:post_id});
        //   console.log("DELETE RESULT:", result);
        return res.json({message:"post deleted"});

    } catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const incrementPostLikes = async (req,res)=>{
    const post_id=req.body.post_id;
    // console.log(post_id);
        try{
        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"post not found"});
        }
        // console.log(post);

  
            post.likes += 1;
        
        
        await post.save();
        return res.json({message:"likes incremented succesfully"}); 

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}


// export const getCommentsByThePost = async (req,res) => {
//         const {post_id} = req.query;    
//     try {

//             const post = await Post.findOne({_id:post_id});
//             if(!post){
//                 return res.status(404).json({message:"post not found"});
//             } 

//             return res.json({comments:post.comments});
//         } catch (err) {
//                 return res.status(500).json({message:err.message});
//         }
// }

export const getCommentsByThePost = async (req, res) => {
    const { post_id } = req.query;

    try {
        const post = await Post.findById(post_id);

        if (!post) {
            return res.status(404).json({
                message: "post not found"
            });
        }

        const comment = await Comment.find({postId:post_id}).populate("userId","name username profilePicture")
        console.log(comment);
        return res.json(
            comment.reverse()
        );

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export const postComments = async (req,res) => {
    const {token,post_id,commentText} = req.body;

    try {
        const user = await User.findOne({token:token}).select("_id");
        if(!user){
            return res.status(404).json("user not found");
        }
        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"post not found"});
        }
        const comment = new Comment({ 
            userId:user._id,
            postId:post_id,
            body:commentText
        })

        await comment.save();
        return res.json({message:"comment saved"});

    } catch (err) {
        return res.status(500).json({message:err.message});
    }
}