import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from './DataTable';
import Chart from './Chart';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({});

    useEffect(() => {
        console.log("Fetching data...");
        axios.get('http://127.0.0.1:5000/api/data') // Ensure this is correct
            .then((response) => {
                console.log("Data fetched:", response.data);
                setData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    
        axios.get('http://127.0.0.1:5000/api/summary') // Ensure this is correct
            .then((response) => {
                console.log("Summary fetched:", response.data);
                setSummary(response.data);
            })
            .catch((error) => {
                console.error("Error fetching summary:", error); 
            });
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Summary</h2>
            <p>Rows: {summary.rows}</p>
            <p>Columns: {summary.columns}</p>
            <h2>Data Table</h2>
            <DataTable data={data} />
            <h2>Chart</h2>
            <Chart data={data} />
        </div>
    );
};

export default Dashboard;