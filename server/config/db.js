import mongoose from "mongoose"


export const connectDb=async()=>{
    try{

        const conn=await mongoose.connect(process.env.MONGO_URI)
        console.log(`server connnected ${conn.connection.host}`);

        

    }
    catch(e){

        console.log("error connecting db ",e);
        process.exit(0)
        

    }
}