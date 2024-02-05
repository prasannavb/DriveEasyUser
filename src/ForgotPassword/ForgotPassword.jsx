//React 
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

//CSS
import './ForgotPassword.css'

//Firebase
import auth from '../config/firebase'
import { sendPasswordResetEmail } from 'firebase/auth';

//Antd-Framework
import {  notification,ConfigProvider } from 'antd';

const ForgotPassword=(props)=>
{
    const {SetPasswordReset}=props
    const [Email,SetEmail]=useState('')
    const [Ack,SetAck]=useState(false)
    const [Errmsg,SetErrmsg]=useState('')
    const [api, contextHolder] = notification.useNotification();

    const openNotification = () => {
      api.success({
        message: `Email sent`,
        duration:2,
        style: {
            background:"#5cb85c	",
          }
      });
    };

    const PasswordResetLink=async()=>
    {
        await sendPasswordResetEmail(auth,Email,{url:'http://localhost:5173/Login'}).then(()=>{
            openNotification()
            setTimeout(() => {
                SetPasswordReset(false)
            }, 2000);
        })
        .catch((err)=>{console.log(err)})
    
    }

    const ValidateForm=()=>
    {

        if(Email==="")
        {
            SetErrmsg("Enter your email address")
            SetAck(true)
        }
        else if(!Email.includes("@gmail.com"))
        {
            SetErrmsg("Enter a valid email")
            SetAck(true)
        }
        else
        {
            SetAck(false)
            PasswordResetLink()
        }
    }

    const EmailChange=(e)=>
    {
        const {name,value}=e.target
        SetEmail(value.trim())
    }

    return(
        <div className='ForgotPassword-layout'>
        <ConfigProvider
            theme={{ components: {Notification: {zIndexPopup:99999	  },}, token: {
            colorText:"white",
            colorSuccess:"white",
            colorError:"white"
        },}}>          
            {contextHolder}
        </ConfigProvider>

            <div className="ForgotPassword">
                <h1 className='ForgotPassword-title'>Forgot your password</h1>
                <p className='ForgotPassword-info'>Enter the email address you'd like our password reset information sent to </p>
                <div className='ForgotPassword-Form'>
                    <b>Email Address</b>
                    <input type="email" name="email" onChange={EmailChange} placeholder="Email Address" autoComplete='off' required />
                    {Ack?(<span>{Errmsg}</span>):(<span></span>)}
                </div>
                <div className='ForgotPassword-btns'>
                    <button onClick={ValidateForm}>Request a reset Link</button>
                    <Link className='ForgotPassword-Linkbtn' to="/Login" onClick={()=>{SetPasswordReset(false)}} >Back To Login</Link>
                </div>
            </div>
        </div>
    )
}
export default ForgotPassword;