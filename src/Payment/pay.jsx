//React
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Slice
import { FillOutCarNumber } from "../Slice/CarSLice";

//modules
import Amount from "../Amount/Amount";
import Loading from '../Loading/Loading'

//CSS
import './pay.css'

//CustomSVGIcons
import { LocationIcon,TimeIcon ,PaypalIcon, VisaIcon,ProfileTickIcon,RupeeIcon} from "../SVGIcons/SvgComponent";

//Antd-Framework
import { CalendarFilled ,QuestionCircleFilled,InfoCircleFilled,CarFilled,UserOutlined,LeftCircleFilled} from '@ant-design/icons';
import { QRCode, Tooltip,Divider,notification,ConfigProvider,Steps,Breadcrumb   } from "antd";

//Images
import PayImage from '../Images/Pay/PayImage.jpg'

const Pay=()=>
{
    const user=useSelector((state)=>state.user)

    const [loading,Setloading]=useState(true)
    const [singlecardetails,Setsinglecar]=useState({})
    const [Payformdata,SetPayForm]=useState({uid:user.uid,Card_number:'',CVV:'',expiry_date:'',Coupon:'',Biller_name:'',start_date:sessionStorage.getItem('start_date'),drop_date:sessionStorage.getItem('drop_date'),car_no:sessionStorage.getItem('car_no'),amount:'',sid:sessionStorage.getItem('sid')})
    const [Errmsg,SetErrmsg]=useState({Card_number:'',CVV:'',expiry_date:'',Biller_name:''})
    const [Ack,SetAck]=useState(false)
    const [MinDate,SetMinDate]=useState()
    const [PaymentMethod,SetPaymentMethod]=useState("VISA")
    const[amount,Setamount]=useState()
    const [CouponCode,SetCouponCode]=useState()    
    const Duration=useRef()
    const Visa=useRef();
    const Gpay=useRef();
    const Paypal=useRef()

    const Navigate=useNavigate()
    const dispatch=useDispatch()
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (message) => {
        message.includes('Succesfully')?(   api.success({
            message: message,
            placement:"topRight",
            duration:2,
            style: {
                background:"#5cb85c	",
              }
          })):(
            api.error({
                message: message,
                placement:"topRight",
                duration:3,
                style: {
                    background:"rgb(223, 67, 67)",
                  }
              })
          )
    };

const getCarDetails=async()=>
{
    
    const car_no=sessionStorage.getItem("car_no")
    const start_date=sessionStorage.getItem("start_date")
    const drop_date=sessionStorage.getItem("drop_date")
    
    const {data}=await axios.post("https://drive-easy-customer-server.vercel.app/findsinglecar",{car_no})
    Setsinglecar(data)
    Setsinglecar((prev)=>{
        return(
            {...prev,start_date:start_date,drop_date:drop_date}
        )
    })

    let amt= Amount(start_date,drop_date,data.price)
    if(amt.duration===1)
    {
        Duration.current="1 Day"
    }
    else
    {
        Duration.current=`${amt.duration} Days`
    }
    Setamount(amt.amt)
    Setloading(false)
}

const MiniDate=()=>
{
    let date=new Date().getDate()
    let month=new Date().getMonth()+1
    let year=new Date().getFullYear()
    let formattedMonth = month < 10 ? `0${month}` : month;
    let formattedDay = date < 10 ? `0${date}` : date;
  
    let day = `${year}-${formattedMonth}-${formattedDay}`;
    SetMinDate(day);
}

const CardType=(type)=>
{   
    if(type==='VISA')
    {
        Visa.current.style.border="2px solid rgb(223, 67, 67)";
        Gpay.current.style.border="none";
        Paypal.current.style.border="none";

    }
    else if(type==='Gpay')
    {
        Gpay.current.style.border="2px solid rgb(223, 67, 67)";
        Visa.current.style.border="none";
        Paypal.current.style.border="";

    }
    else if(type==="PayPal")
    {
        Paypal.current.style.border="2px solid rgb(223, 67, 67)";
        Visa.current.style.border="none";
        Gpay.current.style.border="";

    }
    SetErrmsg({Card_number:'',CVV:'',expiry_date:'',Biller_name:''})
}

    useEffect(()=>
    {
        if(user.isAuth && sessionStorage.getItem('car_no'))
        {
            getCarDetails();
            MiniDate()
        }
        else
        {
            if(!user.isAuth)
            {
                Navigate("/Login")
            }
            else
            {
                Navigate("/Carlist")
            }
        }
    },[])
    const BackToHome=()=>
    {
        Navigate('/')
    }
 

    const Close=()=>
    {
       Navigate("/Carlist") 
    }

    const PayChange=(e)=>
    {
        const {name,value}=e.target
        SetPayForm({...Payformdata,[name]:value.trim()})
    }

    const ValidateForm=()=>
    {

        if(Payformdata.Card_number==="" || Payformdata.Card_number===null)
        {
            SetErrmsg((prev)=>{return({...prev,Card_number:'Enter the Card number'})})
            SetAck(true)
        }
        else if(Payformdata.Card_number.length!=16)
        {
            SetErrmsg((prev)=>{return({...prev,Card_number:'Enter valid Card number'})})
            SetAck(true)
        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,Card_number:''})})
            SetAck(false)

        }
        if(Payformdata.CVV==="" || Payformdata.CVV===null )
        {
            SetErrmsg((prev)=>{return({...prev,CVV:'Enter the CVV'})})
            SetAck(true)

        }
        else if(Payformdata.CVV.length!==3)
        {
            SetErrmsg((prev)=>{return({...prev,CVV:'Enter a valid CVV'})})
            SetAck(true)   
        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,CVV:''})})
            SetAck(false)

        }
        if(Payformdata.expiry_date==="" || Payformdata.expiry_date===null)
        {
            SetErrmsg((prev)=>{return({...prev,expiry_date:'Enter the expiry date'})})
            SetAck(true)

        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,expiry_date:''})})
            SetAck(false)

        }
        if(Payformdata.Biller_name==="" || Payformdata.Biller_name===null)
        {
            SetErrmsg((prev)=>{return({...prev,Biller_name:'Enter the card holder name'})})
            SetAck(true)

        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,Biller_name:''})})
            SetAck(false)
        }

        if(Payformdata.Card_number!=="" && Payformdata.Card_number.length===16 && Payformdata.CVV!=="" && Payformdata.CVV.length===3 && Payformdata.Biller_name!=="" && Payformdata.expiry_date!=="")
        {
            Payformdata.amount=amount
            PaySubmit()
        }
    }

    const PaySubmit=async()=>
    {
        const {data}=await axios.post('https://drive-easy-customer-server.vercel.app/Pay',Payformdata)
        if(data.action)
        {
            sessionStorage.removeItem('car_no')
            dispatch(FillOutCarNumber())
            openNotification('Payment Succesfull,Car booked Succesfully')
            setTimeout(()=>{
                Navigate('/')
            },2000)
        }
        else
        {
            dispatch(FillOutCarNumber())
            sessionStorage.removeItem('car_no')
            alert(data.status)
            Navigate('/Carlist')
        }
    }

    const ApplyCoupon=async()=>
    {
       if(CouponCode==='' || CouponCode===null)
       {

       }
       else
       {
            if(sessionStorage.getItem('AppliedCode')!==Payformdata.car_no)
            {
                const {data}=await axios.post('https://drive-easy-customer-server.vercel.app/ApplyCoupon',{CouponCode,amount})
                if(data.action)
                {
                    Setamount(data.newamount)
                    openNotification(data.status)
                    sessionStorage.setItem('AppliedCode',Payformdata.car_no)
                }
                else
                {
                    openNotification(data.status)
                
                }
            }
            else
            {
                openNotification('Only one coupon code is allowed to apply for 1 car')
            }
        }
    }

    const ApplyCouponChange=(e)=>
    {
        SetCouponCode(e.target.value)
    }


    if(loading)
    {
        return <Loading/>
    }
    return(
        <div className="Pay">

            <div className="Pay-Nav">
                <button onClick={Close}><LeftCircleFilled style={{color:'#fff',fontSize:"40px",cursor:'pointer'}} /></button>
            </div>
            <div className="Pay-banner">
                <div className='Pay-banner-overlay'>
                    <div>
                        <h2>Payment Details</h2>
                    </div>
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
                          title:<p onClick={BackToHome}  className='BreadCrumbs-item'>Home</p>,
                            },
                            {
                              title: <p onClick={Close}  className='BreadCrumbs-item'>Our Cars</p>,
                            },
                            {
                                title: <p  onClick={Close} className='BreadCrumbs-item'>{singlecardetails.name}</p>,
                            },
                            {
                              title: <p  className='BreadCrumbs-item'>Payment Details</p>,
                            },
                    ]}
                />
