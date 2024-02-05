//CSS
import "./LuxuryFleets.css"

//React
import React, { useEffect } from "react";

//AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

//Modules
import Client from '../Client/Client'

//Images
import Fleet1 from '../../Images/Fleets/Fleet1.avif'
import Fleet2 from '../../Images/Fleets/Fleet2.jpg'
import Fleet3 from '../../Images/Fleets/Fleet3.jpg'

const LuxuryFleet=()=>
{
    useEffect(() => {
        AOS.init();
    }, []);

    return(
        <div className="Fleet">
            <div className="Fleet-title-div">
                <h1 className="Fleet-title">Our Rental Fleets</h1>
            </div>
            <div className="Fleet-Cards-div">
                <div className="Fleet-Cards" data-aos="fade-up" >
                    <div className="Fleet-Cars">
                        <img src={Fleet1} alt="Mercedes-Benz S-Class" />
                        <span className="Fleet-name">Mercedes-Benz S-Class</span>
                    </div>
                    <div className="Fleet-Cars" data-aos="fade-up" >
                        <img src={Fleet2} alt="BMW M4" />
                        <span className="Fleet-name">BMW M4</span>
    
                    </div>
                    <div className="Fleet-Cars" data-aos="fade-up" >
                        <img src={Fleet3} alt="Audi R8" />
                        <span className="Fleet-name">Audi R8</span>
                    </div>
                </div>
            </div>
            <Client/>
        </div>
    )

}

export default LuxuryFleet;