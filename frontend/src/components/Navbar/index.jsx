import React from 'react'
import styles from "./style.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';
export function NavbarComponent() {
  const dispatch = useDispatch();
  const router = useRouter();
    const authState = useSelector((state)=>state.auth); 
  return (
    <div className={styles.container}>
        <nav className={styles.navBar}>
            <h1 onClick={()=>router.push('/')} style={{cursor:"pointer"}}>pro connect</h1>
        <div className={styles.navBarOptionContainer}>
            {authState.profileFetched && <div>
              <div style={{display:"flex",gap:"1.2rem"}}>
                <p>Hey {authState.user.userId.name}</p>
                <p style={{cursor:"pointer",fontWeight:"bold"}} onClick={()=>router.push("/profile")}>Profile</p>
                <p onClick={()=>{
                  localStorage.removeItem("token")
                  router.push("/login")
                  dispatch(reset())
                }}  style={{cursor:"pointer",fontWeight:"bold"}} >Logout</p>
                
              </div>
              </div>}
              {!authState.profileFetched && 
            <div className={styles.buttonJoin} onClick={()=>{
                router.push("/login")}
                }><p>be a part</p></div>}
        </div> 
        </nav>
    </div>
  )
}   
