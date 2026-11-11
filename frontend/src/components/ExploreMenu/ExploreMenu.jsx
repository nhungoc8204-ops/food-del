import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

// Nhận props category và setCategory từ Home.jsx truyền xuống
const ExploreMenu = ({ category, setCategory }) => {
    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Khám phá thực đơn của chúng tôi</h1>
            <p className='explore-menu-text'>Chọn từ thực đơn đa dạng bao gồm nhiều món ăn hấp dẫn. Sứ mệnh của chúng tôi là thỏa mãn cơn thèm ăn và nâng tầm trải nghiệm ẩm thực của bạn, từng bữa ăn đều đúng ý của bạn.</p>
            <div className="explore-menu-list">
                {menu_list.map((item, index) => {
                    return (
                        /* Khi click vào div này, cập nhật category */
                        <div onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} key={index} className='explore-menu-list-item'>

                            {/* Thêm class "active" nếu category đang được chọn để tạo viền */}
                            <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt={item.menu_name} />

                            <p>{item.menu_name}</p>
                        </div>
                    )
                })}
            </div>
            <hr />
        </div>
    )
}

export default ExploreMenu