</ConfigProvider>
                </div>
            </div>
           <div className="Pay-Alert-Warning">
                <marquee >
                   <InfoCircleFilled style={{ marginLeft:'1%'}}/> The price is fixed.Complete the payment before 10mins
                   <InfoCircleFilled style={{ marginLeft:'1%'}}/> Once Coupon is applied then same coupon cannot be used again! be careful before applying  </marquee>
           </div>
           <div className="Pay-Steps" data-aos='zoom-in' data-aos-duration='1000'>
           <Steps
           className='Pay-Steps-Meter'
    items={[
      {
        title: 'Login',
        status: 'finish',
        icon:<UserOutlined style={{color:'#333',fontSize:'30px'}} />
      },
      {
        title: 'Choose Dates',
        status: 'finish',
        icon:<CalendarFilled style={{color:'#333',fontSize:'30px'}}/>
      },
      {
        title: 'Find your car',
        status: 'finish',
        icon:<CarFilled style={{color:'#333',fontSize:'30px'}} />
      },
      {
        title: 'Payment',
        status: 'process',
        icon:<RupeeIcon width='30px' height='30px'/>
      },
    ]}
  />
           </div>
            
            <div className="Payment-Details-div">

            <div className="Pay-CarDetails" data-aos='fade-up' data-aos-duration='1500'>
            <div className="Pay-CarDetails-div-2">
                    <div className="Pay-CarDetails-table">
                        <div className="Pay-CarDetails-table-1">
                            <div>
                                <b> Pick Up Location:</b>
                                <p><LocationIcon width='20px' height='20px'/>{singlecardetails.location}</p>
                            </div>
                            <div>
                                <b>Pick Up Date:</b>
                                <p><CalendarFilled style={{marginRight:'2%'}} /> {singlecardetails.start_date.split('-')[2]}-{singlecardetails.start_date.split('-')[1]}-{singlecardetails.start_date.split('-')[0]} </p>
                            </div>
                            <div>
                                <b>Time:</b>
                                <p><TimeIcon width='20px' height='20px' />00:00 AM</p>
                            </div>
                        
                           
                        </div>
                        <div className="Pay-CarDetails-table-2">
                        <div>
                                <b> Return Location:</b>
                                <p><LocationIcon width='20px' height='20px'/>{singlecardetails.location}</p>
                            </div>
                            <div>
                                <b>Return Date:</b>
                                <p><CalendarFilled style={{marginRight:'2%'}}  />{singlecardetails.drop_date.split('-')[2]}-{singlecardetails.drop_date.split('-')[1]}-{singlecardetails.drop_date.split('-')[0]} </p>
                            </div>
                            
                            <div>
                                <b>  Time:</b>
                                <p><TimeIcon width='20px' height='20px' />11:59 PM</p>
                            </div>
                         
                        </div>
                        <div className="Pay-CarDetails-table-3">

                            <div>
                                <b>Duration:</b>
                                <p>{Duration.current}</p>
                            </div>
                            
                            <div>
                                <b>Price/Day:</b>
                                <p><b>&#8377;</b> {singlecardetails.price}</p>
                            </div>
                            
                            <div>
                                <b>Subtotal:</b>
                                <p><b>&#8377;</b> {amount}</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className="Pay-CarDetails-div-3">
                        <h2>Your Trip Includes:</h2>
                        <p><ProfileTickIcon width='20px' height='20px' /> Registration Fee/Road Tax</p>
                        <p><ProfileTickIcon width='20px' height='20px' /> Breakdown Assistance</p>
                        <p><ProfileTickIcon width='20px' height='20px' /> Security Deposit</p>
                        <p><ProfileTickIcon width='20px' height='20px' /> Fully Comphrensive Insurance</p>
                </div>
                <div className="Pay-CarDetails-div-1">
                    <div className="Pay-CarDetails-logo">
                        <h2>{singlecardetails.name}-{singlecardetails.year}</h2>
                        <img src={singlecardetails.img} alt="CarImage" />

                    </div>
                </div>
             
            </div>
                 <div className="Pay-CreditCard" data-aos='fade-up' data-aos-duration='1500'>
                <div className="Pay-CreditCard-div-1">
                    <h2>PAYMENT DETAILS</h2>
                </div>
                <div className="Pay-CreditCard-div-2">
                    <div className="VISA-CARD" ref={Visa} onClick={()=>{SetPaymentMethod('VISA'),CardType("VISA")}}>
                    <b><VisaIcon width='50px' height='50px'  /></b>
                    <p>Debit/Credit Cards</p>
                    </div>
                    <div ref={Paypal}  onClick={()=>{SetPaymentMethod('UPI'),CardType("PayPal")}}>
                    <b><PaypalIcon width='50px' height='50px'/></b>
                    <p>PayPal</p>
                    </div>
                    <div ref={Gpay} onClick={()=>{SetPaymentMethod('UPI'),CardType("Gpay")}}>
                    <b><PaypalIcon width='50px' height='50px' /></b>
                    <p>Gpay</p>
                    </div>
                </div>
                {PaymentMethod==="VISA"?(<>
                    <Divider/>
                    <div className="Pay-CreditCard-div-3">
                    <div className="Pay-CreditCard-Details-div-1">
                        <label htmlFor="">CREDIT CARD NUMBER<Tooltip placement="right" title="16-digit number">
                                  <QuestionCircleFilled  style={{color:"#314ca4",cursor:"pointer"}} />
                             </Tooltip></label>
                        <input type="number" name="Card_number" min={0} onChange={PayChange} placeholder="Card number" required />
                        {Ack?(<span>{Errmsg.Card_number}</span>):(<span>{Errmsg.Card_number}</span>)}  
                    </div>
                            
                    <div className="Pay-CreditCard-Details-div-2">
                        <label htmlFor="">CARD HOLDER NAME<Tooltip placement="right" title="Biller's name">
                                  <QuestionCircleFilled  style={{color:"#314ca4",cursor:"pointer"}} />
                             </Tooltip></label>
                        <input type="text"  name="Biller_name" onChange={PayChange} placeholder="Card Holder name" required />
                        {Ack?(<span>{Errmsg.Biller_name}</span>):(<span>{Errmsg.Biller_name}</span>)}
                    </div>
                    
                    <div className="Pay-CreditCard-Details-div-3">
                    <div className="Pay-CreditCard-Details-ExpDate">
                            <label htmlFor="">EXPIRATION DATE  <Tooltip placement="right" title="Validity date">
                                  <QuestionCircleFilled  style={{color:"#314ca4",cursor:"pointer"}} />
                             </Tooltip></label>
                            <input type="date" name="expiry_date" min={MinDate} onChange={PayChange} placeholder="Expiry date" required />
                            {Ack?(<span>{Errmsg.expiry_date}</span>):(<span>{Errmsg.expiry_date}</span>)}    
                        </div>    
                        <div className="Pay-CreditCard-Details-CVV">
                            <label htmlFor="">CVV  <Tooltip placement="right" title="3-digit code">
                                   <QuestionCircleFilled  style={{color:"#314ca4",cursor:"pointer"}} />
                             </Tooltip>
                             </label>
                            <input type="number" name="CVV" min={0} onChange={PayChange} placeholder="CVV" required />
                            {Ack?(<span>{Errmsg.CVV}</span>):(<span>{Errmsg.CVV}</span>)}
                        </div> 
                    </div>
                    </div>
                </>):(
                    <>
                    {PaymentMethod==="UPI"?(<>
                    <Divider/>
                        <div className="Pay-UPI">
                            <div>
                                <p>Scan the QR code to pay</p>
                                <QRCode
                                    errorLevel="H"
                                    value="https://ant.design/"
                                    icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                                />
                                <p>Zoom Rental Services</p>
                                <p>+730******5</p>
                            </div>
                        </div>
                    </>):(<>
                      
                    </>)}
                    
                    </>
)}
                    <div className="Pay-CreditCard-Details-div-4">
                        <button onClick={ValidateForm}>Pay Now</button>
                    </div>
                    <div className="Pay-CreditCard-Details-div-5">
                        <img src={PayImage} alt="PayImage" />
                    </div>
            </div>
                <div className="Pay-CreditCard-ApplyCoupon" data-aos='fade-up' data-aos-duration='1500'>
                    <div>
                        <p>Coupon <Tooltip placement="right" title="10 character code">
                                  <QuestionCircleFilled  style={{color:"#314ca4",cursor:"pointer"}} />
                             </Tooltip></p>
                        <input type="text" maxLength={10} onChange={ApplyCouponChange}  autoComplete="off" placeholder="Coupon Code" />
                        <button onClick={ApplyCoupon}>Apply Coupon</button>
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
            </div>

        </div>
    )
}

export default Pay;