import React, { useState } from 'react';
import Header from './Header';
import { Outlet } from "react-router-dom";

function Layout() {
    const [libraryId, setLibraryId] = useState(localStorage.getItem('libraryId') ? parseInt(localStorage.getItem('libraryId')) : null);
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        localStorage.setItem('libraryId', inputValue);
        setLibraryId(parseInt(inputValue));
    };

    return (
        <>
            <Header />
            {libraryId ? <Outlet /> 
            : (
                <div className="library-input-container">
                    <p className='code'>הכנס קוד ספריה</p>
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    <button onClick={handleSubmit}>אישור</button>
                </div>
            )}
        </>
    );
}

export default Layout;
