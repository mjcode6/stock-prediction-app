
import react, {useState}from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Register = () => { 
    const[username, setUsername] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegistration = async (e) => {
        e.preventDefault();
        // Handle registration logic here
        setLoading(true);

        const userData = {
            username: username,
            email: email,
            password: password
        };
        try{
        const response =  await axios.post(`${import.meta.env.VITE_BACKEND_BASE_API}/register/`, userData)
                console.log('Registration successful:', response.data);
                console.log('registration successful:');
                setError({}); // Clear any previous errors on successful registration
                setSuccess(true); // Set success state to true
        }catch(error){
            setError("Erreur lors de l'inscription",error.response.data);
            console.error("Erreur lors de l'inscription :", error); 
        }finally{
            setLoading(false);
        }
    };

    return (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-md-6 bg-light-dark p-5 rounded">
            <h3 className="text-light text-center">Créer un compte</h3>
        <form onSubmit={handleRegistration}>
            <div className="mb-3">
                <input type="text" className="form-control mb-3" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
                <small>{error.username && <div className="text-danger">{error.username}</div>}</small>
            </div>
            <div className="mb-3">
                <input type="email" className="form-control mb-3" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                <small>{error.email && <div className="text-danger">{error.email}</div>}</small>
            </div>
            <div className="mb-3">
                <input type="password" className="form-control mb-3" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                <small>{error.password && <div className="text-danger">{error.password}</div>}</small>
            </div>
            {success && <div className="alert alert-success mb-3">Inscription réussie ! Vous pouvez maintenant vous connecter.</div>   }
            {loading ? (<button type="submit" className="btn btn-info d-block mx-auto" disabled><FontAwesomeIcon icon={faSpinner} spin /> Veuillez patienter...</button>): (
            <button type="submit" className="btn btn-info d-block mx-auto">Inscription</button>
            )}

            
        </form>
        </div>
        </div>
    </div>
);
};

export default Register;    