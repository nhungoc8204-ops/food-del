import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } = useContext(StoreContext);
    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: "", lastName: "", email: "", street: "",
        city: "", state: "", zipcode: "", country: "", phone: ""
    })

    const [paymentMethod, setPaymentMethod] = useState("COD");

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item };
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        })
        
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 2, 
            paymentMethod: paymentMethod 
        }

        let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
        
        if (response.data.success) {
            if (paymentMethod === "COD") {
                alert("Order Placed Successfully! (Đặt hàng thành công)");
                setCartItems({});
                navigate("/myorders");
            } else if (paymentMethod === "VNPAY") {
                window.location.replace(response.data.session_url);
            }
        } else {
            alert("Error Placing Order");
        }
    }

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="multi-fields">
                    <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
                    <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
                </div>
                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
                <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
                <div className="multi-fields">
                    <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                    <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                </div>
                <div className="multi-fields">
                    <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
                    <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
                </div>
                <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
            </div>
            
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>{(getTotalCartAmount() * 25000).toLocaleString("vi-VN")}đ</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>{getTotalCartAmount() === 0 ? 0 : (2 * 25000).toLocaleString("vi-VN")}đ</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>{getTotalCartAmount() === 0 ? 0 : ((getTotalCartAmount() + 2) * 25000).toLocaleString("vi-VN")}đ</b>
                        </div>
                    </div>

                    <div className="payment-options" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <p style={{ fontWeight: 'bold' }}>Payment Method</p>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input type="radio" id="cod" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
                            <label htmlFor="cod" style={{ cursor: 'pointer' }}>Thanh toán khi nhận hàng (COD)</label>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input type="radio" id="vnpay" name="paymentMethod" value="VNPAY" checked={paymentMethod === "VNPAY"} onChange={() => setPaymentMethod("VNPAY")} />
                            <label htmlFor="vnpay" style={{ cursor: 'pointer' }}>Thanh toán trực tuyến (VNPay)</label>
                        </div>
                    </div>

                    <button type='submit'>PLACE ORDER</button>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder