//React
import axios from "axios";
import { useEffect, useState , useRef} from "react";
import {  useSelector } from "react-redux";
import { useNavigate,Link } from "react-router-dom";

//Module
import CheckBooking from "./CheckBooking";
import Navbar from "../Navbar/Navbar";
import Footer from "../Home/Footer/Footer";
import Loading from "../Loading/Loading";
import Amount from '../Amount/Amount'

//CSS
import "./ViewBooking.css"
 
//Antd-Framework
import {ConfigProvider, Empty, notification,Modal,Select, QRCode } from 'antd';
import { CalendarFilled ,StarFilled} from '@ant-design/icons';

//CustomSVGICons
import {FareSummaryIcon, ProfileCancelIcon} from '../SVGIcons/SvgComponent'


const ViewBooking=()=>
{
    const user=useSelector((state)=>state.user)
    const [loading,SetLoading]=useState(true)
    const [ActiveCars,SetActivecars] =useState([])
    const [BookingsCounts,SetBookingsCounts]=useState({Active:'',Past:'',Upcoming:''})
    const [Active,SetActive]=useState(true)
    const [Upcoming,SetUpcoming]=useState(false)
    const [Extend,SetExtend]=useState(false)
    const [confirm,Setconfirm]=useState(false)
    const [ViewMore,SetViewMore]=useState(false)
    const [singlecar,Setsinglecar]=useState({})
    const [fullsingledetails,Setfullsingle]=useState({})

    const [Reason,SetReason]=useState()
    const [NewAmount,SetNewAmount]=useState({drop_date:'',amt:0})
    const [Paybtn,SetPaybtn]=useState(true)

    const ActiveNavbar=useRef()
    const PastNavbar=useRef()
    const UpcomingNavbar=useRef()

    const Navigate=useNavigate()
     const CancellationReasons = [
        {
          value: 'Change in plans or itinerary',
          label: 'Change in plans or itinerary',
        },
        {
          value: 'Emergent personal or family matters',
          label: 'Emergent personal or family matters',
        },
        {
          value: 'Unexpected work commitments',
          label: 'Unexpected work commitments',
        },
        {
          value: 'Weather or road conditions concerns',
          label: 'Weather or road conditions concerns',
        },
        {
          value: 'Financial constraints or budget adjustments',
          label: 'Financial constraints or budget adjustments',
        },
      ];
      

    const [api, contextHolder] = notification.useNotification();

    const getActiveBookings=async(uid)=>
    {
        const {data}=await axios.post("https://drive-easy-customer-server.vercel.app/ActiveBookings",{uid})
        const newdata=await CheckBooking(data,"Active")

        if(Extend)
        {
            api.success({
                message: 'Successfully Extended',
                description:'Your Trip has been extended ',
                duration:5,
                style: {
                    background:"#5cb85c	",
                  }
              });
        }

        SetActive(true)
        SetUpcoming(false)
        SetActivecars((prev)=>newdata)

        ActiveNavbar.current.style.backgroundColor='#fd5f00'
        PastNavbar.current.style.backgroundColor='#333'
        UpcomingNavbar.current.style.backgroundColor='#333'

    }

    const getPastBookings=async(uid)=>
    { 
        const {data}=await axios.post("https://drive-easy-customer-server.vercel.app/PastBookings",{uid})
        SetActive(false)
        SetUpcoming(false)
        SetActivecars((prev)=>data)
        PastNavbar.current.style.backgroundColor='#fd5f00'
        ActiveNavbar.current.style.backgroundColor='#333'
        UpcomingNavbar.current.style.backgroundColor='#333'

    }

    const getUpcomingBookings=async(uid)=>
    {
        const {data}=await axios.post("https://drive-easy-customer-server.vercel.app/ActiveBookings",{uid})

        const newdata=await CheckBooking(data,"Upcoming")
        if(Upcoming && confirm)
        {
            api.success({
                message: 'Successfully Canceled',
                description:'Your Trip has been cancel ',
                duration:5,
                style: {
                    background:"#5cb85c	",
                  }

            });
        }
      
        SetUpcoming(true)
        SetActive(false)
        SetActivecars((prev)=>newdata)
        UpcomingNavbar.current.style.backgroundColor='#fd5f00'
        ActiveNavbar.current.style.backgroundColor='#333'
        PastNavbar.current.style.backgroundColor='#333'
    }

    const getBookingsCount=async(uid)=>
    {
        const cntdata=await axios.post('https://drive-easy-customer-server.vercel.app/findBookingsCount',{uid})
        const {data}=await axios.post("https://drive-easy-customer-server.vercel.app/ActiveBookings",{uid})
        const newdata=await CheckBooking(data,"Active")
        SetBookingsCounts((prev)=>{return({...prev,Active:newdata.length,Past:cntdata.data.pastcnt.length,Upcoming:Math.abs(cntdata.data.Activebookingcount-newdata.length)})})
    }

    useEffect(()=>{
        if(user.isAuth)
        {
            getActiveBookings(user.uid)
            getBookingsCount(user.uid)
        }
        else
        {
            Navigate("/")
        }
        SetLoading(false)
    },[])


    const EndTrip=async(status)=>
    {
        if(status)
        {
            const {data}=await axios.post('https://drive-easy-customer-server.vercel.app/EndTrip',singlecar)
            if(data.action)
            {
                sessionStorage.setItem('Review_car_no',singlecar.car_no)
                getActiveBookings(user.uid)
                Navigate('/ReviewForm')

            }
            else
            {
                alert('something went wrong')
            }
            getBookingsCount(user.uid)
            Setconfirm(false)
            
        }
        else
        {
            Setconfirm(false)
        }
    }

    const CancelTrip=async(status)=>
    {
        if(status)
        {
            if(Reason!=='' && Reason!==null && Reason!==undefined)
            {
                const {data}=await axios.post('https://drive-easy-customer-server.vercel.app/CancelTrip',{singlecar,Reason})
                if(data.action)
                {
                    getUpcomingBookings(user.uid)
                }
                else
                {
                    alert('something went wrong')
                }
                getBookingsCount(user.uid)
                SetReason()

            }
            else
            {
                api.error({
                    message: 'Choose your reason',
                    placement:"topRight",
                    duration:3,
                    style: {
                        background:"rgb(223, 67, 67)",
                      }
                  })            }
        }
        Setconfirm(false)


    }

    const DateChange=(e)=>
    {
        const {name,value}=e.target
        Setsinglecar({...singlecar,[name]:value})
        let amt= Amount(NewAmount.drop_date,e.target.value,singlecar.price)
        let newamt=Number(amt.amt)-singlecar.price
        SetNewAmount((prev)=>{return({...prev,amt:newamt})})
        
    }


    const ExtendTrip=async()=>
    {
        const {data}=await axios.put('https://drive-easy-customer-server.vercel.app/ExtendTrip',{singlecar:singlecar})
        if(data.action)
        {
            getActiveBookings(user.uid)
        }
        else 
        {
            alert('something went wron')
        }
        SetPaybtn(true)
        SetExtend(false)

    }

    const PayExtendAmount=()=>
    {
        SetPaybtn(false)
        var newamt=Number(singlecar.amount)+NewAmount.amt

        Setsinglecar((prev)=>{
            return(
                {
                    ...prev,amount:newamt
                }
            )
        })
    }

    if(loading)
    {
        <Loading/>
    }

    return(
        <>
        <Navbar/>
            <div className="ViewBookings">

<ConfigProvider
  theme={{ components: {Notification: {zIndexPopup:99999	  },}, token: {
    colorText:"white",
    colorSuccess:"white",
    colorError:"white"

},}}>          
  {contextHolder}
</ConfigProvider>

    <div className="ViewBookings-SideNav">
        <div className="ViewBookings-Service-Cards">
            <Link className="ViewBookings-Servicebtn" to='/ShowMap'>Our Service Centres</Link>
        </div>
        <div className="ViewBookings-Active-Cards">
            <h3>Active Bookings</h3>
            <h2>{BookingsCounts.Active}</h2>
        </div>
        <div className="ViewBookings-Past-Cards">
            <h3>Past Bookings</h3>
            <h2>{BookingsCounts.Past}</h2>
        </div>
        <div className="ViewBookings-Upcoming-Cards">
            <h3>Upcoming Bookings</h3>
            <h2>{BookingsCounts.Upcoming}</h2>
        </div>
    </div> 

    <div className="ViewBookings-CardDeck">
     {Extend?(
        <></>
     ):(
        <div className="ViewBookings-CardDeck-btns">
        <button ref={ActiveNavbar} onClick={()=>{getActiveBookings(user.uid)}}>Active</button>
        <button ref={PastNavbar} onClick={()=>getPastBookings(user.uid)}>Past</button>
        <button ref={UpcomingNavbar} onClick={()=>{getUpcomingBookings(user.uid)}}>Upcoming</button>
    </div>
     )}


        <Modal
            title={Active? "Conclude the journey ?" :"Cancel the Trip ?"}
            centered 
            open={confirm}
            okText={Active ? "Complete my Trip" : "Cancel my Trip"}
            cancelText={Active ? "Close" : Upcoming ? "Close" : ""}
            onOk={() => (Active ? EndTrip(true) : Upcoming && CancelTrip(true))}
            onCancel={() => (Active ? EndTrip(false) : Upcoming && CancelTrip(false))}
            okButtonProps={{
                style: {
                    color: 'white',
                    backgroundColor: '#333',
                },
            }}
            cancelButtonProps={{
                style: {
                    color: 'white',
                    backgroundColor: '#333',
                },
            }}
        >
            {Active?(
            <q>Congratulations on completing the journey! Your resilience turned miles into memories, and each stop brought you closer to your destination. Now, as you park the car, remember: Every finish line is the beginning of a new adventure.</q>

            ):
            (
                <div>
                    <q> I'm sorry to hear your plans changed, but remember, the road will always be there, waiting for your next adventure.</q>
                    <div className="ViewBooking-Cancel-Reason">
                        <b>Reason:</b>
                        <Select
                            placeholder='Choose your Reason'
                            value={Reason}
                            options={CancellationReasons}
                            onChange={(value)=>{SetReason(value)}}
                            style={{
                                width:300,
                                margin:'2%'
                            }}
                            />

                    </div>
                </div>
            )}
        </Modal>

    <Modal centered open={ViewMore} footer={null} closeIcon={false} width={1000} >
        <div className="ViewBookings-ViewMore-Details">
            <div className="ViewBookings-ViewMore-div-1">
            {ViewMore && <img src={fullsingledetails.cardetails.img} alt="CarImage" />}
            </div>

            <div className="ViewBookings-ViewMore-div-2">
                <h3>Car Details:</h3>
                <div>
                    <b>Name: </b><span>{ViewMore?(<>{fullsingledetails.cardetails.name}</>):("")}</span>
                </div>
                <div>
                    <b>Make: </b><span>{ViewMore?(<>{fullsingledetails.cardetails.make}</>):("")}</span>
                </div>
                <div>
                    <b>Model: </b><span>{ViewMore?(<>{fullsingledetails.cardetails.model}</>):("")}</span>
                </div>
                <div>
                    <b>Type: </b><span>{ViewMore?(<>{fullsingledetails.cardetails.type}</>):("")}</span>
                </div>
                <div>
                    <b>Fuel: </b><span>{ViewMore?(<>{fullsingledetails.cardetails.fuel}</>):("")}</span>
                </div>
                <div>
                    <b>Made Year: </b><span>{ViewMore?(<>{fullsingledetails.cardetails.year}</>):("")}</span>
                </div>
                <div>
                    <b>Total Fair: </b><span>{ViewMore?(<>&#8377;{fullsingledetails.bookingDetails.amount}</>):("")}</span>
                </div>
            </div>

            <div className="ViewBookings-ViewMore-div-3">
               <div className="ViewMore-Host">
               <h3>Host Details:</h3>
                <div>
                    <b>Name: </b><span>{ViewMore?(<>{fullsingledetails.sellerdetails.name}</>):("")}</span>
                </div>
                <div>
                    <b>Contact No: </b><span>{ViewMore?(<>{fullsingledetails.sellerdetails.phone}</>):("")}</span>
                </div>
               </div>
              <div className="ViewMore-Book">
              <h3>Booking Details:</h3>
                <div>
                    <b> Pick Up: </b><span>{ViewMore?(<>{fullsingledetails.bookingDetails.start_date.split('-')[2]}-{fullsingledetails.bookingDetails.start_date.split('-')[1]}-{fullsingledetails.bookingDetails.start_date.split('-')[0]}</>):("")}</span>
                </div>
                <div>
                    <b> Drop off: </b><span>{ViewMore?(<>{fullsingledetails.bookingDetails.drop_date.split('-')[2]}-{fullsingledetails.bookingDetails.drop_date.split('-')[1]}-{fullsingledetails.bookingDetails.drop_date.split('-')[0]}</>):("")}</span>
                </div>
              </div>
            </div>
        </div>

        <div className="ViewBookings-Modalbtns">
            <button onClick={()=>{SetViewMore(false)}}>Viewless</button>
        </div>
    </Modal>

      
      {ActiveCars.length?(<div className="ViewBookings-Card" >
        {Extend?(<div className="ViewBooking-Extend-Form">
            <div className="ViewBooking-Extend-Form-title">
                <button onClick={()=>{SetExtend(false)}}>
                    <ProfileCancelIcon width='30px' height='30px'/>
                </button>
                <h2>Continue your journey ..!</h2>
            </div>
            <div  className="ViewBooking-Extend-Form-Details">
            <div className="ViewBooking-Extend-Form-div">
                <div className="ViewBooking-Extend-Form-Details-div-1" >
                    <b>Pick up </b>
                    <input type="date" value={singlecar.start_date} readOnly />
                </div>  
                <div className="ViewBooking-Extend-Form-Details-div-2">
                    <b>Drop off</b>
                    <input type="date"  name="drop_date" min={NewAmount.drop_date}  value={singlecar.drop_date} onChange={DateChange} readOnly={Paybtn?false:true} />
                </div>
                <div className="ViewBooking-Extend-Form-Details-div-3">
                    <button><FareSummaryIcon/> Total fair:{Paybtn?(<> &#8377;{singlecar.amount} + &#8377;{NewAmount.amt}</>):(`${NewAmount.amt}`)} </button>
                </div>
            </div>
            <div className="ViewBooking-Extend-Payment">
                    <p>Scan the QR code to pay</p>
                    <QRCode
                        errorLevel="H"
                        value="https://ant.design/"
                        icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                    />
                    <p>Zoom Rental Services</p>
                    <p>+730******5</p>
                    <button  onClick={Paybtn ? PayExtendAmount : ExtendTrip}>{Paybtn?("Pay now"):("Extend my Trip")}</button>

            </div>            
                </div>
            
        
        </div>):(<>
            {ActiveCars.map((data)=>{
            return(
            <div className="ViewBookings-Car"  key={data._id} >
                <div className="ViewBookings-Car-Img-div">
                    <img src={data.cardetails.img} alt="" />
                </div>
                <div className="ViewBookings-Car-info-div">
                    <div className="ViewBookings-Car-div-1">
                        {Active?(<>
                            <button className="Tripbtns" ><StarFilled style={{color:'#333'}} /> Ontrip</button>
                        </>):(<>
                        
                        </>)}
                        {(Active || Upcoming) ?(<>
                        </>):(<>
                            <button className="TripbtnsPast" ><StarFilled style={{color:'#333'}}/> Past trip</button>
                        </>)}
                        {Upcoming?(<>
                            <button className="TripbtnsUpcoming"><StarFilled style={{color:'#333'}} /> Upcoming</button>
                        </>):(<>
                        
                        </>)}
                        <b>{data.cardetails.make} {data.cardetails.name}</b>
                    </div>
                     <div className="ViewBookings-Car-div-2">
                        <div className="ViewBookings-Car-startdate">
                            <b><CalendarFilled/> Pick-Up:</b>
                            <p>{data.bookingDetails.start_date.split('-')[2]}-{data.bookingDetails.start_date.split('-')[1]}-{data.bookingDetails.start_date.split('-')[0]}</p>
                        </div>
                        <div className="ViewBookings-Car-dropdate">
                           <b><CalendarFilled/> Drop-off:</b>
                           <p>{data.bookingDetails.drop_date.split('-')[2]}-{data.bookingDetails.drop_date.split('-')[1]}-{data.bookingDetails.drop_date.split('-')[0]}</p>
                        </div>
                     </div>
                     <div className="ViewBookings-Car-div-3">
                        <div className="ViewBookings-Car-amount">
                            <b>Total fair:</b>
                            <span><b>&#8377;</b>{data.bookingDetails.amount}</span>
                        </div>
                        <div className="ViewBookings-Car-Viewmore">
                        </div>
                     </div>
                     <div className="ViewBookings-Car-btns">
                    {Active?(<>
                        <button className="ViewBookings-Car-ActiveExtend" onClick={()=>{SetExtend(true),Setsinglecar({...data.bookingDetails,price:data.cardetails.price}),SetNewAmount({amt:0,drop_date:data.bookingDetails.drop_date})}}>Extend</button>
                        <button className="ViewBookings-Car-ActiveEnd" onClick={()=>{Setconfirm(true),Setsinglecar(data.bookingDetails)}}>End</button>
                    </>):(<>
                    </>)}
                    {Upcoming?(<>
                        <button className="ViewBookings-Car-Cancelbtn" onClick={()=>{Setconfirm(true),Setsinglecar(data.bookingDetails)}}>Cancel</button>
                    </>):(<></>)}
                    <button className="ViewBookings-Car-ViewMorebtn" onClick={()=>{SetViewMore(true),Setfullsingle(data)}}>View More</button>
                    </div>
                </div>
            
            </div>)
        })}
        
        </>)}

    </div>):(<div className="ViewBookings-Not-Found"> <Empty /></div>)}
    </div>
</div>
<Footer/>
        </>
    )    
}
export default ViewBooking;