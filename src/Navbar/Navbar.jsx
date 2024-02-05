//Firebase 
import auth from "../config/firebase";
import {  signOut } from "firebase/auth";

//Slice
import {  SignOutDetails } from "../Slice/userSlice";

//React 
import { useSelector,useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

//CSS
import './Navbar.css'

//Images
import Logo from '../Images/Logo/Logo.png'


const Navbar=()=>
{
    const user=useSelector((state)=>state.user)
    const dispatch=useDispatch();
    const navigate=useNavigate()
    const location = useLocation();

    const isActiveLink = (path) => {
      return location.pathname === path;
    };

 
    const Logout=()=>
    {
        signOut(auth);
        dispatch(SignOutDetails())
        navigate("/")
    }


    return(
        <div className="Navbar">
            <div className="Navbar-Logo-div" >
                <img src={Logo} alt="Company Logo" className="Navbar-Logo" onClick={()=>{navigate('/')}} />
                <h2 className="Navbar-Logo-title" onClick={()=>{navigate('/')}}>DriveEasy</h2>
            </div>
            <div className="Navbar-items">
                <Link to="/" className={`Navbar-links ${isActiveLink('/') && 'active'}`}>Home</Link>
                <Link to="/#About"   className={`Navbar-links ${isActiveLink('/#About') && 'active'}`}>About</Link>
                <Link to="/Carlist" className={`Navbar-links ${isActiveLink('/Carlist') && 'active'}`}>Our Cars</Link>
                <Link to="/#Reviews" className={`Navbar-links ${isActiveLink('/#Reviews') && 'active'}`}>Reviews</Link>
                <Link to="/Contact" className={`Navbar-links ${isActiveLink('/Contact') && 'active'}`}>Contact</Link>
                {user.isAuth?(
                    <>
                        <Link to='/ViewBooking' className={`Navbar-links ${isActiveLink('/ViewBooking') && 'active'}`}>View Booking</Link>
                        <Link to='/Profile' className={`Navbar-links ${isActiveLink('/Profile') && 'active'}`}>Profile</Link>
                        <button onClick={Logout} className="Navbar-links Navbar-Logoutbtn">Logout</button>
                    </>

                ):(
                    <>
                        <Link to="/Login" className={`Navbar-links ${isActiveLink('/Login') && 'active'}`}>Login</Link>
                        <Link to="/SignUp" className={`Navbar-links ${isActiveLink('/SignUp') && 'active'}`}>SignUp</Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default Navbar;