import './About.css'
//Images
import AboutImage from '../../Images/About/About.jpg'

const About=()=>
{
    return(
        <div className="About" id="About">
            <div className="About-info"  data-aos="fade-right" data-aos-duration="1000">
                <h1 className="About-info-title">
                    About Us
                </h1>
                <p className="About-info-desc">

                DriveEasy is a dynamic and pioneering platform, revolutionizing the car-sharing landscape in emerging markets. With a robust technology-driven platform, DriveEasy boasts a fleet of over 20,000 cars, strategically positioned across vibrant locations in India. </p>
                <p className="About-info-desc">
                Our mission is to empower individuals to become host entrepreneurs, providing them with a safe and seamless way to share their cars and earn additional passive income.        </p>
                
            </div>
            <div className="About-img-div"  data-aos="fade-left" data-aos-duration="1000">
                <img  src={AboutImage} alt="AboutImg" className='About-img' />
            </div>
        </div>
    )
}

export default About;