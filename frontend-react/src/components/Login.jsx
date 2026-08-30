import React, {useState, useContext} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import  { AuthContext } from "../AuthProvider";  

const Login = () => {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const[error, setError] = useState('');
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext); // Access the setIsLoggedIn function from AuthProvider
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {username,password};
        console.log('Login data:', userData);

        try{      
            const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', userData);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            console.log('Login successful:', response.data);
            setIsLoggedIn(true); // Update the logged-in state in AuthProvider
            navigate('/');

        }catch(error){  
            console.error('Identifiants invalides');
            setError("Nom d'utilisateur ou mot de passe incorrect. Veuillez réessayer.");
        }finally{
            setLoading(false);
        }
    };
    return (
        <div className="container">
        <div className="row justify-content-center">
            <div className="col-md-6 bg-light-dark p-5 rounded">
            <h3 className="text-light text-center">Connectez-vous à notre portail</h3>
        <form onSubmit={handleLogin}>
        
            <div className="mb-3">
                <input type="text" className="form-control mb-3" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
                <input type="password" className="form-control mb-3" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <div className="text-danger mb-3">{error}</div>}

            {loading ? (<button type="submit" className="btn btn-info d-block mx-auto" disabled><FontAwesomeIcon icon={faSpinner} spin /> Connexion en cours...</button>): (
            <button type="submit" className="btn btn-info d-block mx-auto">Se connecter</button>
            )}

            
        </form>
        </div>
        </div>
    </div>
);
    
};

export default Login;