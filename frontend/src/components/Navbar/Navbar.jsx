import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = () => {
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount, setSearchTerm } = useContext(StoreContext);

    return (
        <div className='navbar'>
            <Link to='/'><img src={assets.logo} alt="logo" className='logo' /></Link>
            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Trang chủ</Link>
                <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Thực đơn</a>
                <Link to='/app' onClick={() => setMenu("mobile app")} className={menu === "mobile app" ? "active" : ""}>Ứng dụng</Link>
                <a href='#footer' onClick={() => setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>Liên hệ</a>
            </ul>
            <div className="navbar-right">
                <div className="navbar-search">
                    {/* Thêm ô input tìm kiếm */}
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm món ăn..." 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    <img src={assets.search_icon} alt="search" />
                </div>
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="cart" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                <div className="navbar-profile">
                    <img src={assets.profile_icon} alt="profile" />
                </div>
            </div>
        </div>
    )
}

export default Navbar;