import './Pack.css'

//CustomSVGIcons
import { InstagramIcon } from '../../SVGIcons/SvgComponent';

const Pack=()=>
{
    return(
        <div className="Pack">
            <div className='Pack-div' id='Pack1'>
                <a href='https://www.instagram.com/prasannavb_1344/?next=%2F' target='_blank' className='Pack-div-title'><InstagramIcon width='45px' height='45px'/></a>
            </div>
            <div className='Pack-div' id='Pack2'>
                <a href='https://www.instagram.com/prasannavb_1344/?next=%2F' target='_blank' className='Pack-div-title'><InstagramIcon width='45px' height='45px'/></a>

            </div>
            <div className='Pack-div' id='Pack3'>
                <a href='https://www.instagram.com/prasannavb_1344/?next=%2F'  target='_blank' className='Pack-div-title'><InstagramIcon width='45px' height='45px'/></a>

            </div>
            <div className='Pack-div' id='Pack4'>
                <a href='https://www.instagram.com/prasannavb_1344/?next=%2F' target='_blank' className='Pack-div-title'><InstagramIcon width='45px' height='45px'/></a>
            </div>
        </div>
    )
} 

export default Pack;
