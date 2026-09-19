import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";

const convertUserDataToProfile = async (userData)=>{
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream(`uploads/${outputPath}`);
    doc.pipe(stream);
    doc.image(`uploads/${userData.userId.profilePicture}`,{align:"center",width:"100"});    
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.userId.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPosition}`);
    doc.fontSize(14).text("Past work");
    userData.pastWork.forEach((work,index) => {
        doc.fontSize(14).text(`Company: ${work.company}`);
        doc.fontSize(14).text(`position: ${work.position}`);
        doc.fontSize(14).text(`Years: ${work.years}`);
});

 doc.end();

return outputPath;


}

export const register = async (req,res) => {
try {    const {name,email,password,username} = req.body;

    if(!name || !email || !password || !username){
        return res.status(400).json({message:"required all the feilds"});
    }

    const user = await User.findOne({
        email
    })
    if(user) return res.status(400).json({message :"user already exists"});

    const hashPassword = await bcrypt.hash(password,10);
    const newUser = new User({
        name,
        username,
        email,
        password:hashPassword
    })
    await newUser.save();
    const profile = new Profile({userId:newUser._id});
    await profile.save();
    return res.json({message:"User created succefully"});
} catch(err){
    return res.json({message:err.message});
}
}

export const login = async (req,res) => {
    // console.log(req.body);
    const {email,password} =  req.body;
    
    if(!email || !password){

        return res.status(400).json({message:"required all feilds"});
    }
    const user = await User.findOne({email});
    if(!user){ return res.status(400).json({message:"user doesnot exists"})};
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){ return res.status(400).json({message:"invalid credentials"})};
    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({_id:user._id},{token});
    return res.json({
        token:token
    });
}   


export const uploadProfilePicture = async (req,res) =>{
    const {token} = req.body;
    // console.log(req.body);
    // console.log(req.file);
    //  const token = req.body?.token;
    //  console.log(token);

    try{
        const user = await User.findOne({token});
        // console.log(user);
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        user.profilePicture=req.file.filename;
        // console.log(user.profilePicture);
        await user.save();

        return res.json({message:"profile picture updated"});


    } catch(err){
        return res.status(404).json({message:err.message});
    }
}


// export const uploadProfilePicture = async (req, res) => {
//     try {
//         const token = req.body?.token;

//         console.log("TOKEN:", token);

//         const user = await User.findOne({ token });

//         console.log("USER:", user);

//         if (!user) {
//             return res.status(404).json({
//                 message: "user not found"
//             });
//         }

//         user.profilePicture = req.file.filename;

//         await user.save();

//         return res.status(200).json({
//             message: "profile picture updated"
//         });

//     } catch (err) {
//         console.error(err);

//         return res.status(500).json({
//             message: err.message
//         });
//     }
// };



export const updateProfile = async (req,res) =>{
    const {token, ...newUserData} = req.body;
    console.log(token);
    try{
        const user = await User.findOne({token:token});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        const {username,email} = newUserData;
        const existingUser = await User.findOne({ $or:[{username},{email}]});
        
            if(existingUser && String(existingUser._id) !== String(user._id)){
                return res.status(400).json({message:"user already exist"});
            }
             Object.assign(user,newUserData);
             await user.save();
             return res.json({message:"user updated"});
        
    }catch(err){
        return res.status(500).json({message:err.message});
    }
   
}


export const getUserProfile = async (req,res) =>{
    
    try{
        // const {token}=req.body;
        const token = req.query.token;
        console.log(token);
        const user = await User.findOne({token:token});
        // console.log(user);
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        const userProfile = await Profile.findOne({userId:user._id}).populate('userId','name email username profilePicture');
        // console.log(userProfile);
        
        return res.status(200).json(userProfile);
    } catch(err){
        return res.json({message:err.message});
    }   
}


export const updateProfileData = async (req,res)=>{
    try{
        const {token, ...newProfileData} = req.body;
        console.log(token);
        const user = await User.findOne({token:token});
        // console.log(user);
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        const profile_to_update = await Profile.findOne({userId:user._id});
        console.log(profile_to_update);
        Object.assign(profile_to_update,newProfileData);
        await profile_to_update.save();
        return res.json({message:"profile updated"});

    }catch(err){
        return res.json({message:err.message});
    }
}

export const getAllUserProfile = async (req,res) =>{
    try{
        const allProfiles = await Profile.find().populate('userId',"name username email profilePicture");
        // console.log(allProfiles);
        res.json({allProfiles});
    } catch(err){
        return res.json({message:err.message});
    }
}


export const downloadProfile = async (req,res) =>{
    const user_id = req.query.user_id;
    // console.log(user_id);
    const userData= await Profile.findOne({userId:user_id}).populate('userId','name username email profilePicture');
    let a = await convertUserDataToProfile(userData);
    // console.log(a);
    return res.json({"message":a});
}

export const sendConnectionRequest = async (req,res) =>{
    const {token ,connectionId} = req.body;
//    console.log(token);
    try{
        const user = await User.findOne({token:token});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        const connectionUser = await User.findOne({_id:connectionId});
        // console.log(connectionUser);
        if(!connectionUser){
            return res.status(404).json({message:"connection user not found"});
        }
     
        const existingRequest = await ConnectionRequest.findOne(
            {
                userId:user._id,
                connectionId:connectionUser._id

            }
        );
        if(existingRequest){
            return res.status(404).json({message:"reqest already sent"});
        }
        const request = new ConnectionRequest({
                userId:user._id,
                connectionId:connectionUser._id

        })
        await request.save();

        return res.json({message:"Request sent"});  
    } catch (err){
        return res.json({message:err.message});
    }
}

export const getMyConnections = async (req,res) =>{
    const {token} = req.query;
    // console.log( "my connection token :", token);
    try{
        const user =  await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"User Not found"});
             }
            //  console.log("user ID: ",user._id);
        const connections =await ConnectionRequest.find({userId:user._id}).populate('connectionId','name username email profilePicture');
        // console.log("my connections :",connections);
        return res.json(connections);
    }catch (err){
        return res.status(500).json({message:err.message});
    }
}
export const MyConnections = async (req,res) =>{
        const {token} = req.query;
        // console.log(token);
    try{
        
        const user = await User.findOne({token:token});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        const connections = await  ConnectionRequest.find({connectionId:user._id}).populate('userId' , 'name username email profilePicture');
        return res.json({connections});
    } catch(err){
        return res.status(500).json({message:err.message});
    } 
} 

export const acceptConnectionRequest = async (req,res) =>{
    const {token,requestId,action_type}=req.body;
    try{    
        const user = await User.findOne({token:token});
        if(!user) {
            return res.status(404).json({message:"user not found"});
        }
        const connection = await ConnectionRequest.findOne({_id:requestId});
        if(!connection){
            return res.status(404).json({message:"connection not found"});
        }

        if(action_type === "accept"){
            connection.status_accepted = true;
        }else{
            connection.status_accepted = false;
        }
        await connection.save();
        return res.json({message:"request accepted"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
} 



export const getUserProfileAndUserBasedOnUsername = async (req,res)=>{
    const {username} = req.query;
    try {
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }   
        const userProfile = await Profile.findOne({userId:user._id}).populate('userId','name username email profilePicture');
        // console.log(userProfile);
        return res.json({profile:userProfile});     
    } catch (err) {
        return res.status(500).json({message:err.message});
    }
}