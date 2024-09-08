import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login'); 
    }, 4000);

    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="landing-page">
        <video autoPlay muted loop className="background-video">
          <source src="/assets/video1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="landing-content">
          <h1>Welcome to the Abstract's Travel App</h1>
          <p>Experience a seamless and efficient travel management system.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
