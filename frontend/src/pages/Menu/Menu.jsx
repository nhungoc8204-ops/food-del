import React, { useState } from 'react'
import './Menu.css'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'

const Menu = () => {
    // Quản lý trạng thái danh mục món ăn (chuyển từ Home sang đây)
    const [category, setCategory] = useState("All");

    return (
        <div>
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
        </div>
    )
}

export default Menu