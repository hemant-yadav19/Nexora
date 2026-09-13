
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createServer } from "@/config";


export const getAllPosts =  createAsyncThunk("posts/getAllPosts", async(_,thunkAPI)=>{
       try{
            const response = await createServer.get("/posts");
               // console.log(response.data);
            return thunkAPI.fulfillWithValue(response.data);
       }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
       } 
})   


export const createPost = createAsyncThunk("post/createPost",
     async(userData,thunkAPI) =>{
          const {file,body}=userData;
     try{
          const formData = new FormData();
          formData.append('token',localStorage.getItem('token'));
          formData.append('body',body); 
          formData.append('file',file);
          const response = await createServer.post("/post",formData,{
               headers:{
                    'Content-Type' :'multipart/form-data'
               }
          });

          if(response.status === 200){
               return thunkAPI.fulfillWithValue("post uploaded");

          }else{
               return thunkAPI.rejectWithValue("post not uploaded");
          }
     } catch(err){
          return thunkAPI.rejectWithValue(err.response.data);
     }
     
     }
)

export const deletePost = createAsyncThunk("post/deletePost" , async({token,post_id},thunkAPI)=>{
     try{
          const response = await createServer.post("/deletePost" ,{
               data:{
               token:token,
             post_id:post_id  
               }
          });
          return thunkAPI.fulfillWithValue(response.data);
     }catch(err){
          return thunkAPI.rejectWithValue(err.response.data);
     }
})   

export const incrementPostLikes = createAsyncThunk("post/incrementPostLikes", async({post_id},thunkAPI)=>{
     try{
          const response = await createServer.post("/increment_post_likes",{
               post_id:post_id
          });

          return thunkAPI.fulfillWithValue(response.data);
          
     }catch(err){
          return thunkAPI.rejectWithValue(response.data.err); 
     }
})


export const getAllComment = createAsyncThunk("comment/getAllComment",
     async (postData,thunkAPI) => {
          try{
               const response = await createServer.get("/get_comments",{
                        params:{
                         post_id:postData.post_id
                    }

               });
               return thunkAPI.fulfillWithValue({
                    comments:response.data,
                    post_id:postData.post_id
               })
          } catch(err){
               return thunkAPI.rejectWithValue(err.response.data);
          }
     }
)

export const postComment = createAsyncThunk("comment/postComment",async (postData,thunkAPI)=>{
          try {
               const response = await createServer.post("/post_comment",{
                    token:localStorage.getItem("token"),
                    post_id:postData.post_id,
                    commentText:postData.body
               })            

               return thunkAPI.fulfillWithValue(response.data);
          } catch (err) {
               return thunkAPI.rejectWithValue(err.response.data);
          }
})