import { createServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user,thunkAPI) =>{
        try{

                const response = await createServer.post('/login',{
                email:user.email,
                password:user.password
            }); 

            if(response.data.token){
                
                localStorage.setItem("token",response.data.token) 
            } else{
                return thunkAPI.rejectWithValue({
                    message:"token not provide"
                })
            }
            return thunkAPI.fulfillWithValue(response.data.token);
        } catch(err){
                return thunkAPI.rejectWithValue(err.response.data);
        }
    }

)

export const registerUser = createAsyncThunk(
    "user/register",
    async (user,thunkAPI) =>{
        try{
            const response = await createServer.post('/register',{
                name:user.name,
                username:user.username,
                email:user.email,
                password:user.password,
                
            })
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }    
) 


export const getAboutUser = createAsyncThunk("user/getAboutUser", async (user,thunkAPI)=>{
    try{
        const response = await createServer.get("/get_user_and_profile" ,{
           params:{
             token:user.token
           }
        })
        // console.log(response.data);
        return thunkAPI.fulfillWithValue(response.data);

    }catch(err){
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const getAllUsers = createAsyncThunk("user/getAllUsers", async(_,thunkAPI)=>{
    try{
        const response = await createServer.get("/user/get_all_users");
        // console.log(response.data);    
        return thunkAPI.fulfillWithValue(response.data);    
    } catch(err){
        return thunkAPI.rejectWithValue(err.response.data);
    }
}
)

export const sendConnectionRequest = createAsyncThunk("user/sendConnectionRequest",
    async (user,thunkAPI) => {
        try {
            const response = await createServer.post("/user/send_connection_request",{
                token:user.token,
                connectionId:user.connectionId   
            })
                thunkAPI.dispatch(getConnectionRquest({token:user.token}))
            return thunkAPI.fulfillWithValue(response.data); 
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    })
export const getConnectionRquest = createAsyncThunk("user/getConnectioneRequest", async (user,thunkAPI) => {
    try {
            const response = await createServer.get("/user/getConnectionRequest" , {
               params:{
                token:user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }    
})

export const getMyConnections = createAsyncThunk("user/getMyConnections",async (user,thunkAPI) => {
    try {
        const response = await createServer.get("/user/user_connection_request",{
           params:{
                token:user.token
           } 
        })
        return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const acceptConnectionRequest = createAsyncThunk("user/acceptConnectonRequest" , async (user,thunkAPI) => {
    try {
        const response = await createServer.post("/user/accept_connection_request",{
            token:user.token,
            requestId:user.connectionId,
            action_type:user.action
        })
        thunkAPI.dispatch(getConnectionRquest({token:user.token}));
        thunkAPI.dispatch(getMyConnections({token:user.token}));
        return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})