import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets' 
const AppDownload = () => {
  return (
    <div className='app-download-page'>
        <div className='app-download'>
            <p>Để có trải nghiệm tốt hơn, hãy tải xuống <br/>Ứng dụng Tomato</p>
            <div className="app-download-platforms">
                <img src={assets.play_store} alt="Play Store" />
                <img src={assets.app_store} alt="App Store" />
            </div>
        </div>
    </div>
  )
}

export default AppDownload