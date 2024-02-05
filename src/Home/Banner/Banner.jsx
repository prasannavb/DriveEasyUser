//Banner
import { Link } from 'react-router-dom';

//CSS
import './Banner.css'

//Antd-Framwwork
import { RightCircleFilled } from '@ant-design/icons';


const Banner=()=> 
{
    return(
        <div className="Banner">
            <div className="Banner-box">
                <h1 className='Banner-box-title'>FIND THE RIGHT CAR FOR YOU.</h1>
                <p className="Banner-box-info">We have more than thousand cars for you to choose.</p>
                <Link to='/CarList' className="Banner-box-btn">Explore Now <RightCircleFilled style={{fontSize:'20px',marginLeft:'2.5%'}} /></Link >
            </div>
        </div>
    )
}

export default Banner;