import React, { useState } from 'react';
import Dashboard from './components/Dashboard';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return (
        <div className={isDarkMode ? 'dark bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}>
            <button
                className="fixed top-4 right-4 bg-indigo-500 text-white px-4 py-2 rounded-md"
                onClick={toggleDarkMode}
            >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Dashboard />
        </div>
    );
}

export default App;
