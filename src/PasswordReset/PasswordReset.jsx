//React Dependency
import { useState } from 'react'
import axios from 'axios'
import { useNavigate ,useLocation} from 'react-router-dom'

//firebase
import auth from '../config/firebase'
import { confirmPasswordReset } from 'firebase/auth'


//css
import './PasswordReset.css'

const PasswordReset=()=>
{

    const [FormData,SetFormData]=useState({Email:'',Password:'',ConfirmPassword:''})
    const [Ack,SetAck]=useState(false)
    const [Errmsg,SetErrmsg]=useState({Email:'',Password:'',ConfirmPassword:''})
    const location =useLocation()
    
    const Navigate=useNavigate()

    const FormChange=(e)=>
    {
        const {name,value}=e.target
        SetFormData((prev)=>{return({...prev,[name]:value.trim()})})
    }

    const ResetPassword=async()=>
    {
        const {data}=await axios.post('https://drive-easy-customer-server.vercel.app/forgotPassword',FormData)
        console.log(data)
        if(data.action)
        {
            const query=new URLSearchParams(location.search)
            const oobCode=query.get('oobCode')
            await confirmPasswordReset(auth,oobCode,FormData.Password)
            Navigate('/Login')

        }
        else
        {
            alert('Enetr valid details')
        }
    }

    const ValidateForm=()=>
    {
        
        if(FormData.Email==='')
        {
            SetErrmsg((prev)=>{return({...prev,Email:'Enter your Email'})})
            SetAck(true)        
        }
        else if(!FormData.Email.includes('@gmail.com'))
        {
            SetErrmsg((prev)=>{return({...prev,Email:'Enter a valid email'})})
            SetAck(true)
        }
        else 
        {
            SetErrmsg((prev)=>{return({...prev,Email:''})})
            SetAck(false)
        }
        
        if(FormData.Password==='')
        {
            SetErrmsg((prev)=>{return({...prev,Password:'Enter your new password'})})
            SetAck(true)        
        }
        else if(FormData.Password.length<6)
        {
            SetErrmsg((prev)=>{return({...prev,Password:'Password must contain minimum of 6 length'})})
            SetAck(true)
        }
        else 
        {
            SetErrmsg((prev)=>{return({...prev,Password:''})})
            SetAck(false)
        }
        
        if(FormData.ConfirmPassword==='')
        {
            SetErrmsg((prev)=>{return({...prev,ConfirmPassword:'Enter your new password to confirm'})})
            SetAck(true)        
        }
        else if(FormData.ConfirmPassword!==FormData.Password)
        {
            SetErrmsg((prev)=>{return({...prev,ConfirmPassword:'Password doesnt match'})})
            SetAck(true)
        }
        else 
        {
            SetErrmsg((prev)=>{return({...prev,ConfirmPassword:''})})
            SetAck(false)
        }

        if(FormData.Email!=='' && FormData.Email.includes('@gmail.com') && FormData.Password!=="" && FormData.Password.length>=6 && FormData.ConfirmPassword!=="" && FormData.Password===FormData.ConfirmPassword)
        {
            ResetPassword()
        }
    }


    return(
        <div className='PasswordReset-layout'>

        <div className="PasswordReset">
            <h1 className='PasswordReset-title'>Reset Password</h1>
            
            <div className='PasswordReset-Form'>
            <div className="PasswordReset-Email">
                    <b>Email Address:</b>
                    <input type="email" name="Email" onChange={FormChange} placeholder="Email Address" autoComplete='off' required />
                    {Ack?(<span className='Errmsg'>{Errmsg.Email}</span>):(<span className='Errmsg'>{Errmsg.Email}</span>)}

              </div>
              <div className="PasswordReset-Password">
                    <b>Password:</b>
                    <input type="password" name="Password" onChange={FormChange} placeholder="Password" autoComplete='off' required />
                    {Ack?(<span className='Errmsg'>{Errmsg.Password}</span>):(<span className='Errmsg'>{Errmsg.Password}</span>)}

              </div>
              <div className="PasswordReset-ConfirmPassword">
                    <b>Confirm Password:</b>
                    <input type="password" name="ConfirmPassword" onChange={FormChange} placeholder="Confirm Password" autoComplete='off' required />
                    {Ack?(<span className='Errmsg'>{Errmsg.ConfirmPassword}</span>):(<span className='Errmsg'>{Errmsg.ConfirmPassword}</span>)}

              </div>
            </div>
            <div className='PasswordReset-btns'>
                <button onClick={ValidateForm} >Reset Password</button>
            </div>
        </div>

    </div>
    )
}

export default PasswordReset