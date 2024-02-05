import { useState,useEffect } from "react";
import auth from "./config/firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SignInDetails, SignOutDetails } from "./Slice/userSlice";
const Container=({ children })=> {

    const [loading, setLoading] = useState(true);
    const dispatch =useDispatch()

    const FetchUserDetails=async(uid)=>
    {
        try
        {
            const { data } = await axios.post("https://drive-easy-customer-server.vercel.app/findUser", { uid });
            dispatch(SignInDetails(data))
            setLoading(false);

        }
        catch(error)
        {
            console.log(error)
        }
            

    }
    useEffect(() => {
        
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("Logged")
                FetchUserDetails(user.uid)


            }
            else {
                console.log("Logged off")
                setLoading(false);
                dispatch(SignOutDetails())
            }
        })
    }, []);

    if (loading) {
        return (
            <h2>Loading</h2>
            )
    }

    return (
        children
    )

}

export default Container;