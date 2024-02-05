//React
import axios from "axios"
import { useEffect, useState ,useRef} from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import React from 'react';

//Antd-Framework
import { Avatar,Rate ,Modal,ConfigProvider,Carousel,Empty} from 'antd';
import { LeftCircleFilled,InfoCircleFilled ,RightOutlined} from '@ant-design/icons';

//CustomSVGIcon
import { FareSummaryIcon } from "../../SVGIcons/SvgComponent";

//Slice
import { FillOutCarNumber } from "../../Slice/CarSLice"

//CSS
import "./Booking.css"

//Module
import BookingBanner from "../BookingBanner/BookingBanner";
import Amount from "../../Amount/Amount";

//Firebase
import {storage} from '../../config/firebase'
import { getDownloadURL,listAll ,ref} from "firebase/storage";
 
//Images
import UserIcon from '../../Images//UserIcon/userIcon.png'

const Booking=(props)=>
{
    const {data,SetBookAuth,Bookdata,Find,ApplyFilter,FilterDetails,selectedCars,Setpricevalue}=props
    const [cars,Setcar]=useState(data)
    const [Description,SetDescription]=useState()
    const [amount,SetTotalamount]=useState()
    const [FetchReview,SetFetchReview]=useState(false)
    const [isDesc,SetDesc]=useState(true)
    const [Reviews,SetReviews]=useState([])
    const [isnotempty,Setnotempty]=useState(false)
    const [Images,SetCarImages]=useState([])

    const [ShowSingleReview,SetShowSingleReview]=useState(false)
    const [SingleReviewData,SetSingleReviewData]=useState({})

    const DescriptionRef=useRef()
    const SpecificationsRef=useRef()
    const ReviewsRef=useRef()

    const filterslice=useSelector((state)=>state.FilterDetails)
    const Selectedcars=useSelector((state)=>state.SelectedCars)

    const dispatch=useDispatch()

    const Navigate=useNavigate()

    const Payment=(car_no,sid)=>
    {
        sessionStorage.setItem('sid',sid)
        sessionStorage.setItem("car_no",car_no)
        sessionStorage.setItem("start_date",Bookdata.start_date)
        sessionStorage.setItem("drop_date",Bookdata.drop_date)
        Navigate("/Pay")
    }

    const Back=async()=>
    {
        dispatch(FillOutCarNumber())
        if(filterslice.FilterAuth)
        { 
            FilterDetails.location=filterslice.location;
            FilterDetails.Fuel=filterslice.Fuel
            FilterDetails.Make=filterslice.Make
            FilterDetails.Model=filterslice.Model
            FilterDetails.Type=filterslice.Type
            FilterDetails.price=filterslice.price
            FilterDetails.ratings=filterslice.ratings
            FilterDetails.start_date=filterslice.start_date
            FilterDetails.drop_date=filterslice.drop_date

            selectedCars.location=Selectedcars.location;
            selectedCars.Fuel=Selectedcars.Fuel;
            selectedCars.Make=Selectedcars.Make;
            selectedCars.Model=Selectedcars.Model;
            selectedCars.Type=Selectedcars.Type;
            if(filterslice.price.length>0)
            {
                Setpricevalue(filterslice.price)
            }
            ApplyFilter()
        }
        else
        {
            Find()
        }
        SetBookAuth(false)
    }

    const getReviews=async(car_no)=>
    {
        const {data}=await axios.post('https://drive-easy-customer-server.vercel.app/findReviews',{car_no})
        if(data.length>0)
        {
            SetReviews(data)
            Setnotempty(true) 
        }
        else 
        {
            Setnotempty(false)
        }
        SetFetchReview(true)
    }

    const getDescription=async(car_no)=>
    {
        const {data}=await axios.post('https://drive-easy-customer-server.vercel.app/findDescription',{car_no});
        SetDescription(data.descripton)
    }

    const getCarImages=async(sid,car_no)=>
    {
        const imageRef = ref(
            storage,
            `/CarImages/${sid}/${car_no}/images/`
        );
        const imageList=await listAll(imageRef)

        const downloadURLs = await Promise.all(
            imageList.items.map(async (item) => {
              try {
                const url = await getDownloadURL(item);
                return url;
              } catch (error) {
                console.error('Error getting download URL:', error);
                return null;
              }
            })
          );
          SetCarImages(downloadURLs)
    }

    useEffect(()=>{
        let amt=Amount(Bookdata.start_date,Bookdata.drop_date,data.price)
        SetTotalamount(amt.amt)
        HandleDescriptionClick()
        getDescription(cars.car_no)
        getCarImages(cars.sid,cars.car_no)
    },[])

    const HandleDescriptionClick=()=>
    {
        SetFetchReview(false);
        SetDesc(true);
        DescriptionRef.current.style.borderBottom="5px solid orangered";
        SpecificationsRef.current.style.borderBottom=""
        ReviewsRef.current.style.borderBottom=""
    }
    
    const HandleSpecificationClick=()=>
    {
        SetDesc(false);
        SetFetchReview(false)
        SpecificationsRef.current.style.borderBottom="5px solid orangered";
        DescriptionRef.current.style.borderBottom=""
        ReviewsRef.current.style.borderBottom=""
    }

    
    const HandleReviewClick=()=>
    {
        SetDesc(false);
        SetFetchReview(true)
        ReviewsRef.current.style.borderBottom="5px solid orangered";
        DescriptionRef.current.style.borderBottom=""
        SpecificationsRef.current.style.borderBottom=""
        getReviews(cars.car_no)
    }

    return( 
        <div className="Booking">
             <ConfigProvider
              theme={{
              token: {
                colorBgMask:"rgba(0, 0, 0, 0.80)"	,
                zIndexPopupBase:"9999",
                colorIcon:"white",
                colorIconHover:"white",
                padding:0,
                paddingLG:0,
                paddingContentHorizontalLG: 0,
                paddingMD:0,
                paddingSM:0,
                paddingXL:0,
              },
               }}
            >
            <Modal  footer={null} centered open={ShowSingleReview} okText={"Extend"}  cancelText={"Cancel"} onOk={()=>{SetShowSingleReview(false)}} onCancel={()=>{SetShowSingleReview(false)}}>
                <div className="Bookings-SingleReview-Cards">
                    <h2>Ratings & Reviews</h2>
                    <div className="Bookings-SingleReview-Cards-div-1">
                    <Avatar
                        size={65}
                        alt='Profile'	
                        src={UserIcon}
                        />
                    <p>
                    {SingleReviewData.name}
                    </p>
                    <b>
                    </b>
                    </div>
                    <div className="Bookings-SingleReview-Cards-div-2">
                        <Rate  disabled value={parseFloat(SingleReviewData.car_rating)} allowHalf={true}/>    
                    </div>
                        <div className="Bookings-SingleReview-Cards-div-3">
                            <p>{SingleReviewData.car_review} </p>
                        </div> 
                 </div>
            </Modal>
            </ConfigProvider>
                <BookingBanner Name={cars.name} img={cars.img} Back={Back}  />
            <div className="Bookings-CardDeck">
                <div className="Bookings-Card-Car">
                    <div className="Bookings-Card-Car-title">
                        <button className="Bookings-Backbtn-header" onClick={Back}><LeftCircleFilled style={{color:'#0d1128',fontSize:"40px"}} /></button>
                        <h1>{cars.name}</h1>
                    </div>

                   <div className="Bookings-Card-Car-Img">
                   <Carousel autoplay dots draggable autoplaySpeed={3000} >
                  {Images.map((data, index) => (
                      <div key={index}>
                        <img src={data} alt={`Car ${index}`}  />
                      </div>
                    ))}
                    
              </Carousel>
                   </div>
                    
                    <div className="Bookings-Card-Car-box-title">
                        <div  ref={DescriptionRef} onClick={HandleDescriptionClick}><b>Description</b></div>
                        <div  ref={SpecificationsRef} onClick={HandleSpecificationClick}><b>Specifications</b></div>
                        <div  ref={ReviewsRef} onClick={HandleReviewClick}><b>Reviews</b></div>
                    </div>

                    <div className="Bookings-Card-Car-box">
                    {FetchReview?(<>
                        {isnotempty?(
                        <div className="Bookings-Review-CardDeck">
                            {Reviews.map((data)=>{
                                return(
                                    <div className="Bookings-Review-Cards" key={data._id} onClick={()=>{SetShowSingleReview(true),SetSingleReviewData(data)}}>
                                        <div className="Bookings-Review-Cards-div-1">
                                        <Avatar
                                            size={65}
                                            alt='Profile'	
                                            src={UserIcon}
                                        />
                                        <p>
                                        {data.name}
                                        </p>
                                        <b>
                                        <RightOutlined />
                                        </b>
                                        </div>
                                        <div className="Bookings-Review-Cards-div-2">
                                            <Rate  disabled value={parseFloat(data.car_rating)} allowHalf={true}/>    
                                        </div>
                                            <div className="Bookings-Review-Cards-div-3">
                                                <p>{data.car_review.slice(0,110)} {data.car_review.length>110?("..."):("")} </p>
                                            </div>
                                    </div>
                                )
                            })}

                        </div>):(<div className="Bookings-Car-No-Reviews">
                        <Empty className="PRESENTED_IMAGE_DEFAULT" imageStyle={{ height:100}}  description={
                            <span>
                                <h1>No Reviews</h1>
                            </span>
                          }>
                        </Empty>
                        </div>)}</>)
            :(<>{isDesc?(<div className="Bookings-Car-Description"><p>{Description}</p><a href="/Terms&Conditions" target="__blank" className="Bookings-Car-Description-Link"><InfoCircleFilled style={{color:"#551A8B"}}/> Terms & Conditions</a></div>)
            :(
            <div className="Bookings-Car-Specification"> 
                <div className="Bookings-Car-Specification-div-1">
                    <div>
                        <b>Make: </b><span>{cars.make}</span>
                    </div>
                    <div>
                        <b>Stock Status:</b><span>In Stock</span>
                    </div>
                    <div>
                        <b>Model: </b><span>{cars.model}</span>
                    </div>
                    <div>
                        <b>Type: </b><span>{cars.type}</span>
                    </div>
                    <div>
                        <b>Fuel: </b><span>{cars.fuel}</span>
                    </div>
                </div>
                <div className="Bookings-Car-Specification-div-2">
                    <div>
                        <b>Made Year: </b><span>{cars.year}</span>
                    </div>
                    <div>
                        <b>Price:</b><span>&#8377;{cars.price}</span>
                    </div>
                    <div>
                        <b>Price Type: </b><span>Fixed</span>
                    </div>
                    <div>
                        <b>Condition: </b><span>Excellent</span>
                    </div>
                    <div>
                        <b>Average Rating: </b><span>{cars.ratings}</span>
                    </div>
                </div>
            </div>)}</>)}

                    </div>
                </div>
                <div className="Bookings-Card-Details">
                    <div className="Bookings-Card-Details-Price">
                        <button><strong>&#8377; {cars.price}</strong>/per day</button>
                    </div>
                    <div className="Bookings-Car-Details-Address">
                        <div>
                            <b>From</b>
                            <p>{Bookdata.start_date.split('-')[2]}-{Bookdata.start_date.split('-')[1]}-{Bookdata.start_date.split('-')[0]} 00:00AM </p>
                            <p>{cars.location}</p>
                        </div>
                        <div>
                            <b>To</b>
                            <p>{Bookdata.drop_date.split('-')[2]}-{Bookdata.drop_date.split('-')[1]}-{Bookdata.drop_date.split('-')[0]} 11:59PM </p>
                            <p>{cars.location}</p>
                        </div>
                    </div>
                    <div className="Bookings-Car-Details-TotalPrice">
                        <p>Please Review the final amount</p>
                        <div className="Bookings-Car-Details-TotalPrice-div-1">
                            <b>&#8377; {amount}</b>
                            <div ><p className="FareSummary-info"><FareSummaryIcon/> Fare Summary</p></div>
                        </div>
                        <button onClick={()=>{Payment(cars.car_no,cars.sid)}} className="Bookings-Car-Details-ProceedPaybtn">PROCEED TO PAY</button>
                    </div>
                </div>

            </div>
        </div>
    )

}

export default Booking