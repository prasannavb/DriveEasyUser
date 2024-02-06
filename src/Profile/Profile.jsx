//CSS
import './Profile.css'

//antd
import { Select ,notification,ConfigProvider} from 'antd';

//antd-icon
import { LeftCircleFilled } from '@ant-design/icons';

//data
import {CityData} from './CityData'
import { Gender } from './CityData';
 
//react
import { useState ,useEffect,useRef} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';

//firebase
import auth from '../config/firebase'; 
import {storage} from '../config/firebase'
import { signOut } from 'firebase/auth';
import { getDownloadURL,ref, uploadBytes } from 'firebase/storage';


//slice
import {SignInDetails,  SignOutDetails } from "../Slice/userSlice";

//custom icon
import { ProfileTickIcon,ProfileCancelIcon,ZCoinsIcon } from '../SVGIcons/SvgComponent';


const Profile=()=>
{


    const [ProfileDetails,SetProfileDetails]=useState({})
    const [Details,SetDetails]=useState({email:'',phone:'',location:''})
    const [Ack,SetAck]=useState(false)
    const [Errmsg,SetErr]=useState({email:'',phone:''})
    const [image,SetImage]=useState()
    const [api, contextHolder] = notification.useNotification();

    const Avatar=useRef()

    const user=useSelector((state)=>state.user)
    const dispatch=useDispatch()
    const Navigate=useNavigate()

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


    const Logout=()=>
    {
        signOut(auth);
        dispatch(SignOutDetails())
        Navigate("/")
    }


    const getUserDetails=async(uid)=>
    {
        const {data}=await axios.post('https://drive-easy-customer-server.vercel.app/findUserProfile',{uid})
        SetProfileDetails(data)
        SetDetails({email:data.email,phone:data.phone,location:data.location})

       try
       {
        const imageRef=ref(storage,'/images/'+`${user.uid}`)
        const imgdata=await  getDownloadURL(imageRef)
        if(imgdata)
        {
            Avatar.current.style.backgroundImage=`url(${imgdata})`
        }
       SetImage(imgdata)

       }catch(error)
       {
            Avatar.current.style.backgroundImage=`url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS1MqsgcnibLWsjdWTQPPmVC-oiDsErsX-1fcrz3MR_N38jc1IaP_dJXYONB0K-VYAmJE&usqp=CAU)`
       }


    }

    useEffect(()=>{
        if(user.isAuth)
        {
            getUserDetails(user.uid)
        }
        else
        {
            Navigate('/')
        }
    },[])

    const ProfileChange=(e)=>
    {
        const {name,value}=e.target
        SetProfileDetails((prev)=>{return({...prev,[name]:value.trim()})})
    }
    const CityChange = (value) => {
        SetProfileDetails((prev)=>{return({...prev,location:value})})
      };

      const GenderChange=(value)=>
      {
        SetProfileDetails((prev)=>{return({...prev,gender:value})})
      }

      const AvatarChange=async(e)=>
      {
         let reader=new FileReader()
         reader.readAsDataURL(e.target.files[0])
         reader.onload=()=>{
            Avatar.current.style.backgroundImage = `url(${reader.result})`;
        }
        SetImage(e.target.files[0])
      }

      const ValidateForm=()=>
      {
          if(ProfileDetails.phone==="" || ProfileDetails.phone===null)
          {
              SetErr((prev)=>{return({...prev,phone:'Enter your phone number'})})
              SetAck(true)
          }
          else if(ProfileDetails.phone.length!==10)
          {
              SetErr((prev)=>{return({...prev,phone:'Enter a valid phone number'})})
              SetAck(true)
          }
          else
          {
              SetErr((prev)=>{return({...prev,phone:''})})
              SetAck(false)
          }
   
          if(ProfileDetails.email!=="" && ProfileDetails.email!=null  && ProfileDetails.phone!=="" && ProfileDetails.phone.length===10)
          {
              UpdateProfileDetails()
          }
      }
      const UpdateProfileDetails=async()=>
      {
            const {data}=await axios.post('https://drive-easy-customer-server.vercel.app/UpdateProfileDetails',ProfileDetails)

            const imageRef=ref(storage,`/images/${user.uid}`)
            const imgdata=await uploadBytes(imageRef,image)

            if(data.action)
            {
                await getUserDetails(user.uid)
                api.success({
                    message: 'Successfully Updated',
                    description:'Your profile has been updated  ',
                    duration:5,
                    style: {
                        background:"#5cb85c	",
                      }
    
                });
                dispatch(SignInDetails(ProfileDetails))
            }
      }


    return(
        <div className='Profile'>
            <ConfigProvider
  theme={{ components: {Notification: {zIndexPopup:99999	  },}, token: {
    colorText:"white",
    colorSuccess:"white",
    colorError:"white"

},}}>          
  {contextHolder}
</ConfigProvider>
            <div className="Profile-LeftNav">
                <Link to='/' className='Profile-Backbtn'><LeftCircleFilled/></Link>
                <div className="Profile-LeftNav-1">
                    <div className="Profile-LeftNav-Img">
                        <div ref={Avatar} className="Profile-LeftNav-CircleImg">
                            <input type="file" name="profile" accept='image/*' onChange={AvatarChange} />
                        </div>
                    </div>
                    <div className="Profile-LeftNav-details">
                        <b>{ProfileDetails.name}</b>
                        <span>{Details.email}</span>
                        <span>{Details.phone}</span>
                    </div>
                </div>
                
                <div className="Profile-LeftNav-2">
                    <div className="Profile-LeftNav-Verify">
                        <p>{image?(<><ProfileTickIcon width='20px' height='20px' /></>):(<><ProfileCancelIcon width='25px' height='25px' /></>)} Profile</p>
                        <p><ProfileTickIcon width='20px' height='20px' />  Contact Number</p>
                        <p>{ProfileDetails.address && ProfileDetails.address.trim()!==''?(<><ProfileTickIcon width='20px' height='20px' /> Address</>):(<><ProfileCancelIcon width='25px' height='25px' /> Address</>)}</p>
                    </div>
                </div>
                
                <div className="Profile-LeftNav-3">
                    <div className="Profile-LeftNav-CashDetails">
                        <p><ZCoinsIcon width='20px' height='20px'/>Z-Points(Download App)</p>
                    </div>
                </div>
                
                <div className="Profile-LeftNav-4">
                    <div className="Profile-LeftNav-btns">
                        <a href='https://driveeasyhost.netlify.app' target='_blank'>Become a Host</a>
                        <button onClick={Logout}>Logout</button>
                    </div>
                </div>
            </div>
            <div className="Profile-RightNav">
                <div className="Profile-RightNav-title">
                    <h2>MY ACCOUNT</h2>
                </div>
                <div className="Profile-RightNav-Details1">
                    <div className="Profile-RightNav-Details1-div-1">
                        <h2>Account Details</h2>
                    </div>
                    
                    <div className="Profile-RightNav-Details1-div-2">
                        <div className="Profile-RightNav-Details1-subdiv-1">
                            <b>Email: </b>
                            <input type="email" name='email' value={ProfileDetails.email} onChange={ProfileChange} placeholder='Email Address' required autoComplete='off' readOnly/>
                            {Ack?(<span className='Profile-Errmsg'>{Errmsg.email}</span>):(<span className='Profile-Errmsg'>{Errmsg.email}</span>)}
                        </div>

                        <div className="Profile-RightNav-Details1-subdiv-2">
                            <b>Contact Number: </b>
                            <input type='number' name="phone"  value={ProfileDetails.phone} onChange={ProfileChange} minLength={10}  maxLength={10} min={0} placeholder='Phone Number' autoComplete='off' required/>
                            {Ack?(<span className='Profile-Errmsg'>{Errmsg.phone}</span>):(<span className='Profile-Errmsg'>{Errmsg.phone}</span>)}
                        </div>
                    </div>
                </div>

                <div className="Profile-RightNav-Details2">
                    <div className="Profile-RightNav-Details2-div-1">
                        <h2>Personal Details</h2>
                    </div>
                    <div className="Profile-RightNav-Details2-div-2">
                        <div className="Profile-RightNav-Details2-subdiv-1">
                            <b>Name:</b>
                            <input type="text" name="name" value={ProfileDetails.name}  readOnly />

                        </div>
                        <div className="Profile-RightNav-Details2-subdiv-2">
                            <b>Gender:</b>
                            <Select 
                            placeholder="Choose your gender "
                            value={(ProfileDetails.gender==='')?('Prefer Not to say'):(ProfileDetails.gender)}
                                style={{
                                  width:200,
                                  margin:'2%'
                                }}
                                options={Gender}
                                onChange={GenderChange}
                                />        
                        </div>
                    </div>
                </div>

                <div className="Profile-RightNav-Details3">
                    <div className="Profile-RightNav-Details3-div-1">
                        <h2>Location Details</h2>
                    </div>
                    
                    <div className="Profile-RightNav-Details3-div-2">
                        <p> Please share your current address for optimized experience</p>
                    </div>
                    
                    <div className="Profile-RightNav-Details3-div-3">
                        <div className="Profile-RightNav-Details3-subdiv-1">
                            <b>Address</b>
                            <textarea name="address" onChange={ProfileChange}  placeholder='Permanant Residential Address' value={ProfileDetails.address}></textarea>
                        </div>
                        <div className="Profile-RightNav-Details3-subdiv-2">
                            <b>City</b>
                            <Select
                                showSearch
                                value={ProfileDetails.location}
                                placeholder="Choose your city"
                                onChange={CityChange}
                                filterOption={filterOption}
                                options={CityData}
                                size='large'
                                style={{
                                    margin:'2%'
                                  }}
                            />                        
                        </div>
                              
                    </div>
                </div>

                <div className="Profile-RightNav-Updatebtn">
                    <button onClick={ValidateForm}>Update</button>
                </div>
            </div>
        </div>
    )
}

export default Profile