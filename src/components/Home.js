import React, { useState } from 'react';
import './styles/Style.css';
import ProductsManager from './screens/ProductManager';
import CategoriesManager from './screens/CategoriesManager';

function Home() {
    const [valueSreen, setvalueSreen] = useState(1)
    return (
        <div className="containerHome">
            <div className='containerMenu'>
                <div className='containerTextHeader'>
                    <span className='textHeader'>
                        Admin
                    </span>
                </div>

                <button className='styleButton'
                    onClick={() => { setvalueSreen(1) }}>
                    Quản lý sản phẩm
                </button>

                <button className='styleButton'
                    onClick={() => { setvalueSreen(2) }}>
                    Quản lý loại hàng
                </button>
            </div>

            <div className='containerChillder'>
                {valueSreen === 1 && <ProductsManager />}
                {valueSreen === 2 && <CategoriesManager />}
            </div>
        </div>
    )
}

export default Home