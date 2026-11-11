import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios' // Đừng quên cài đặt và import axios nếu chưa có

const LoginPopup = ({ setShowLogin }) => {
    // Lấy url và hàm setToken từ Context
    const { url, setToken } = useContext(StoreContext)

    const [currState, setCurrState] = useState("Sign Up")
    
    // State lưu dữ liệu người dùng nhập vào
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    // Hàm lấy giá trị mỗi khi gõ phím
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    // Hàm xử lý khi bấm nút submit (Đăng nhập / Đăng ký)
    const onLogin = async (event) => {
        event.preventDefault()
        let newUrl = url;
        
        // Kiểm tra xem đang ở form nào để gọi đúng API
        if (currState === "Login") {
            newUrl += "/api/user/login"
        } else {
            newUrl += "/api/user/register"
        }

        // Gửi dữ liệu xuống Backend
        const response = await axios.post(newUrl, data);

        if (response.data.success) {
            // Đăng nhập thành công: Lưu token, lưu vào localStorage và tắt popup
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false)
        } else {
            // Thất bại: Báo lỗi
            alert(response.data.message)
        }
    }

    return (
        <div className='login-popup'>
            {/* Chuyển thẻ form thành onSubmit={onLogin} */}
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
                </div>
                
                <div className="login-popup-inputs">
                    {/* Bổ sung name, value, onChange cho từng input */}
                    {currState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                
                {/* Sửa button thành type='submit' */}
                <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
                
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
                
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup