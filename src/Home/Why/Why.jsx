//CSS
import './Why.css'

//React
import { useEffect } from 'react';

//AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

const Why=()=>
{
    useEffect(() => {
        AOS.init();
    }, []); 

    return(
        <div className="Why">
            <div className="Why-title-div">
                <h1 className="Why-title">Why us?</h1>
            </div>  
            <div className="Why-cards-div">
                <div className="Why-cards" data-aos="zoom-in">
                    <h1>Secured Payment Guarantee</h1>
                    <p>Our secured payment gateway ensures your transactions are protected, providing peace of mind and a hassle-free booking experience. Your financial information is handled with the utmost security.</p>
                </div>
                <div className="Why-cards" data-aos="zoom-in">
                    <h1>Executive Car Service</h1>
                    <p>Elevate your travel experience with our fleet of executive luxury cars. Immerse yourself in comfort, style, and sophistication as you arrive at your destination in one of our premium vehicles.</p>
                </div>
               <div className="Why-cards" data-aos="zoom-in">
                    <h1>Help Center & Support 24/7</h1>
                    <p>Our dedicated help center is at your service 24/7, ensuring prompt and efficient support whenever you need it. We're here to address your inquiries, assist with bookings, and provide assistance around the clock.</p>
                </div>
                <div className="Why-cards" data-aos="zoom-in">
                    <h1>Coporate & Business Services</h1>
                    <p>Our tailored corporate and business services are designed to meet the unique needs of professionals. Experience seamless transportation solutions, from executive car rentals to comprehensive corporate travel packages, ensuring efficiency and reliability for your business needs.</p>
                </div>
                <div className="Why-cards" data-aos="zoom-in">
                    <h1>Car Sharing Options</h1>
                    <p>Experience the flexibility of car sharing with our diverse options. Whether you're traveling solo or with a group, our car sharing solutions offer convenience and affordability tailored to your needs.</p>
                </div>
                <div className="Why-cards" data-aos="zoom-in">
                    <h1>Booking any class Vehicles</h1>
                    <p>Choose from a wide range of vehicles to suit your preferences and needs. From economy to luxury, our fleet offers diverse options, allowing you to book the perfect class of vehicle for your journey.</p>
                </div>
            </div>
        </div>
    )
}

export default Why;