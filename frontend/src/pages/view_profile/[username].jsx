import { BASE_URL, createServer } from '@/config';
import DashBoardLayout from '@/layout/DashBoardLayout';
import UserLayout from '@/layout/userLayout';
// import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { useRouter } from 'next/router';
import { getConnectionRquest, getMyConnections, sendConnectionRequest } from '@/config/redux/action/authAction';












export default function ViewProfilePage({userProfile}) {
    // const searchParams = useSearchParams();
    // useEffect(()=>{});
    const router = useRouter();
    console.log(userProfile.pastWork);    
    const dispatch = useDispatch();
    const authState = useSelector((state)=>state.auth);
    const postState = useSelector((state) => state.posts);



    const [userPosts , setUserPosts] = useState([]);
    const [isCurrentUserInConnection , setIsCurrentUserInConnection] = useState(false);
    const [isConnectionNull , setIsConnectionNull] = useState(true);
    
    const getUserPost = async()=>{
        await dispatch(getAllPosts());
        await dispatch(getConnectionRquest({token:localStorage.getItem("token")}));
        await dispatch(getMyConnections({token:localStorage.getItem("token")}));
    }

    useEffect(()=>{
        let post = postState.posts.filter((post)=>{
            return post.userId.username === router.query.username
        })

        setUserPosts(post);
    },[postState.posts])

    // useEffect(()=>{
    //     console.log(authState.connections,userProfile.userId._id);
         
    //     if(authState.connections.some(user => user.connectionId._id === userProfile.userId._id)){
    //         setIsCurrentUserInConnection(true);
          
    // if(authState.connections.find(user=>user.user._id === userProfile.userId._id).status_accepted === true){
    //     setIsConnectionNull(false);
    // }
    // }
    // },[authState.connections])

  useEffect(() => {
    if (!Array.isArray(authState.connections)) return;
    if (!userProfile?.userId?._id) return;

    const connection = authState.connections.find(
        user => user.connectionId?._id === userProfile.userId._id
    );

    if (connection) {
        setIsCurrentUserInConnection(true);

        if (connection.status_accepted === true) {
            setIsConnectionNull(false);
        }
    }
}, [authState.connections, userProfile]);

    useEffect(()=>{ 
        getUserPost();
    },[])
    return (
        <UserLayout>
            <DashBoardLayout>
                <div className={styles.container}>
                    <div className={styles.backDropContainer}>
                        <img className ={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`}/>
                        
                    </div>
                <div className={styles.profileContainer__details}>
                   
                     <div className={styles.profileContainer_flex}>
                            <div style={{flex:"0.8"}}>
                               <div style={{display:"flex", width:"fit-content",alignItems:"center",gap:"0.6rem", marginTop:"4rem",marginLeft:"4.5rem"}}>
                                <h2>{userProfile.userId.name}</h2>
                                <p style={{color:"grey"}}>{userProfile.userId.username}</p>
                               </div>
                                <div style={{display:"flex",alignItems:"center" , gap:"1rem"}}>
                                    
                                {isCurrentUserInConnection?
                                <button className={styles.connectedButton}>{isConnectionNull?"pending...":"Connected"}</button>:
                                <button onClick={()=>{
                                    dispatch(sendConnectionRequest({token:localStorage.getItem("token"),connectionId:userProfile.userId._id}))
                                }} className={styles.connectBtn}>Connect</button>
                                }
                               

                                <div onClick={async ()=>{
                                    const response = await createServer.get(`user/download_resume/?user_id=${userProfile.userId._id}`);
                                    window.open(`${BASE_URL}/${response.data.message}`,"_blank")  
                                }} style={{cursor:"pointer"}}>
                                    <svg style={{width:"1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>

                                </div>
                                 </div>
                                <div>
                                    <p>{userProfile.bio}</p>
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
                            </div>
                        </div>
                </div>

            </DashBoardLayout>
        </UserLayout>
        
  )
}

export async function getServerSideProps(context){
    // console.log(context.query.username);
    const request = await createServer.get("/user/get_user_based_on_username",{
        params:{
            username:context.query.username
        }
    })
    
    const response =  request.data;
    return {props:{userProfile:request.data.profile}}
}   