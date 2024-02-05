import ChatBot from 'react-simple-chatbot';
import React from 'react';
import { ThemeProvider } from 'styled-components';


const Chatbot=()=>
{
    const theme = {
        background: '#5f8fb',
        headerBgColor: '#333',
        headerFontColor: 'white',
        headerFontSize: '25px',
        botBubbleColor: '#386150',
        botFontColor: 'white',
        userBubbleColor: '#778f45',
        userFontColor: 'white',
      };

        return(
            <ThemeProvider theme={theme}>
        
            <ChatBot
              headerTitle="Car Companion"
             recognitionEnable={true}
             speechSynthesis={{ enable: true, lang: 'hi' }}
            //  botAvatar={bot}
            //  userAvatar={userbotimg}
             recognitionPlaceholder={"Listening"}
             enableMobileAutoFocus={true}
             enableSmoothScroll={true}
             width={"500px"}
             opened={true}
        
        
          steps={[
            {
              id: '1',
              message:`Hello mate.Welcome to Zoom cars`,
              trigger:'2'
            },
            {
              id: '2',
              message:'How can I help you today with your car rental needs?',
              trigger: '3',
            },
            {
              id:'3',
              placeholder:'choose an option',
              options: [
                { value:1, label: 'How can i book a car?', trigger: '4' },
                { value:2, label: 'What type of car available?', trigger: '5' },
                { value:3, label: 'Price Range of cars', trigger: '6' },
                { value:4, label: 'Where can i check my booking?', trigger: '7' },
                { value:5, label: 'Thanks', trigger: '8' },
        
              ],
            },
            {
              id:'4',
              message:'Login-->Select the travel dates-->Choose your car-->Pay-->Now enjoy your trip',
              trigger:'3',
            },
            {
              id:'5',
              message:'We have various options like compact, sedan, SUV, etc.',
              trigger:'3'
            },
            {
              id:'6',
              message:'We have wide range of cars starting from 100 upto 1000 charges/Day',
              trigger:'3'
        
            },
            {
              id:'7',
              message:"You find your car status at View Bookings",
              trigger:'3'
            },
            {
              id:'8',
              message:'Have a good Day!'
            }
          ]}
          
        />
        
        </ThemeProvider>
          )
}

export default Chatbot