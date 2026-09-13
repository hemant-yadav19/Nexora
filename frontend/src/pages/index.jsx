import { useRouter } from "next/router"
import styles from "@/styles/Home.module.css";
import UserLayout from "@/layout/userLayout";

export default function Home() {
  const router = useRouter();
  return (
    <>
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
              <p>Connect with Freinds without Exagreation</p>
              <p>A True Social media platform, with stories no blufs</p>
              <div className={styles.buttonJoin}>
                <button  onClick={()=>{
                router.push("./login");
              }}>join now</button>
              </div>
          </div>
          <div className={styles.mainContainer_right}>
              <img src="/images/image2.jpg" alt="" style={{height:"25rem", width:"25rem"}}/>     
          </div>
        </div>  
      </div>
    </UserLayout>
    </>

  )
   
  
}
