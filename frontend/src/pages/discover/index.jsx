import { getAllUsers } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect } from 'react'
import styles from "./index.module.css";
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function Discover() {
    const authState = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const router = useRouter();


    useEffect(()=>{
        if(!authState.all_Profiles_Fetched){
            dispatch(getAllUsers());
        }
    },[])
    return (
    <UserLayout>
        <DashBoardLayout>
            <div className={styles.allProfilesContainer}>
                {authState.all_Profiles_Fetched && authState.all_users.map((user)=>{
                    return(
                        <div onClick={()=>router.push(`view_profile/${user.userId.username}`)} key={user._id} className={styles.allProfiles}>
                            <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt='profile'/>
                            <div className={styles.profileInfo}>
                                <h3>{user.userId.name}</h3> 
                                <p>{user.userId.username}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </DashBoardLayout>
    </UserLayout>
    
  )
}
