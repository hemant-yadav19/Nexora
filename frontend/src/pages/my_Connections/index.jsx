import { BASE_URL } from '@/config';
import { acceptConnectionRequest, getMyConnections } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./index.module.css";
import { useRouter } from 'next/router';
export default function MyConnectionPage() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const router = useRouter();
    useEffect(()=>{

        dispatch(getMyConnections({token:localStorage.getItem("token")}));
    },[])
    
    useEffect(()=>{
      if(authState.connectionRequest.length !== 0){
        console.log(authState.connectionRequest)
      }
    },[authState.connectionRequest])
//     console.log(authState.connectionRequest);
// console.log(Array.isArray(authState.connectionRequest));
  return (
    <UserLayout>
        <DashBoardLayout>
            <div className={styles.cantainer}>
                <h1>
                    MyConnections
                </h1>
                {authState.connectionRequest.length === 0 && <h2>No Connections Requests Yet</h2>}
             
                  {authState.connectionRequest.length !== 0 && authState.connectionRequest.filter((connection)=> connection.status_accepted === null).map((user) => {
                   return(
                      <div onClick={()=>router.push(`/view_profile/${user.userId.username}`)}key={user._id}  className={styles.userCard}>
                        <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
                          <div className = {styles.userCard_image}>
                          <img src={`${BASE_URL}/${user.userId.profilePicture}`}/>
                          </div>
                          <div className={styles.userInfo}>
                            <p>{user.userId.name}</p>
                            <p>{user.userId.username}</p>
                          </div>
                        <button onClick={(e)=>{e.stopPropagation();
                          dispatch(acceptConnectionRequest({
                            token:localStorage.getItem("token"),
                            connectionId:user._id,
                            action:"accept"  
                          }))
                        } } className={styles.connectBtn}>Accept</button>
                        </div>
                        
                      </div>             
                   )
                })
                }
              
             

                <h2 style={{gap:"2rem"}}>My Network</h2>
               
                 {authState.connectionRequest.length !== 0 && authState.connectionRequest.filter((connection)=> connection.status_accepted !== null).map((user) => {
                   return(
                      <div onClick={()=>router.push(`/view_profile/${user.userId.username}`)}key={user._id}  className={styles.userCard}>
                        <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
                          <div className = {styles.userCard_image}>
                          <img src={`${BASE_URL}/${user.userId.profilePicture}`}/>
                          </div>
                          <div className={styles.userInfo}>
                            <p>{user.userId.name}</p>
                            <p>{user.userId.username}</p>
                          </div>
                        {/* <button onClick={(e)=>{e.stopPropagation();
                          dispatch(acceptConnectionRequest({
                            token:localStorage.getItem("token"),
                            connectionId:user._id,
                            action:"accept"  
                          }))
                        } } className={styles.connectBtn}>Accept</button> */}
                        </div>
                        
                      </div>             
                   )
                })
                }
               
            </div>
        </DashBoardLayout>
    </UserLayout>

  )
}
