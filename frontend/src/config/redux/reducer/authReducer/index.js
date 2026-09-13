import { getAboutUser, getAllUsers, getConnectionRquest, getMyConnections, loginUser, registerUser } from "../../action/authAction";

const { createSlice } = require("@reduxjs/toolkit");
const { connection } = require("next/server");

const initialState = {
    user:undefined,
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    isTokenThere:false,
    message:"",
    profileFetched:false,
    connections:[],
    connectionRequest:[],
    all_users:[],
    all_Profiles_Fetched:false,
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:()=>initialState,
        handleLoginUser:(state)=>{
            state.message="hello"
        },
        emptyMessage:(state)=>{
             state.message=""
        },
        setIsTokenThere:(state)=>{
            state.isTokenThere=true;
        },
        
        setIsTokenNotThere:(state)=>{
            state.isTokenThere=false;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(loginUser.pending,(state)=>{
            state.isLoading=true
            state.message = "loading"
            
        })
        .addCase(loginUser.fulfilled ,(state) =>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;  
            state.loggedIn=true;
            state.message="login is successfull";
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message = action.payload.message;


        }).addCase(registerUser.pending,(state)=>{
            state.isLoading=true
            state.message = "registering you...:)"
            // console.log(action);            
        }).addCase(registerUser.fulfilled,(state)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;  
            state.loggedIn=true;
            state.message="registered successfully";
            
        }).addCase(registerUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message = action.payload.message;

        }).addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.profileFetched=true;
            state.user=action.payload;
            // state.connections=action.payload.connection;
            // state.connectionRequest=action.payload;
            // console.log("connection requests : ",state.connectionRequest);
        }).addCase(getAllUsers.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.all_Profiles_Fetched=true;
            state.all_users=action.payload.allProfiles;
        }).addCase(getConnectionRquest.fulfilled,(state,action)=>{
            state.connections=action.payload;
            // console.log("this is connections : ",state.connections);
        }).addCase(getConnectionRquest.rejected,(state,action)=>{
            state.message=action.payload;
        }).addCase(getMyConnections.fulfilled,(state,action)=>{
            state.connectionRequest=action.payload;
            // console.log("connectionsreqst : ",state.connectionRequest.name);
        }).addCase(getMyConnections.rejected,(state,action)=>{
            state.message=action.payload;
        })
    }   
    
})
export const {reset,emptyMessage,setIsTokenNotThere,setIsTokenThere} = authSlice.actions;
export default authSlice.reducer;