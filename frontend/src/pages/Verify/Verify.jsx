import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const orderId = searchParams.get("vnp_TxnRef");
    const responseCode = searchParams.get("vnp_ResponseCode");
    
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        const success = responseCode === "00" ? true : false;
        
        const response = await axios.post(url + "/api/order/verify", { success, orderId });
        if (response.data.success) {
            navigate("/myorders"); 
        } else {
            navigate("/"); 
        }
    }

    useEffect(() => {
        if(orderId && responseCode){
            verifyPayment();
        }
    }, [])

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify