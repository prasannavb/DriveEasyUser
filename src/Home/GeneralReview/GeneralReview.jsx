//React
import React from "react";
import { useRef} from "react";

//Antd-Framework
import { Carousel ,ConfigProvider,Rate } from 'antd';
import { RightOutlined ,LeftOutlined} from '@ant-design/icons';

//CSS
import "./GeneralReview.css"

const GeneralReview=()=>
{
    const slideref=useRef()
    const reviews=[
    {
      id:1,
      img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTINoI2fn2ht8nT2bLAzc91WcOotoFg0SIOdg&usqp=CAU',
      name:'Alex Thompson',
      location:' New York City, USA',
      descriprion:'DriveEasy website impressed me with its sleek design and user-friendly interface. Reserving a Vitara Breeza was seamless, and the website clean layout made navigation a delight. A perfect blend of style and functionality!',
    },
    {
      id:2,
      img:"https://static9.depositphotos.com/1070812/1091/i/450/depositphotos_10916856-stock-photo-teacher-on-background-of-blackboard.jpg",
      name:'Sophia Reynolds',
      location:' Sydney, Australia',
      descriprion:'Booking a car on DriveEasy website was a breeze. The intuitive interface and straightforward process made it quick and efficient. From choosing pickup and drop-off locations to confirming the reservation, everything was smooth. Highly recommended!',
    },
    {
      id:3,
      img:'https://marvel-b1-cdn.bc0a.com/f00000000283318/home.dartmouth.edu/sites/home/files/styles/max_width_720px/public/news/images/20210601_kim_eb_017-crop.jpg?itok=WLALDO8U',
      name:' Mei Chen',
      location:'Shanghai, China',
      descriprion:'DriveEasy booking platform is incredibly user-friendly. I saved time thanks to the straightforward process. The ability to effortlessly choose pickup and drop-off locations enhanced my overall experience. Fantastic service!',
    },
    {
      id:4,
      img:'https://www.shutterstock.com/image-photo/portrait-young-woman-wearing-spectacles-260nw-1865153392.jpg',
      name:'Olivia Parker',
      location:'Rome, Italy',
      descriprion:'DriveEasy website sets the standard for hassle-free booking. I effortlessly reserved a Audi R8, and the entire process was user-friendly. The attention to detail and top-notch service make Zoom my go-to for car rentals.',
    },
    {
      id:5,
      img:'https://i0.wp.com/vitalrecord.tamhsc.edu/wp-content/uploads/2023/05/payne-vr.jpg?fit=1100%2C625&ssl=1',
      name:'Ava Mitchell',
      location:'Buenos Aires, Argentina',
      descriprion:'Navigating through DriveEasy website for my compact car reservation was a pleasure. The intuitive interface guided me seamlessly, and the wide range of car choices met all my needs. Thumbs up for the excellent user experience!'
    },
    {
      id:6,
      img:'https://img.freepik.com/premium-photo/successful-indian-female-student-with-group-college-students-classroom-university_466689-95593.jpg',
      name:'Aisha Patel',
      location:' Chennai,India',
      descriprion:'Consistency is key, and DriveEasy delivers every time. The websites seamless reservation process is why I keep coming back.The service  support provided by them was incredible!',
    }
  ]
    return (
          <div className="GeneralReview">
              <div className="GeneralReviews-title">
                  <h1>Our Testimonials </h1>
              </div>
              <div className="GeneralReview-Carosuel">
                 <div className="GeneralReview-leftbtn"> 
                        <button onClick={()=>{
                            slideref.current.prev()
                        }}><LeftOutlined  style={{fontSize:'40px',color:'white',cursor:'pointer'}} /></button>
                  </div>
                 <div className="GeneralReview-Card">
                    <ConfigProvider
                    theme={{
                    components: {
                      Carousel: {
                        dotWidth:20,
                        dotActiveWidth:21,
                        },
                      },
                      }}
                    >
                   <Carousel className="GeneralReview-ant" autoplay autoplaySpeed={2500} draggable pauseOnHover pauseOnDotsHover 
                    ref={slideref}
                    style={
                    {
                      width:"100%",
                      height: "55vh",
                    }
                    }
                   >
                   {reviews.map((data)=>
                         {
                             return(
                              <React.Fragment key={data.id}>
                               <div className="GeneralReview-div">
                               <div key={data.id} className="GeneralReview-div-1">
                                    <div className="GeneralReview-Img">
                                      <img className="circular--square" src={data.img} />
                                    </div>
                                    <div className="GeneralReview-details">
                                      <b>{data.name}</b>
                                      <b>{data.location}</b>
                                    </div>
                                </div> 
                                <div className="GeneralReview-div-2">
                                  <div><p>{data.descriprion}</p></div>
                                  <span>
                                    <Rate disabled defaultValue={5} 	/>
                                  </span>
                                </div>
                               </div>
                              </React.Fragment>
                             )
                         })}
                   </Carousel>
        </ConfigProvider>
                 </div>
                 <div className="GeneralReview-rightbtn"><button  onClick={()=>{
                            slideref.current.next()
                        }}><RightOutlined  style={{fontSize:'40px',color:'white',cursor:'pointer'}} /></button></div>
              </div>
          </div>
      )
  }
  
export default GeneralReview;