//Firebase
import auth from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

//React
import axios from "axios";
import {  useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate,Link } from "react-router-dom";

//Slice
import { SignInDetails } from "../Slice/userSlice";

//Modules
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import Navbar from "../Navbar/Navbar";
import Footer from "../Home/Footer/Footer";

//CSS 
import './Login.css'

//Antd-Framework
import { ConfigProvider,notification } from 'antd'

//Images
import LoginImage from '../Images/Login/LoginImage.jpg'

const Login=()=>
{
    const [formdata,Setformdata]=useState({email:'',password:''})
    const [Ack,SetAck]=useState(false)
    const [Errmsg,SetErr]=useState({email:'',password:''})
    const [PasswordReset,SetPasswordReset]=useState(false)

    const dispatch=useDispatch();
    const Navigate=useNavigate()
    const [api, contextHolder] = notification.useNotification();


    const openNotification = (message) => {
  
            api.warning(
                {
                    message:message,
                    placement:"topRight",
                    duration:2,
                    style: {
                        background:"#EED202	",
                      }

                }
            )
    };

    const ValidateForm=()=>
    {
        if(formdata.email.trim()==="" || formdata.email===null)
        {
            SetErr((prev)=>{return({...prev,email:'Enter your email'})})
            SetAck(true)
        }
        else if(!formdata.email.includes("@gmail.com"))
        {
            SetErr((prev)=>{return({...prev,email:'Enter a valid email'})})
            SetAck(true)
        }
        else
        {
            SetErr((prev)=>{return({...prev,email:''})})
            SetAck(false)
        }

        if(formdata.password.trim()==="" || formdata.password===null)
        {
            SetErr((prev)=>{return({...prev,password:'Enter your password'})})
            SetAck(true)
        }
        else
        {
            SetErr((prev)=>{return({...prev,password:''})})
            SetAck(false)
        }

        if(formdata.email!=="" && formdata.email!=null  && formdata.email.includes('@gmail.com') && formdata.password!=="" && formdata.password!==null)
        {
            LoginInDetails()
        }
    }

    const FetchUserDetails=async(uid)=>
    {
        const {data} = await axios.post("https://drive-easy-customer-server.vercel.app/findUser",{uid});
        dispatch(SignInDetails(data))
        Navigate("/")
    }

    const LoginInDetails=async()=>
    {
        try
        {
            const result=await signInWithEmailAndPassword(auth,formdata.email,formdata.password);
            FetchUserDetails(result.user.uid)
        }catch(error)
        {
            openNotification('Invalid Details')
        }
    }

    const LoginChange=(e)=>
    {
        const {name,value}=e.target;
        Setformdata({...formdata,[name]:value.trim()})
    }

   
    return(
       <>
       <Navbar/>
       {PasswordReset?(<>
       <ForgotPassword SetPasswordReset={SetPasswordReset}/>
       </>):(
         <div className="Login">
         <div className="Login-Form-div">
             <div className="Login-Form">
                 <div className="Login-Form-title-div">
                     <h1 className="Login-Form-title">Login</h1>
                 </div>
                 <div className="Login-Form-Email">
                     <label className="Login-Form-Email-label" htmlFor="">Email Address:</label>
                     <input type="email" name='email' onChange={LoginChange} placeholder="Email Address"  autoComplete="off" required/>
                     {Ack?(<span className="Errormsg">{Errmsg.email}</span>):(<span className="Errormsg">{Errmsg.email}</span>)}
                 </div>
                 <div className="Login-Form-Password">
                     <label className="Login-Form-Password-label" htmlFor="">Password:</label>
                     <input type="password" name='password' onChange={LoginChange} placeholder="Password" autoComplete="off"  aria-required/>
                     {Ack?(<span className="Errormsg">{Errmsg.password}</span>):(<span className="Errormsg">{Errmsg.password}</span>)}
                 </div>
                 <div className="Login-Form-Forgot">
                     <p className="Login-Form-ForgotPassword" onClick={()=>{SetPasswordReset(true)}}>Forgot Password?</p>
                 </div>
                 <div className="Login-Form-Loginbtn">
                     <button className="Login-Form-btn" onClick={ValidateForm}>Login</button>
                     <p className="Login-Form-info">Doesn't have an account yet?<Link className="Login-Form-SignUp" to="/SignUp">SignUp</Link></p>
                 </div>
        </div>
        <div className="Login-img-div">
             <img src={LoginImage} alt="LoginImage" className="Login-img" />
        </div>
        </div>

     </div>
       )}
       <Footer/>
       <ConfigProvider 
            theme={{
                token: {
                    colorText:"white",
                    colorSuccess:"white",
                    colorError:"white"
                },
                components: {Notification: {zIndexPopup:99999	  },}
              }}>
                {contextHolder}
            </ConfigProvider>
       </>
    )
}

export default Login;