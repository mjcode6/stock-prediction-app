import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosinstance";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
    const [ticker, setTicker] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [plot, setPlot] = useState()
    const [ma100, setMA100] = useState()
    const [ma200, setMA200] = useState()
    const [prediction, setPrediction] = useState()
    const [mse,setMSE] = useState()
    const [rmse,setRMSE] = useState()
    const [r2,setR2] = useState()



    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await axiosInstance.get("/protected-view");

                console.log("Protected data:", response.data);
            } catch (error) {
                console.error("Error fetching protected data:", error);
                console.error("Status:", error.response?.status);
                console.error("Response:", error.response?.data);
            }
        };

        fetchProtectedData();
    }, []);

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setLoading(true)
        try{
            const response = await axiosInstance.post('/predict/',{
                ticker: ticker
            });
            console.log(response.data);
            const backendRoot = import.meta.env.VITE_BACKEND_ROOT;
            const plotURL = `${backendRoot}${response.data.plot_img}`
            const ma100URL = `${backendRoot}${response.data.plot_100_dma}`
            const ma200URL = `${backendRoot}${response.data.plot_200_dma}`
            const predictionURL = `${backendRoot}${response.data.plot_200_dma}`
            


            console.log("Backend root:", backendRoot);
            console.log("Backend response:", response.data);
            console.log("Final image URL:", plotURL);

            setPlot(plotURL);
            setMA100(ma100URL);
            setMA200(ma200URL);
            setPrediction(predictionURL);
            setMSE(response.data.mse);
            setRMSE(response.data.rmse);
            setR2(response.data.r2);
            // set plots

            if(response.data.error){
                setError(response.data.error)
            }

        }catch(error){
            console.error('there was an error making api request', error)
        }finally{
            setLoading(false)
        }

    }

    return (
        <div className="container">
    <div className="row">
        <div className="col-md-5 col-lg-4 mx-auto">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Stock Ticker"
                    onChange={(e) => setTicker(e.target.value)}
                    required
                />

                <small>{error && <div className="text-danger">{error}</div>}</small>

                <button
                    type="submit"
                    className="btn btn-info mt-3 "
                >
                {loading ? <span><FontAwesomeIcon icon={faSpinner} spin />Please wait...</span>: 'See Prediction'}
                </button>
            </form>
        </div>
        {/* print predction plots       */ }
        {prediction && (
            <div className="prediction mt-5">
            <div className="p-5 text-center">
              {plot && (
                        <img src={plot} style={{ maxWidth: '100%' }} />
                    )}
                    </div>
                    <div className="pt-3">
                        {ma100 &&(
                            <img src={ma100} style={{ maxWidth: '100%' }} />
                        )}

                    </div>
                    <div className="pt-3">
                        {ma200 &&(
                            <img src={ma200} style={{ maxWidth: '100%' }} />
                        )}

                    </div>
                     <div className="pt-3">
                        {prediction &&(
                            <img src={prediction} style={{ maxWidth: '100%' }} />
                        )}

                    </div>
                    <div className="text-light p-3">
                            <h4>Model Evaluation</h4>
                            <p>Mean squared Error (MSE):{ mse}</p>
                            <p> Root Mean squared Error (RMSE):{ rmse}</p>
                            <p>R-Squared (R2):{ r2}</p>
                    </div>
                    

        </div>
        )}
        

    </div>
</div>
    );
};

export default Dashboard;