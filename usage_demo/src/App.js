import React, { useState } from 'react';
import SimpleMonthPicker from 'react-dj-simple-month-picker';

import './App.css';


const period = {
    min: 2022,
    max: 2100,
    initialYear: 2022
};

const language = {
    months: {
        name: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
        shortName: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    }
};

export default function App() {
    const [ pickerVisible, setPickerVisible ] = useState(false);
    const [ selectedMonthYear, setSelectedMonthYear ] = useState(null);

    const _handlePickerChange = ({ year, month }) => {
        console.log("Month selection changed >>> ", { year, month });
        setSelectedMonthYear({ year, month });
    }
    
    const _handlePickerSelect = ({ year, month }) => {
        console.log("Month selected >>> ", { year, month });
        setSelectedMonthYear({ year, month });
        _hideMonthPicker();
    }
    
    const _hideMonthPicker = () => {
        setPickerVisible(false);
    }
    
    const _showMonthPicker = () => {
        setPickerVisible(true);
    }
    
    
    return (
        <div className="main-app">
            <h1>DJ Simple Month Picker Demonstration</h1>
            <h2>Welcome to DJ Simple Month Picker react component.</h2>
            <p>DJ Simple React Month-Picker component that renders a month selection box or band with responsive layout that support period and language configuration.</p>

            <button type="button" onClick={() => _showMonthPicker()}>
                {selectedMonthYear ? `Year:${selectedMonthYear.year} / Month: ${selectedMonthYear.month}` : "Pick a month"}
            </button>

            <SimpleMonthPicker
                value={selectedMonthYear}
                visible={pickerVisible}
                dismissOnEsc={true}
                theme="dark"
                monthMask="MMMM/Y"
                period={period}
                language={language}
                onChange={_handlePickerChange}
                onSelect={_handlePickerSelect}
                onDismiss={_hideMonthPicker}
            /> 

        </div>
    );
}
