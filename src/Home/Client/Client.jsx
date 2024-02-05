//React
import { useEffect, useState } from 'react';
import axios from 'axios';

// CSS
import './Client.css';

const Client = () => {
  const [count, setCount] = useState({ usercount: 0, hostcount: 0, carcount: 0, Activebookingcount: 0 });
  const [runningCntUser, setRunningCntUser] = useState(1);
  const [runningCntHost, setRunningCntHost] = useState(0);
  const [runningCntCar, setRunningCntCar] = useState(0);
  const [runningCntActive, setRunningCntActive] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const getCount = async () => {
    try {
      const { data } = await axios.get('https://drive-easy-customer-server.vercel.app/Counts');
      setCount(data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  useEffect(() => {
    getCount();
  }, []);

  const [animationTriggered, setAnimationTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('Clients');
      if (element && !animationTriggered) {
        const rect = element.getBoundingClientRect();
        const isElementVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
        if (isElementVisible) {
          setIsVisible(true);
          setRunningCntUser(1);
          setRunningCntHost(0);
          setRunningCntCar(0);
          setRunningCntActive(0);
          setAnimationTriggered(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [animationTriggered]);

  useEffect(() => {
    let intervalIdUser;
    let intervalIdHost;
    let intervalIdCar;
    let intervalIdActive;

    if (isVisible && runningCntUser < count.usercount) {
      intervalIdUser = setInterval(() => {
        setRunningCntUser((prev) => prev + 1);
      }, 100);
    }

    if (isVisible && runningCntHost < count.hostcount) {
      intervalIdHost = setInterval(() => {
        setRunningCntHost((prev) => prev + 1);
      }, 100);
    }

    if (isVisible && runningCntCar < count.carcount) {
      intervalIdCar = setInterval(() => {
        setRunningCntCar((prev) => prev + 1);
      }, 100);
    }

    if (isVisible && runningCntActive < count.Activebookingcount) {
      intervalIdActive = setInterval(() => {
        setRunningCntActive((prev) => prev + 1);
      }, 100);
    }

    return () => {
      clearInterval(intervalIdUser);
      clearInterval(intervalIdHost);
      clearInterval(intervalIdCar);
      clearInterval(intervalIdActive);
    };
  }, [isVisible, runningCntUser, runningCntHost, runningCntCar, runningCntActive, count.usercount, count.hostcount, count.carcount, count.Activebookingcount]);

  return (
    <div id="Clients" className="Clients">
      <div className="Clients-cards">
        <h1 className="Clients-cards-info">{runningCntUser}</h1>
        <h4 className="Clients-cards-title">Clients</h4>
      </div>
      <div className="Clients-cards">
        <h1 className="Clients-cards-info">{runningCntHost}</h1>
        <h4 className="Clients-cards-title">Verified Seller</h4>
      </div>
      <div className="Clients-cards">
        <h1 className="Clients-cards-info">{runningCntCar}</h1>
        <h4 className="Clients-cards-title">Extensive Cars</h4>
      </div>
      <div className="Clients-cards">
        <h1 className="Clients-cards-info">{runningCntActive}</h1>
        <h4 className="Clients-cards-title">Bookings</h4>
      </div>
    </div>
  );
};

export default Client;
