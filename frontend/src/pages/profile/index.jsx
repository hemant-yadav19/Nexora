import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./index.module.css";
import { BASE_URL, createServer } from '@/config';
import { getAllPosts } from '@/config/redux/action/postAction';
import { current } from '@reduxjs/toolkit';
import { resetPostId } from '@/config/redux/reducer/postReducer';

export default function profilePage() {
    const dispatch = useDispatch();
    const authState = useSelector((state)=>state.auth);
    const postState = useSelector((state) => state.posts);        

    const [userProfile,setUserProfile] = useState({}); 
    const [userPosts,setUserPosts] = useState([]);
    const [isModalOpen,setIsModalOpen]=useState(false);
    const [inputChange , setInputChange] = useState({company:"" , position:" ",years:" "})

    // console.log(userPosts);
    useEffect(()=>{
        dispatch(getAboutUser({token:localStorage.getItem("token")}));
        dispatch(getAllPosts());
    },[]);

    useEffect(()=>{
        if(authState.user !== undefined){
        setUserProfile(authState.user);
                    
        let post = postState.posts.filter((post)=>{
                return post.userId.username === authState.user.userId.username;
            })
    
            setUserPosts(post);
}
    },[authState.user,postState.posts]);    


    const udpateProfilePicture = async (file) =>{
        const formdata = new FormData();
        formdata.append("profile_picture",file);
        formdata.append("token",localStorage.getItem("token"));

        const response = await createServer.post("/update_profile_picture",formdata,{
            headers:{
                'Content-Type':'multipart/form-data'
            },
        })
        dispatch(getAboutUser({token:localStorage.getItem("token")}));
    }

    const udpateUserProfile = async ()=>{
        const response = await createServer.post("/user_update",{
            token:localStorage.getItem("token"),
            name:userProfile.userId.name
        })
        const request = await createServer.post("/update_profile_data",{
            token:localStorage.getItem("token"),
            name:userProfile.name,
            bio:userProfile.bio,
            currentPost:userProfile.currentPost,
            pastWork:userProfile.pastWork,
            education:userProfile.education
        })
        dispatch(getAboutUser({token:localStorage.getItem("token")}))
    }

    const handleInputChange = (e)=>{
        const {name,value} = e.target;
        setInputChange({...inputChange,[name]:value});
    }

    // console.log(userProfile);
    // console.log(authState.user);

    return (
    <UserLayout>
        <DashBoardLayout>
                {authState.user && userProfile.userId && <div className={styles.container}>
                    <div className={styles.backDropContainer}>
                         <img className={styles.backDrop}  src={`${BASE_URL}/${userProfile.userId.profilePicture}`}/>
                        <label htmlFor='profilePicture' className ={styles.backDrop_overlay}>
                       
                        <p>Edit</p>
                        </label>
                        <input hidden onChange={(e)=>{udpateProfilePicture(e.target.files[0])}} id='profilePicture' type='file'/>
                        
                    </div>
                <div className={styles.profileContainer__details}>
                   
                     <div style={{display:"flex",gap:"0.7rem"}}>
                            <div style={{flex:"0.8"}}>
                               <div style={{display:"flex", width:"fit-content",alignItems:"center",gap:"0.6rem", marginTop:"4rem",marginLeft:"4.5rem"}}>
                                <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e)=>{
                                    setUserProfile({...userProfile,userId:{...userProfile.userId,name:e.target.value}})
                                }}/>
                                <p style={{color:"grey"}}>{userProfile.userId.username}</p>
                               </div>
                                
                                <div>
                                    <textarea 
                                        value={userProfile.bio}
                                        onChange={(e)=>setUserProfile({...userProfile,bio:e.target.value})}
                                        rows={Math.max(3,Math.ceil(userProfile.bio.length/80))}
                                        style={{width:"100%"}}
                                        > 
                                        
                                    </textarea>
                                </div>


                            </div>
                            
                            
                            <div style={{flex:"0.2"}}>
                                <h3>Recent Posts</h3>
                                {userPosts.map((post)=>{
                                    return(
                                        <div key={post._id} className={styles.postCard}>
                                            <div className={styles.card}>
                                                <div className={styles.card_profileContainer}>
                                                    {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`}/>:<div style={{width:"3.4rem",height:"3.4rem"}}><h2>Not posted yet</h2></div>}
                                                </div>
                                                    <p>{post.body}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                    </div>
                   
                </div>   
                        <div className={styles.swork}>
                            <h2>Work History</h2>
                            <div className={styles.workHistoryContainer}>
                                
                                {
                                    userProfile.pastWork.map((work,index)=>{
                                        return(
                                            <div key={index}  className={styles.workHistoryCard}>
                                                <p style={{fontWeight:"bold",display:"flex", alignItems:"center",gap:"0.8rem"}}>{work.company}-{work.position}</p>
                                                <p>{work.years}</p>
                                            </div>
                                        )
                                    })
                                }

                                <button className = {styles.addWorkButton} onClick={()=>setIsModalOpen(true)}>Add Work</button>
                            </div>
                        </div>
 
                    {userProfile != authState.user && <div onClick={()=>udpateUserProfile()} className={styles.connectionButton}>
                        updateProfile
                    </div>
                    }                                
                </div>
}
                





                {
           isModalOpen &&
           
           <div onClick={()=>{
             setIsModalOpen(false);
           }} className={styles.commentsContainer}>
            
            <div onClick={(e)=>{e.stopPropagation()}} className={styles.allCommentContainer}>
                <input name='company' onChange={handleInputChange} className={styles.input_feild} type="text" placeholder='Enter Company ' />
                <input name='position' onChange={handleInputChange} className={styles.input_feild} type="text" placeholder='Enter Position ' />
                <input name='years' onChange={handleInputChange} className={styles.input_feild} type="number" placeholder='Enter Years of experience ' />
                <div onClick={()=>{
                    setUserProfile({...userProfile,pastWork:[...userProfile.pastWork,inputChange]})
                    setIsModalOpen(false);      
                }} className={styles.connectionButton}>Add Work</div>
            </div>   
             
              
           </div>
           }
        </DashBoardLayout>
    </UserLayout>
  )
}
