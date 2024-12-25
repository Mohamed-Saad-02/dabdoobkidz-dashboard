import { useEffect } from "react";
// import NavAutoComplete from "../Nav/NavAutoComplete";
import ProfileAvatar from "../Nav/ProfileAvatar";
import { getToken, onMessage } from "firebase/messaging";
import { analytics } from "../../firebase";
import { sendTokenToServer } from "../../api/notfications";

export default function Topbar() {
  // useEffect(() => {


  //   onMessage(analytics, (payload) => {
  //     console.log("Message received.", payload);
  //     // ...
  //   });
  //   console.log("notfications init");
    
  //   // Request permission for notifications
  //   const requestPermission = async () => {
  //     try {
  //       const permission = await Notification.requestPermission();
  //       if (permission === "granted") {
  //         console.log("Notification permission granted.");
  //         const token = await getToken(analytics, {
  //           vapidKey:import.meta.env.VITE_VAP_ID ,
  //         });
  //         console.log("FCM Token:", token);
  //         sendTokenToServer(token);  // Optional: Send token to backend
  //       }
  //     } catch (error) {
  //       console.error("Failed to get permission or token:", error);
  //     }
  //   };

  //   requestPermission();
  // }, []);
  return (
    <div className="flex justify-end items-center bg-white px-[18px]  pt-2 h-[70px] w-full">
      {/* <NavAutoComplete /> */}
      <ProfileAvatar />
    </div>
  );
}
