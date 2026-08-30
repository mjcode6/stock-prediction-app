import React from 'react';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';
import { useContext, useState} from 'react';


const Header = () => {
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);
    const navigate = useNavigate();



    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false); // Update the logged-in state in AuthProvider
        console.log('Logged out successfully');
        navigate('/login'); // Redirect to the login page after logout
    }
    
    return (
        <>
        <nav className="navbar container pt-3 pb-3 align-items-start">
            <Link className="navbar-brand text-light" to="/">Stock Prediction Portal</Link>
            
            <div>
                {isLoggedIn ? (
                    <> 
                    <Button text="Tableau de bord" class="btn-info" url="/dashboard" />
                    &nbsp;
                    <button className="btn btn-danger" onClick={handleLogout}>Se déconnecter</button>
                    </>
                ) : (
                    <>
                        <Button text="Se connecter" class="btn-outline-info" url="/login" />
                        &nbsp;
                        <Button text="Inscription" class="btn-info" url="/register" />
                    </>
                )}
            </div>

        </nav>
        
        </>
    )
}

export default Header;