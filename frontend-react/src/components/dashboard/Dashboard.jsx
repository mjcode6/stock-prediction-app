import {useEffect, useState} from 'react'
import axiosInstance from '../../axiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
    const [ticker, setTicker] = useState('')
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [plot, setPlot] = useState()
    const [ma100, setMA100] = useState()
    const [ma200, setMA200] = useState()
    const [prediction, setPrediction] = useState()
    const [mse, setMSE] = useState()
    const [rmse, setRMSE] = useState()
    const [r2, setR2] = useState()

    useEffect(()=>{
        const fetchProtectedData = async () =>{
            try{
                const response = await axiosInstance.get('/protected-view/');
            }catch(error){
                console.error('Error fetching data:', error)
            }
        }
        fetchProtectedData();
    }, [])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axiosInstance.post('/predict/', {
         ticker: ticker,
    });

    console.log(response.data);

    if (response.data.error) {
        setError(response.data.error);
        return;
    }

    const backendRoot = import.meta.env.VITE_BACKEND_ROOT.replace(/\/$/, '');

    setPlot(`${backendRoot}${response.data.plot_img}`);
    setMA100(`${backendRoot}${response.data.plot_100_dma}`);
    setMA200(`${backendRoot}${response.data.plot_200_dma}`);
    setPrediction(`${backendRoot}${response.data.plot_prediction}`);

    setMSE(response.data.mse);
    setRMSE(response.data.rmse);
    setR2(response.data.r2);

} catch (error) {
    console.error(
        "Une erreur s'est produite lors de la communication avec l'API.",
        error.response?.data || error.message
    );

    setError(
        error.response?.data?.error ||
        "Impossible d'obtenir la prédiction. Veuillez réessayer."
    );
} finally {
    setLoading(false);
}
    }

  return (
    <div className='container'>
        <div className="row">
            <div className="col-md-6 mx-auto">
                <form onSubmit={handleSubmit}>
                    <input type="text" className='form-control' placeholder='Saisir un ticker boursier' 
                    onChange={(e) => setTicker(e.target.value)} required
                    />
                    <small>{error && <div className='text-danger'>{error}</div>}</small>
                    <button type='submit' className='btn btn-info mt-3'>
                        {loading ? <span><FontAwesomeIcon icon={faSpinner} spin />Veuillez patienter...</span>: 'Lancer la prédiction'}
                    </button>
                </form>
            </div>

            {/* Print prediction plots */}
            {prediction && (
                <div className="prediction mt-5">
                <div className="p-3">
                    {plot && (
                        <img src={plot} style={{ maxWidth: '100%' }} />
                    )}
                </div>

                <div className="p-3">
                    {ma100 && (
                        <img src={ma100} style={{ maxWidth: '100%' }} />
                    )}
                </div>

                <div className="p-3">
                    {ma200 && (
                        <img src={ma200} style={{ maxWidth: '100%' }} />
                    )}
                </div>

                <div className="p-3">
                    {prediction && (
                        <img src={prediction} style={{ maxWidth: '100%' }} />
                    )}
                </div>

                <div className="text-light p-3">
                    <h4>Évaluation du modèle</h4>
                    <p>Erreur quadratique moyenne (MSE): {mse}</p>
                    <p>Racine de l'erreur quadratique moyenne (RMSE): {rmse}</p>
                    <p>Coefficient de détermination (R²): {r2}</p>
                </div>

            </div>
            )}
            

        </div>
    </div>
  )
}

export default Dashboard