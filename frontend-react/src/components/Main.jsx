import React from 'react';
import Button from './Button';
import Headers from './Header';
import Footer from './Footer';

const Main = () => {
    return (
      <>
    
      <div className="container">
        <div className=" p-5 text-center bg-light-dark rounded">
            <h1 className="text-light">stock prediction portal</h1>
            <p className="text-light lead">Predict stock prices with our advanced machine learning algorithms.</p>
            <Button text="Login" class="btn-outline-info" url="/login" />
        </div>

      </div>
      
      </>
    )
}

export default Main;