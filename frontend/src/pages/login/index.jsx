
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./style.module.css";
import UserLayout from '@/layout/userLayout';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage,reset } from '@/config/redux/reducer/authReducer';
export default function LoginConponent() {
  const authState = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [userLoginMethod,setUserLoginMethod] = useState(false);
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashBoard");
    }
  }, [authState.loggedIn, router]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod, dispatch]);
  
  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/dashBoard");
    }
  })
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [name , setName] = useState();
  const [username,setUserName] = useState();
  const handleRegister = ()=>{
    console.log("registering");
    dispatch(registerUser({name,username,email,password}))
  }
  const handleLogin = () => {
    console.log("logging in");
     

    dispatch(loginUser({email, password}));
}

return (
  
    <UserLayout>
          
      <div className={styles.container}>
      <div className={styles.cardContainer}>
        <div className={styles.cardContainer_left}>
            <p className={styles.cardLeft_heading}>{userLoginMethod?"Sign In":"Sign Up"}</p> 
          {authState.isError?<p>{authState.message}</p>:authState.message}
          {/* {authState.message} */}
        <div className={styles.input_container}>
         {!userLoginMethod && <div className={styles.input_row}>
          <input onChange={(e)=>{setName(e.target.value)}} className={styles.input_feild} placeholder='name'/>
          <input onChange={(e)=>{setUserName(e.target.value)}} className={styles.input_feild} placeholder='username'/>
          </div>}
          
          <div className={styles.input_col}>
            
          <input onChange={(e)=>{setEmail(e.target.value)}} className={styles.input_feild} placeholder='email'/>
          <input onChange={(e)=>{setPassword(e.target.value)}} className={styles.input_feild} placeholder='password' />
            </div>
          <div onClick={()=>{
            if(userLoginMethod){
              // router.push("/dashBoard");
              handleLogin();
            }else{
              handleRegister();
            } 
          }}
            >
          <button className={styles.buttonJoin}>{userLoginMethod?"Sign In":"Sign Up"}</button>
          </div>
        </div>
        </div>
        <div className={styles.cardContainer_right}>  
          <div>
            {userLoginMethod?<p>Don't Have An Account</p>:<p>Already have an account</p>}
            <button
                type="button"
                onClick={() =>
                  setUserLoginMethod(!userLoginMethod)
                }
                
                style={{
                  background: "white",
                  color: "black",
                  textAlign: "center",
                }}
                className={styles.buttonJoin}
              >
                {userLoginMethod ? "Sign Up" : "Sign In"}
              </button>
          </div>
          
        </div>
      </div>
    </div>
  </UserLayout>
  )
}


