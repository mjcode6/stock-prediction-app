import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosinstance";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
    const [ticker, setTicker] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [plot, setPlot] = useState()

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
            const plotURL = `${backendRoot}${response.data.plot_img}`;

            console.log("Backend root:", backendRoot);
            console.log("Backend response:", response.data);
            console.log("Final image URL:", plotURL);

setPlot(plotURL);
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
        <div className="prediction mt-5">
            <div className="p-5 text-center">
              {plot && (
                        <img src={plot} style={{ maxWidth: '100%' }} />
                    )}


            </div>

        </div>

    </div>
</div>
    );
};

export default Dashboard;