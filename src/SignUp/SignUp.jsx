//React
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//CSS
import './SignUp.css'

//Modules

import Navbar from '../Navbar/Navbar';
import Footer from '../Home/Footer/Footer';

//Antd-Framework
import { ConfigProvider,notification } from 'antd'

//Images
import SignUpImage from '../Images/SignUp/SignUpImage.jpg'


const SignUp=()=>
{
    const [formdata,Setformdata]=useState({uid:'',name:'',email:'',password:'',confirmpassword:'',phone:'',location:''})
    const [Ack,SetAck]=useState(false)
    const [Errmsg,SetErr]=useState({email:'',password:'',confirmpassword:'',name:'',phone:'',location:''})

    const navigate=useNavigate();
    const [api, contextHolder] = notification.useNotification();


    const openNotification = (message) => {
    {
        message.includes('registered')?(
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
        ):(
            api.success({
            message:message,
            placement:"topRight",
            duration:2,
            style: {
                background:"#5cb85c	",
            }
            })
        )
    }
};

    const ValidateForm=()=>
    {
        if(formdata.email.trim()==="" || formdata.email===null)
        {
            SetErr((prev)=>{return({...prev,email:'Enter your email'})})
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
        else if(formdata.password.length<6)
        {
            SetErr((prev)=>{return({...prev,password:'Password must contain minimum of 6 length'})})
        }
        else
        {
            SetErr((prev)=>{return({...prev,password:''})})
            SetAck(false)
        }

        
        if(formdata.confirmpassword==="")
        {
            SetErr((prev)=>{return({...prev,confirmpassword:'Enter your password'})})
            SetAck(true)
        }
        else if(formdata.password.trim()!==formdata.confirmpassword)
        {
            SetErr((prev)=>{return({...prev,confirmpassword:'Password do not match'})})
            SetAck(true)
        }
        else
        {
            SetErr((prev)=>{return({...prev,confirmpassword:''})})
            SetAck(false)
        }

        if(formdata.name.trim()==="" || formdata.name==null)
        {
            SetErr((prev)=>{return({...prev,name:"Enter your name"})})
            SetAck(true)
        }
        else
        {
            SetErr((prev)=>{return({...prev,name:''})})
            SetAck(false)
        }

        if(formdata.phone.trim()==="" || formdata.phone==null)
        {
            SetErr((prev)=>{return({...prev,phone:"Enter your phone number"})})
            SetAck(true)
        }
        else if(formdata.phone.length!=10)
        {
            SetErr((prev)=>{return({...prev,phone:"Enter valid phone number"})})
            SetAck(true)
        }
        else
        {
            SetErr((prev)=>{return({...prev,phone:""})})
            SetAck(false)
        }

        if(formdata.location.trim()==='' || formdata.location===null)
        {
            SetErr((prev)=>{return({...prev,location:"Enter your location"})})
            SetAck(true)
        }
        else
        {
            SetErr((prev)=>{return({...prev,location:""})})
            SetAck(false)
        }
        if(formdata.email!=="" && formdata.email!=null && formdata.password.length>=6 && formdata.password===formdata.confirmpassword &&  formdata.password!=="" && formdata.password!==null && formdata.name!="" && formdata.name!=null && formdata.phone!="" && formdata.phone!=null && formdata.phone.length===10 && formdata.location!="" && formdata.location!=null)
        {
            CreateUser();
        }
    }

    const ValidateEmail=async()=>
    {
        
    const options = {
        method: 'GET',
        url: 'https://validect-email-verification-v1.p.rapidapi.com/v1/verify',
        params: {
        email: formdata.email
        },
        headers: {
          'X-RapidAPI-Key': 'a6b66c6001mshc9f834a0d761aa6p129809jsn62d25ecea44b',
          'X-RapidAPI-Host': 'validect-email-verification-v1.p.rapidapi.com'
        }
     };
  
     try {
        const response = await axios.request(options);
        console.log("Email",response.data)
        if(response.data.status==="valid")
        {
            return true
        }
        else
        {
            return false
        }
      } catch (error) {
      console.error(error);
    }
    }

    const ValidatePhone=async()=>
    {
        var myHeaders = new Headers();
        myHeaders.append("apikey", "Hrn0yTcd3cuz8FklzCqMJ9mMCnF5wuQC");

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        fetch("https://api.apilayer.com/number_verification/validate?number=+91"+formdata.phone, requestOptions)
        .then(response => response.json())
        .then((result)=>{return result.valid})
        .catch(error => console.log('error', error)); 
    }


    const CreateUser=async()=>
    {
       try
       {
            if(formdata.email!='' && formdata.password!='' && formdata.name!='' && formdata.phone!='' && formdata.location!='')
            {
                const {data}=await axios.post("https://drive-easy-customer-server.vercel.app/CreateUser",formdata);
                if(data.action)
                {
                    
                    navigate("/Login")
                }
                else
                {
                  openNotification(data.status)
                }
            }

        }catch(error)
        {
            alert(error);
        }

    }

    const SignUpChange=(e)=>
    {
        const {name,value}=e.target;
        Setformdata({...formdata,[name]:value.trim()})
        console.log(formdata)
    }

    return(
       <>
       <Navbar/>
       <ConfigProvider 
            theme={{
                token: {
                    colorText:"white",
                    colorSuccess:"white",
                    colorError:"white"
                },
                components: {Notification: {zIndexPopup:99999},}
              }}>
                {contextHolder}
            </ConfigProvider>
        <div className='SignUp'>
            <div className="SignUp-Form-div">
                <div className="SignUp-img-div">
                    <img src={SignUpImage} alt="SignUpImage" className="SignUp-img" />
                </div>   
                <div className="SignUp-Form">
                    <div className="SignUp-Form-title-div">
                        <h1 className="SignUp-Form-title">SignUp</h1>
                    </div>                 

                  <div className="SignUp-Form-div-1">
                        <div className="SignUp-Form-Name">
                            <label className='SignUp-Form-Name-label' htmlFor="">Name:</label>
                            <input type='text' name="name" onChange={SignUpChange} placeholder="Name" autoComplete='off' required/>
                            {Ack?(<span className='Errmsg'>{Errmsg.name}</span>):(<span className='Errmsg'>{Errmsg.name}</span>)}
                        </div>

                        <div className="SignUp-Form-Email">
                            <label className='SignUp-Form-Email-label' htmlFor="">Email Address:</label>
                            <input type="email" name='email' onChange={SignUpChange} placeholder='Email Address' required autoComplete='off'/>
                            {Ack?(<span className='Errmsg'>{Errmsg.email}</span>):(<span className='Errmsg'>{Errmsg.email}</span>)}
                        </div>
                    </div>

                    <div className="SignUp-Form-div-2">
                        <div className="SignUp-Form-Password">
                            <label className='SignUp-Form-Password-label' htmlFor="">Password:</label>
                            <input type="password" name='password' onChange={SignUpChange}  placeholder='Password' autoComplete='off' required/>
                            {Ack?(<span className='Errmsg'>{Errmsg.password}</span>):(<span className='Errmsg'>{Errmsg.password}</span>)}
                        </div>

                        <div className="SignUp-Form-ConfirmPassword">
                            <label className='SignUp-Form-ConfirmPassword-label' htmlFor="">Confirm Password:</label>
                            <input type="password" name='confirmpassword' onChange={SignUpChange}  placeholder='Confirm Password' autoComplete='off' required/>
                            {Ack?(<span className='Errmsg'>{Errmsg.confirmpassword}</span>):(<span className='Errmsg'>{Errmsg.confirmpassword}</span>)}
                        </div>
                    </div>

                    <div className="SignUp-Form-div-3">
                        <div className="SignUp-Form-Phone">
                            <label className='SignUp-Form-Phone-label' htmlFor="">Contact No:</label>
                            <input type='number' name="phone" onChange={SignUpChange} minLength={10}  maxLength={10} min={0} placeholder='Phone Number' autoComplete='off' required/>
                            {Ack?(<span className='Errmsg'>{Errmsg.phone}</span>):(<span className='Errmsg'>{Errmsg.phone}</span>)}
                        </div> 

                        <div className="SignUp-Form-Location">
                            <label className='SignUp-Form-Location-label' htmlFor="">Location:</label>
                            <input type="text" name="location" onChange={SignUpChange} placeholder='Location' autoComplete='off'  required/>
                            {Ack?(<span className='Errmsg'>{Errmsg.location}</span>):(<span className='Errmsg'>{Errmsg.location}</span>)}
                        </div>
                    </div>

                    <div className="SignUp-Form-SignUpbtn">
                        <button className='SignUp-Form-btn' onClick={ValidateForm}>Register</button>
                        <p className='SignUp-Form-info'>Already have an account? <Link className='SignUp-Form-Login' to="/Login">Login</Link></p>
                    </div>    
                </div>
            </div>
        </div>
        <Footer/>
       </>

    )
}
export default SignUp;