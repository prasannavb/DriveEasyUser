//css
import './Contact.css'

//Modules
import Navbar from '../Navbar/Navbar'
import Footer from '../Home/Footer/Footer'
import Loading from '../Loading/Loading'

//Antd-Framework
import {MailFilled,EnvironmentFilled,FieldTimeOutlined,PhoneFilled} from '@ant-design/icons'
import { Breadcrumb,ConfigProvider,notification } from 'antd'

//React
import { useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Contact=()=>
{
    const user=useSelector((state)=>state.user)
    const Navigate=useNavigate()
    const [Message,SetMessage]=useState({uid:`${user.uid}`,Message:''})
    const [loading,Setloading]=useState(true)
    const [Details,SetDetails]=useState()
    const [Errmsg,SetErrmsg]=useState()
    const [api, contextHolder] = notification.useNotification();


    const openNotification = (message) => {
        user.isAuth?(
            api.success({
                message:message,
                placement:"topRight",
                duration:2,
                style: {
                    background:"#5cb85c	",
                  }
              })
        ):(
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
        )
    };
    
    const getUserDetails=async(uid)=>
    {
        const {data}=await axios.post('https://drive-easy-customer-server.vercel.app/FindNameandEmail',{uid})
        SetDetails(data)
        Setloading(false)
    }

    useEffect(()=>{
        getUserDetails(user.uid)
    },[])

    const Contactchange=(e)=>
    {
        SetMessage((prev)=>{return({...prev,Message:e.target.value.trim()})})
    }

    const ValidateForm=()=>
    {
        if(user.isAuth)
        {
            if(Message.Message==='')
            {   
                SetErrmsg('Fill the Message')
            }
            else
            {
                SetErrmsg('')
                SendMessage()
            }
        }
        else
        {
            openNotification('Login to send message')
        }
    }

    const SendMessage=async()=>
    {   
        const {data}=await axios.post('https://drive-easy-customer-server.vercel.app/ContactUs',Message)
        if(data.action)
        {
            openNotification( 'Message sent , We will contact back you soon')
        }
    }

    const BackToHome=()=>
    {
        Navigate('/')
    }


    if(loading)
    {
        return <Loading/>
    }
    return (
        <>
          <Navbar />
      
          <div className="ContactForm">
            <div className="ContactForm-banner">
              <div className="ContactForm-banner-overlay">
                <div>
                  <h2>Contact Us</h2>
                </div>
                <ConfigProvider
                  theme={{
                    components: {
                      Breadcrumb: {
                        separatorColor: "#fff",
                        itemColor: "#fff",
                      },
                    },
                  }}
                >
                  <Breadcrumb
                    items={[
                      {
                        title: (
                          <p onClick={BackToHome} className="BreadCrumbs-item">
                            Home
                          </p>
                        ),
                      },
                      {
                        title: <p className="BreadCrumbs-item">Contact Us</p>,
                      },
                    ]}
                  />
                </ConfigProvider>
              </div>
            </div>
            <div
              className="ContactForm-cards"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <div>
                <EnvironmentFilled style={{ marginRight: "2%", fontSize: "55px" }} />
                <h3>Location</h3>
                <p>SVCE , Pennalur,Sriperumbudur-117,TN,India</p>
              </div>
              <div>
                <PhoneFilled
                  style={{
                    marginRight: "2%",
                    fontSize: "55px",
                    transform: "rotateY(180deg)",
                  }}
                />
      
                <h3>Phone</h3>
                <p>+91 7305045675</p>
                <p>+91 7305045655</p>
              </div>
              <div>
                <MailFilled style={{ marginRight: "2%", fontSize: "55px" }} />
      
                <h3>Email</h3>
                <p>2021cs0547@svce.ac.in</p>
                <p>prasannavb04@gmail.com</p>
              </div>
              <div>
                <FieldTimeOutlined style={{ marginRight: "2%", fontSize: "55px" }} />
                <h3>Working Hours</h3>
                <p>Monday-Friday</p>
                <p>7:00 AM - 5:00 PM</p>
              </div>
            </div>
      
            <div className="ContactForm-Contact">
              <div
                className="ContactForm-Contact-div"
                data-aos="zoom-in"
                data-aos-duration="1000"
              >
                <div>
                  <h2>Send Message</h2>
                </div>
                <div className="ContactForm-box">
                  <div>
                    <input type="text" value={Details.name} readOnly />
                    <input type="email" value={Details.email} readOnly />
                  </div>
                  <div className="ContactForm-textarea">
                    <textarea
                      placeholder="Message for us"
                      cols="20"
                      rows="10"
                      onChange={Contactchange}
                    ></textarea>
                    <span>{Errmsg}</span>
                    <button onClick={ValidateForm}>Send Us</button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="ContactForm-Maps"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248816.8565071739!2d79.66716829453125!3d12.986980300000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a528cd0cfb6e7ab%3A0x3294da3faad96a9!2sSri%20Venkateswara%20College%20of%20Engineering%20(SVCE)!5e0!3m2!1sen!2sin!4v1706187668320!5m2!1sen!2sin"
                width="600"
                height="450"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>{" "}
            </div>
            <ConfigProvider
              theme={{
                token: {
                  colorText: "white",
                  colorSuccess: "white",
                  colorError: "white",
                },
                components: { Notification: { zIndexPopup: 99999 } },
              }}
            >
              {contextHolder}
            </ConfigProvider>
          </div>
          <Footer />
        </>
      );
}

export default Contact;
      