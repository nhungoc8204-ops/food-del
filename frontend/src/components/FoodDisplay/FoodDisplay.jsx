import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {
    // Lấy thêm searchTerm từ Context
    const { food_list, searchTerm } = useContext(StoreContext)

    return (
        <div className='food-display' id='food-display'>
            <h2>Những món ăn hàng đầu gần bạn</h2>
            <div className="food-display-list">
                {food_list.map((item, index) => {
                    // Logic lọc kết hợp danh mục (Category) và Từ khóa (Search)
                    if ((category === "All" || category === item.category) && 
                         item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                        return <FoodItem 
                                key={index} 
                                id={item._id} 
                                name={item.name} 
                                description={item.description} 
                                price={item.price} 
                                image={item.image} 
                              />
                    }
                    return null;
                })}
            </div>
        </div>
    )
}

export default FoodDisplay;