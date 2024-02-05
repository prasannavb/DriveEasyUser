// CSS
import './BookingBanner.css';
//React
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

//antd
import { Breadcrumb,ConfigProvider } from 'antd';


const BookingBanner = (props) => {

    const {Name,img,Back}=props

    const imgref=useRef()
    const Navigate=useNavigate()

    useEffect(()=>
    {
        imgref.current.style.background = `url(${img})`;
        imgref.current.style.backgroundRepeat = 'no-repeat';
        imgref.current.style.backgroundPosition = 'center';
        imgref.current.style.backgroundSize = 'cover';
        
    },[])

    const BackToCar=()=>
    {
        Back()
    }

    const BackToHome=()=>
    {
        Navigate('/')
    }

  return (
    <div ref={imgref} className='block-title'>
      <div className="vc_row-overlay">
        <div className="BreadCrumbs">
        <div className="BreadCrumbs-title">
            <h1>{Name}</h1>
        </div>
        <div className="BreadCrumbs-info">
        <ConfigProvider
  theme={{
    components: {
      Breadcrumb: {
        separatorColor:'#fff',
        itemColor:'#fff'	
      },
    },
  }}
>
            <Breadcrumb
                items={[
                  {
                    title:<p onClick={BackToHome} className='BreadCrumbs-item'>Home</p>,
                  },
                  {
                    title: <p onClick={BackToCar} className='BreadCrumbs-item'>Our Cars</p>,
                  },
                  {
                    title: <p className='BreadCrumbs-item'>{Name}</p>,
                  },
                ]}
            />
</ConfigProvider>

        </div>  
        </div>
      </div>
    </div>
  );
}

export default BookingBanner;
