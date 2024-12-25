import { get, post } from "./axios"

export const sendTokenToServer = async (token: string) => {
    const response = await post("/profile/firebase-token", { 
        firebaseToken: token
     });

     console.log(response, "responsefrom creating token");
     
}

export const getNotfication = async () => {
    const response = await get("/notifications");
    console.log(response, "responsefrom getting notfications");
    
}