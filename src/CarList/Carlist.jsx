//React
import axios from "axios";
import { useEffect,useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Slice
import {  FillCarNumber, Filldetails } from "../Slice/CarSLice";
import  { FillFilter, FillFilterDate, FillFilterOut } from "../Slice/FilterSlice";
import { FillSelectedCars, FillSelectedCarsOut } from "../Slice/SelectedCars";

//Modules
import Booking from "./Booking/Booking";
import Navbar from "../Navbar/Navbar";
import Footer from "../Home/Footer/Footer";
import Loading from '../Loading/Loading'

//CSS
import "./Carlist.css"

//Antd-Framework
import { Slider,Rate,ConfigProvider,Input,Modal } from "antd";
import { CalendarFilled } from '@ant-design/icons';

//CustomSVGIcons
import {CarIcon,FuelIcon,GearIcon,FASTTagIcon} from '../SVGIcons/SvgComponent'

//Images
import NotFoundImage from '../Images/NotFound/NotFound.png'

const Carlist=(props)=>
{
    const user=useSelector((state)=>state.user)
    const [loading,Setloading]=useState(true)
    const [selectedCars, setSelectedCars] = useState({location:false,Fuel:[],Make:[],Model:[],Type:[]});
    const [cars,Setcars]=useState([]);
    const [MinDate,SetMinDate]=useState()
    const [status,Setstatus]=useState()
    const [singlecar,Setsinglecar]=useState({})
    const [Filterpopup,SetFilterpopup]=useState(false)

    const [FetchCars,SetFetch]=useState(false)
    const [isArray,SetArray]=useState(true)
    const [Bookdata,Setbookdata]=useState({uid:`${user.uid}`,start_date:'',drop_date:'',status:'BookingDetails'})
    const [Fuel,SetFuel]=useState([])
    const [Make,SetMake]=useState([])
    const [Model,SetModel]=useState([])
    const [Type,SetType]=useState([])
    const [isBook,SetBookAuth]=useState(false) 
    const [FilterDetails,SetFilterDetails]=useState({location:'',status:'FilterDetails',Fuel:[],Make:[],Model:[],Type:[],price:[],ratings:'0',start_date:Bookdata.start_date,drop_date:Bookdata.drop_date})
    const [AvailableCars,SetAvailableCars]=useState()

    const[searchvalue,Setsearchvalue]=useState()
    const [pricevalue,Setpricevalue]=useState([200,500])
    const FilterRef=useRef(null)
    const carslice=useSelector((state)=>state.cardetails)
    const filterslice=useSelector((state)=>state.FilterDetails)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const desc = ['1', '2', '3', '4', '5'];
    const {Search}=Input
   
    const getCarDetails=async()=>
    {
        const {data}=await axios.get("https://drive-easy-customer-server.vercel.app/findCars");
        Setcars(data)
        SetAvailableCars(data)
        SetArray(true)
        Setloading(false)
    }

    const getFilters=async()=>
    {
        const {data}=await axios.get("https://drive-easy-customer-server.vercel.app/FiltersMetaData")
        SetFuel(data[0].Fuel)
        SetMake(data[0].Make)
        SetModel(data[0].Model)
        SetType(data[0].Type)
    }
    
    useEffect(()=>{
        getFilters()
    },[])
    
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
    useEffect(()=>{
      MiniDate()
    },[])

    const getSingleCarDetails=async(car_no)=>
    {
      const {data}=await axios.post("https://drive-easy-customer-server.vercel.app/findsinglecar",{car_no});
      SetBookAuth(true)
      Setsinglecar(data)
      Setloading(false)

    }

    useEffect(()=>{
      if(carslice.start_date!=="" && carslice.drop_date!=="" && carslice.bookAuth && user.isAuth)
      {
        Setbookdata((prev)=>{return({...prev,start_date:carslice.start_date,drop_date:carslice.drop_date})})
        getSingleCarDetails(carslice.car_no)
      }
      else
      {
        getCarDetails()  
      }
    },[])

    const BookingChange=(e)=>
    {
      const {name,value}=e.target;
      Setbookdata((prev)=>{return({...prev,[name]:value})})
    }

    const FilterChange = (e,id) => {
      const { name, value } = e.target;
      const isChecked = e.target.checked;

      if (isChecked) {
        if (name === "location") {
          SetFilterDetails((prev) => ({...prev,location:`${user.location}`}));
          setSelectedCars((prev)=>({...prev,location:true}));
        } 
        else if (name === "Fuel") 
        {
          SetFilterDetails((prev) => ({...prev,Fuel: [...prev.Fuel, value]}));
          setSelectedCars((prev)=>({...prev,Fuel:[...prev.Fuel,id]}));
        } 
        else if (name === "Model")
        {
          SetFilterDetails((prev) => ({...prev,Model: [...prev.Model, value]}));
          setSelectedCars((prev)=>({...prev,Model:[...prev.Model,id]}));
        } 
        else if (name === "Make") 
        {
          SetFilterDetails((prev) => ({...prev, Make: [...prev.Make, value]}));
          setSelectedCars((prev)=>({...prev,Make:[...prev.Make,id]}));
        } 
        else if (name === "Type") 
        {
          SetFilterDetails((prev) => ({...prev,Type: [...prev.Type, value]}));
          setSelectedCars((prev)=>({...prev,Type:[...prev.Type,id]}));
        } 
      } 
      else 
      {
        if (name === "location") {
          SetFilterDetails((prev) => ({...prev,location:''}));
          setSelectedCars((prev) => ({ ...prev, location:false }));
        } else if (name === "Fuel") {
          SetFilterDetails((prev) => ({...prev,Fuel: prev.Fuel.filter((item) => item !== value)}));
          const filteredCars = selectedCars.Fuel.filter((car) => car !== id);
          setSelectedCars((prev) => ({ ...prev, Fuel: filteredCars }));
        } 
        else if (name === "Model") 
        {
          SetFilterDetails((prev) => ({...prev,Model: prev.Model.filter((item) => item !== value)}));
          const filteredCars = selectedCars.Model.filter((car) => car !== id);
          setSelectedCars((prev) => ({ ...prev, Model: filteredCars }));
  
        } 
        else if (name === "Make") 
        {
          SetFilterDetails((prev) => ({...prev,Make: prev.Make.filter((item) => item !== value)}));
          const filteredCars = selectedCars.Make.filter((car) => car !== id);
          setSelectedCars((prev) => ({ ...prev, Make: filteredCars }));
        } 
        else if (name === "Type") 
        {
          SetFilterDetails((prev) => ({...prev,Type: prev.Type.filter((item) => item !== value)}));
          const filteredCars = selectedCars.Type.filter((car) => car !== id);
          setSelectedCars((prev) => ({ ...prev, Type: filteredCars }));
        } 
      }
    };
  
    const ApplyFilter=async()=>
    {
       if(user.isAuth)
       {
        const {data}=await axios.post('https://drive-easy-customer-server.vercel.app/findAvailableCars',FilterDetails)
        dispatch(FillFilter(FilterDetails))
        dispatch(FillSelectedCars(selectedCars))
          if(Array.isArray(data))
            {
              SetArray(true)
              Setcars(data)
              SetAvailableCars(data)
              SetFetch(true)
               
            }
            else
            {
              dispatch(FillFilterOut())
              Setpricevalue([200,500])
              setSelectedCars({location:false,Fuel:[],Make:[],Model:[],Type:[]})
              Setstatus(data)
              SetArray(false) 
              SetFetch(false)
              SetFilterDetails({location:'',status:'FilterDetails',Fuel:[],Make:[],Model:[],Type:[],price:[],ratings:0,start_date:Bookdata.start_date,drop_date:Bookdata.drop_date})
            }
       }
       else
       {
        navigate('/Login')
       }
    }

    const ApplyFilterbtn=()=>
    {
      if(FetchCars)
      {
        ApplyFilter()
      }
      else
      {
        alert('choose the dates')
      }
      SetFilterpopup(false)
    }

    const Find=async()=>
    {
        if(user.isAuth)
        {
            dispatch(Filldetails(Bookdata))
            if((Bookdata.start_date!=="" && Bookdata.drop_date!==""))
            {
              if(Bookdata.start_date!=="")
              {
                  var {data}=await axios.post('https://drive-easy-customer-server.vercel.app/findAvailableCars',Bookdata);
              }
              else
              {
                  var {data}=await axios.post('https://drive-easy-customer-server.vercel.app/findAvailableCars',carslice)
              }
              if(Array.isArray(data))
              {
                SetArray(true)
                Setcars(data)
                SetAvailableCars(data)
                SetFetch(true)
                setSelectedCars({location:false,Fuel:[],Make:[],Model:[],Type:[]})
                dispatch(FillSelectedCarsOut())
                dispatch(FillFilter({location:'',Fuel:[],Make:[],Model:[],Type:[],price:[],ratings:0}))
                SetFilterDetails({location:'',status:'FilterDetails',Fuel:[],Make:[],Model:[],Type:[],price:[],ratings:0,start_date:`${Bookdata.start_date}`,drop_date:`${Bookdata.drop_date}`})                            
              }
              else
              {
                Setstatus(data)
                SetArray(false)
                SetFetch(false)
              }
            }
            else
            {
                alert("Choose thee Date")
            }
        }
        else
        {
          navigate("/Login")
        }
  }

 
    const BookCar = (data) => {
        dispatch(FillCarNumber({car_no:data.car_no}))
        Setsinglecar(data)
        SetBookAuth(true)
      };
      
      const ClearFilter = async () => {
        Setpricevalue([200,500])
        setSelectedCars({location:false,Fuel:[],Make:[],Model:[],Type:[]})
        SetFilterDetails({location:'',status:'FilterDetails',Fuel:[],Make:[],Model:[],Type:[],price:[],ratings:'0',start_date:`${Bookdata.start_date}`,drop_date:`${Bookdata.drop_date}`})                
        dispatch(FillFilterOut());
        dispatch(FillSelectedCarsOut())
        Find();
      };
      

      const Value=async()=>
      {
        dispatch(Filldetails({start_date:Bookdata.start_date,drop_date:Bookdata.drop_date}))
        dispatch(FillFilterDate({start_date:Bookdata.start_date,drop_date:Bookdata.drop_date}))
        if(filterslice.FilterAuth)
        {
          SetFilterDetails((prev)=>{return({...prev,start_date:Bookdata.start_date,drop_date:Bookdata.drop_date})})
          FilterDetails.start_date=Bookdata.start_date;
          FilterDetails.drop_date=Bookdata.drop_date
          ApplyFilter()
        }
        else
        {
          Find()
        }
      } 
      const onChangeComplete = (value) => {
        SetFilterDetails((prev) => ({
          ...prev,
          price:value,}))
      };

      const onchangeprice=(value)=>
      {
        Setpricevalue(value)

      }

      const SearchChange=async(value)=>
      {

        if(Bookdata.start_date!=="" && Bookdata.drop_date!=="" && FetchCars)
        {
          value=value.charAt(0).toUpperCase()+value.slice(1)
          const ListofCars=cars.filter((car)=> car.name.match(value.trim()) || car.make.match(value.trim()) || car.model.match(value.trim()))
          if(value==="")
          {
            Setcars(AvailableCars)
            SetArray(true)
            SetFetch(true)
            Setsearchvalue('')
          }
          else
          {
            Setsearchvalue(value)
            if(ListofCars.length>0)
            {
              Setcars(ListofCars)
              SetArray(true)
              SetFetch(true)
            }
            else
            {
              let status={
                "status": "We're sorry, but there are no cars available for the selected date.",
                "message": "Please consider the following options:",
                "options": [ 
                  "Try Searching using different names.",
                  "Check for availability on nearby dates.",
                  "Contact our support team for assistance."
                ]
              }
              Setstatus(status)
              SetArray(false)
            }
          }
        }

      }

      const SearchInput=(_e)=>
      {
          if(Bookdata.start_date!=="" && Bookdata.drop_date!=="")
          {
            SearchChange(_e)
          }
          else
          {
            alert("Choose the date")
          }
      }

    const ClearEachFilter=(fname)=>
    {
        if(fname==='Location')
        {
          SetFilterDetails((prev) => ({...prev,location:''}));
          setSelectedCars((prev) => ({ ...prev, location:false }));
        }
        else if(fname==='Fuel')
        {
          SetFilterDetails((prev) => ({...prev,Fuel: []}));
          setSelectedCars((prev) => ({ ...prev, Fuel:[]}));
        }
        
        else if(fname==='Make')
        {
          SetFilterDetails((prev) => ({...prev,Make: []}));
          setSelectedCars((prev) => ({ ...prev, Make:[]}));
        }
        
        else if(fname==='Model')
        {
          SetFilterDetails((prev) => ({...prev,Model: []}));
          setSelectedCars((prev) => ({ ...prev, Model:[]}));
        }
        
        else if(fname==='Type')
        {
          SetFilterDetails((prev) => ({...prev,Type: []}));
          setSelectedCars((prev) => ({ ...prev, Type:[]}));
        }
        
        else if(fname==='price')
        {
          SetFilterDetails((prev) => ({...prev,price: []}));
          Setpricevalue([200,500])
        }
        else if(fname==='ratings')
        {
          SetFilterDetails((prev) => ({...prev,ratings:'0' }));
        }
    }
   
    if(loading)
    {
      return <Loading/>
    }

  return( 
    <>
      <Navbar/>
      <ConfigProvider
        theme={{
        token: {
          colorBgMask:"rgba(0, 0, 0, 0.80)"	,
          zIndexPopupBase:"9999",
          colorIcon:"rgba(0, 0, 0, 0.88)"
        },
         }}
      >
      <Modal title="Filters" width={1450}  footer={null} centered open={Filterpopup} okText={"Extend"}  cancelText={"Cancel"} onOk={()=>{SetFilterpopup(false)}} onCancel={()=>{SetFilterpopup(false)}}>
      <div ref={FilterRef} className="Filter-close-div"> 
        <div  className="Filters">
          <div className="Filter-Maindiv-1">
            <div className="Filter-Subdiv-1">
              <b>Fuel</b>
             <div  className="Fuel-div">
                {Fuel.map((data)=>{
                  return(
                    <div key={data.id} className="Filter-Fuel">
                                   <input type="checkbox"    checked={selectedCars.Fuel.includes(data.id)} onChange={(e)=>{FilterChange(e,data.id)}} name="Fuel" value={data.fuel} />
                        <label htmlFor={data.fuel}>{data.fuel}</label>
                    </div>
                  )
                })}
              </div>
              <button onClick={()=>{ClearEachFilter('Fuel')}} className="Filter-Clearbtn">Clear</button>
            </div>
            <div className="Filter-Subdiv-2">
              <b>My Location</b>
              <div  className="Location-div">
                <div className="Filter-Location">
                  <input type="checkbox"   checked={selectedCars.location} onChange={(e)=>{FilterChange(e)}} name="location" value={user.location} />
                  <label >{user.location}</label>
                </div>
              </div>
              <button onClick={()=>{ClearEachFilter('Location')}} className="Filter-Clearbtn">Clear</button>
            </div>
          </div>

        <div className="Filter-Maindiv-2">
            <b>Make </b>
            <div  className="Make-div">
              {Make.map((data)=>{
                return(
                  <div key={data.id} className="Filter-Make" >
                    <input type="checkbox"   checked={selectedCars.Make.includes(data.id)} onChange={(e)=>{FilterChange(e,data.id)}} name="Make" value={data.make} autoComplete="on" />
                    <label htmlFor={data.make}>{data.make}</label>
                  </div>
                )
              })}
              <button onClick={()=>{ClearEachFilter('Make')}} className="Filter-Clearbtn">Clear</button>
             </div>
          </div>
                               
        <div className="Filter-Maindiv-3">
            <b>Model</b>
            <div  className="Model-div">
              {Model.map((data)=>{
                  return(
                  <div key={data.id} className="Filter-Model">
                    <input type="checkbox"   checked={selectedCars.Model.includes(data.id)} onChange={(e)=>{FilterChange(e,data.id)}} name="Model" value={data.model} />
                    <label htmlFor={data.model}>{data.model}</label>
                  </div>
                  )
              })}
              <button onClick={()=>{ClearEachFilter('Model')}} className="Filter-Clearbtn">Clear</button>
            </div>
         </div>
 
                               <div className="Filter-Maindiv-4">
                                  <div className="Filter-Subdiv-1">
                                  <b>Type</b>
                                   <div   className="Type-div">
 
                                   {Type.map((data)=>{
                                       return(
                                       <div key={data.id} className="Filter-Type">
                                               <input type="checkbox"   checked={selectedCars.Type.includes(data.id)} onChange={(e)=>{FilterChange(e,data.id)}} name="Type" value={data.type} />
                                               <label htmlFor={data.type}>{data.type}</label>
                                           </div>
                                       )
                                   })}
                                   </div>
                                   <button onClick={()=>{ClearEachFilter('Type')}} className="Filter-Clearbtn">Clear</button>
 
                                  </div>
 
 
                                   <div className="Filter-Subdiv-2">
                                    <b>Price</b>
                                <ConfigProvider
                                theme={{
                                  components: {
                                    Slider: {
                                      handle:{background:'https://media.slidesgo.com/storage/5374516/driving-center1619097122.jpg'},
                                      handleActiveColor:"#333",
                                      handleColor:"#333"
                                    },
                                  },
                                }}>
                                    <Slider  range={true}  min={100} max={999} value={pricevalue} onChange={onchangeprice} onChangeComplete={onChangeComplete}   
                                   styles={{track:{background:"red"},rail:{background:"green"},handleColor:"#333" }} />
 
 
                                </ConfigProvider>
                                <button className="Filter-Clearbtn" onClick={()=>{ClearEachFilter('price')}}>Clear</button>
 
                                </div>
                                <div className="Filter-Subdiv-3">
                                <div className="Filter-Ratings">
                                <b>Ratings</b>
                                <div>
                                <Rate tooltips={desc} defaultValue={0} value={FilterDetails.ratings} onChange={(value)=>{SetFilterDetails((prev)=>({...prev,ratings:value}))}}/>
 
                                </div>
 
                                <button onClick={()=>{ClearEachFilter('ratings')}} className="Filter-Clearbtn">Clear</button>
                                </div>
                              </div>
                               </div>
         </div> 
                    
                                <div className="Filter-btns">
                                  <button className="ApplyFilter" onClick={()=>{ApplyFilterbtn()}}>Apply Filter</button>
                                  <button className="ClearFilter" onClick={ClearFilter}>Clear All</button>
                                </div>
                       </div> 
                </Modal>
 
          </ConfigProvider>


            {isBook?(<>
              <Booking data={singlecar}  FilterDetails={FilterDetails} Setpricevalue={Setpricevalue} selectedCars={selectedCars} isBook={isBook} SetBookAuth={SetBookAuth} Bookdata={Bookdata} Find={Find} ApplyFilter={ApplyFilter}/>
            </>):(
                  <>
                  <div className="CarsList">
                    {isArray?(<>
                           
                               
                                <div className="CarsList-CardDeck">
                                  <div className="CarsList-Dates-div">
                                    
                                    <div className="TryFilters-div">
                                      <button className="TryFiltersbtn" onClick={()=>{SetFilterpopup(true)}}>Try filters </button>
                                    </div>
                                    <div className="CarsList-Dates-Search">
                                    
                                        <Search  placeholder="Eg:- Search by name,make,model" size="large" allowClear onChange={(e)=>{SearchChange(e.target.value)}} 
                                        onSearch={SearchInput}  value={searchvalue}    enterButton  />                                  
                                     
                                    </div>
                                    <div className="CarsList-Dates">
                                      <div className="CarsList-PickUp">
                                        <b><CalendarFilled /> Pick Up Date:</b>
                                        <input type="date" onChange={BookingChange} name="start_date" min={MinDate} value={Bookdata.start_date} required/>
                                      </div>
                                      <div className="CarsList-ReturnDate">
                                        <b><CalendarFilled /> Drop off Date:</b>
                                        <input type="date" onChange={BookingChange} name="drop_date"  min={MinDate} value={Bookdata.drop_date} required/>
                                      </div>
                                      <div className="CarsList-Date-FindCarbtns">
                                        <button onClick={Value}>Find Cars</button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="CarsList-Cards">
                                    {cars.map((data)=>{
                                              return(
                                              <div className="CarsList-Cards-Car" key={data._id} data-aos="zoom-in" data-aos-duration="1000">
                                                <div className="CarsList-Cars-Img-div">
                                                  <img src={data.img} alt="CarImage" className="CarsList-Car-Img" />
                                                </div>
                                                <div className="CarsList-Cars-div">
                                                    <div className="CarsList-Cars-div-1">
                                                      <h2>{data.make} {data.name} {data.year}</h2>
                                                    </div>
                                                    <div className="CarsList-Cars-div-2">
                                                        <span><GearIcon width='20px' height='15px'/> {data.type}</span>
                                                        <span><FuelIcon width='20px' height='20px'/>  {data.fuel}</span>
                                                          <span><CarIcon width='20px' height='20px'/>  {data.model}</span>
                                                    </div>
                                                    <div className="CarsList-Cars-div-3">
                                                        <Rate  disabled value={parseFloat(data.ratings)} allowHalf={true} />
                                                    </div>
                                                    <div className="CarsList-Cars-div-4">
                                                        <div className="CarsList-Cars-Price">
                                                          <h3>&#8377;{data.price}/Day</h3>
                                                        </div>
                                                        <div className="CarsList-Cars-Tag">

                                                          <p><FASTTagIcon width='20px' height='15px'/> Active FASTTag</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
  
                                                <div className="CarsList-Cards-Cars-btns">
                                                  {FetchCars?(<><button onClick={()=>{BookCar(data)}}>Book</button></>):(<></>)}
                                                </div>
                                      </div>
                                               )
                                          })}
                                          
                                    </div>
                                </div>
                               </>):
                              (<div className="Not-Found-List">
                                  <div className="CarsList-Dates-div">
                                    <div className="CarsList-Dates-Search">
                                    <Search  placeholder="Eg:- Search by name,make,model" size="large" allowClear onChange={(e)=>{SearchChange(e.target.value)}} 
                                        onSearch={SearchInput}  value={searchvalue}    enterButton />  
                                    </div>
                                    <div className="CarsList-Dates">
                                      <div className="CarsList-PickUp">
                                        <b><CalendarFilled /> Pick Up Date:</b>
                                        <input type="date" onChange={BookingChange} name="start_date" min={MinDate} value={Bookdata.start_date} required/>
                                      </div>
                                      <div className="CarsList-ReturnDate">
                                        <b><CalendarFilled /> Drop off Date:</b>
                                        <input type="date" onChange={BookingChange} name="drop_date"  min={MinDate} value={Bookdata.drop_date} required/>
                                      </div>
                                      <div className="CarsList-Date-FindCarbtns">
                                        <button onClick={Value}>Find Cars</button>
                                      </div>
                                    </div>
                                  </div>
                                     <div className="Not-Found-Status-div">
                                        <div className="Not-Found-Img-div">
                                          <img src={NotFoundImage} alt="NotFound" className="Not-Found-Img" />
                                        </div>
                                        <div className="Not-Found-Status">
                                          <p>{status.status}</p>
                                          <p>{status.message}</p>
                                          <ul>
                                            <li>{status.options[0]}</li>
                                            <li>{status.options[1]}</li>
                                            <li>{status.options[2]}</li>
                                           </ul>
                                        </div>
                                     </div>
                              </div>)}

                                    </div>
                                    
</>
            )}
            <Footer/>
        </>

            

)
}

export default Carlist;