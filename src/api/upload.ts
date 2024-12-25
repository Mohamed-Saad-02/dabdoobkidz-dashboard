import axios from "axios";

export const uploadFile = async (formData: File | null ,token: string , fileName?:string) => {
  try {
    // const response = await axios.post(
    //   "https://api.dabdoobkidz.com/files/single",
    //   formData,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       Authorization: `Bearer ${token}`
    //     },
    //   }
    // );
    console.log("Image uploaded successfully:", fileName);
    const s3Response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/files/presigned-url`,
      {
        fileName: fileName,
        bucket: "Content",
        mime: "image/jpeg",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const srUrl = s3Response?.data?.data?.uploadUrl
    const upload = await fetch(srUrl, {
      method: "PUT",
      body: formData,
      headers : {
       
      }
    });
    

    console.log("Got presigned url:", s3Response?.data?.data);
    return s3Response?.data?.data?.fileUrl
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
