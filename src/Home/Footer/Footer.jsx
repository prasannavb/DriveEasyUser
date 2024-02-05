//React 
import { useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

//CSS
import "./Footer.css"

//Antd-Framework
import {MailFilled,EnvironmentFilled,PhoneFilled} from '@ant-design/icons'
import { Tooltip,notification,ConfigProvider } from "antd"

//CustomSVGIcons
import { InstagramIcon,LinkedInIcon,GithubIcon,HeartIcon } from "../../SVGIcons/SvgComponent"

//Images
import Logo from '../../Images/Logo/Logo.png'

const Footer=()=>
{
    const [Email,SetEmail]=useState('')
    const [api, contextHolder] = notification.useNotification();
    const user=useSelector((state)=>state.user)

    const openNotification = (message) => {
        message.includes('Subscribed')?(   api.success({
            message: message,
            placement:"bottomRight",
            duration:2,
            style: {
                background:"#5cb85c	",
              }
          })):(
            api.error({
                message: message,
                placement:"bottomRight",
                duration:3,
                style: {
                    background:"rgb(223, 67, 67)",
                  }
              })
          )
    };

    const Subscribe=()=>
    {
        if(Email==='')
        {
            openNotification("Enter your email")
        }
        else if(!Email.includes('@gmail.com'))
        {
            openNotification("Enter a valid email")
        }
        else
        {
            openNotification("You're Subscribed!")
        }
    }
 
    return(
        <div className="Footer">
            <div className="Footer-div">
                <div className="Footer-About"> 
                <div>
                    <img src={Logo} alt="Logo" />
                    <h6 className="Footer-About-title">DriveEasy</h6>
                </div>
                    <p className="Footer-About-info">DriveEasy was created with the mission to connect people and their cars during unused times, transforming idle vehicles into usable assets. This not only promotes sustainable practices but also enables individuals to earn money, turning car-sharing into a rewarding and environmentally conscious endeavor.</p>
                </div>
                <div className="Footer-Links">
                    <h3>Useful Links</h3>
                    <li className="Footer-NavList"><Link className="Footer-NavLinks Footer-NavLinks-1 " to="/">Home</Link></li>
                    <li className="Footer-NavList"><Link className="Footer-NavLinks Footer-NavLinks-2 " to="/#About">About</Link></li>
                    <li className="Footer-NavList"><Link className="Footer-NavLinks Footer-NavLinks-1 " to="/CarList">Our Cars</Link></li>
                    <li className="Footer-NavList"><Link className="Footer-NavLinks Footer-NavLinks-1 " to="/#Reviews">Reviews</Link></li>
                    <li className="Footer-NavList"><Link className="Footer-NavLinks" to="/Contact">Contact</Link></li>
                    {user.isAuth?(
                           <><li className="Footer-NavList"><Link className="Footer-NavLinks" to="/ViewBooking">View Bookings</Link></li></>
                    ):(
                        <>
                        <><li className="Footer-NavList"><Link className="Footer-NavLinks" to="/Login">Login</Link></li></>
                        <><li className="Footer-NavList"><Link className="Footer-NavLinks" to="/SignUp">SignUp</Link></li></>
                        </>
                    )}
                </div>
                <div className="Footer-Contact">
                    <h6 className="Footer-Contact-title"> Have a Questions?</h6>
                    <div className="Footer-Contact-info">
                        <address><EnvironmentFilled style={{marginRight:'2%',fontSize:'20px'}} />SVCE , Pennalur,Sriperumbudur-117,TN,India</address>
                        <code> <PhoneFilled style={{marginRight:'2%',fontSize:'20px',transform:'rotateY(180deg)'}} />+91 7305045675</code>
                        <code><MailFilled   style={{marginRight:'2%',fontSize:'20px'}} /> prasannavb04@gmail.com</code>
                    </div>
                </div>
                <div className="Footer-Subscribe">
                     <h6 className="Footer-Subscribe-title">Subscribe Us</h6>
                     <input type="email" name="email" className="Footer-Subscribe-email" placeholder="Enter email address" onChange={(e)=>{SetEmail(e.target.value.trim())}} autoComplete="off" required />
                     <button className="Footer-Subscribe-btn" onClick={Subscribe}>Subscribe!</button>
                </div>
            </div>
            <div className="Footer-SocialMedia">
                <h2>Connect With Us!</h2> 
                <Tooltip placement="bottom" title={"Github"} >
                    <a href="https://github.com/prasannavb" target="_blank"><GithubIcon width='35px' height='35px'/></a>
                 </Tooltip> 
                 <Tooltip placement="bottom" title={"LinkedIn"} color='#017ab5'>
                    <a href="https://www.linkedin.com/in/prasanna-vb-72a868240" target="_blank"><LinkedInIcon  width='40px' height='40px'/></a> 
                 </Tooltip> 
                 <Tooltip placement="bottom" title={"Instagram"} color='#cf3583'>
                     <a href="https://www.instagram.com/prasannavb_1344/?next=%2F" target="_blank"> <InstagramIcon width='35px' height='35px' /></a> 
                 </Tooltip> 
            </div>
            <div className="Footer-Copyright">
                <p>Copyright ©2025 All rights reserved |Designed with <HeartIcon width='20px' height='20px'/> by Prasanna V B</p>
            </div>
            <ConfigProvider 
            theme={{
                token: {
                    colorText:"white",
                    colorSuccess:"white",
                    colorError:"white"
                },
              }}>
                {contextHolder}
            </ConfigProvider>
        </div>
    )
}

export default Footer