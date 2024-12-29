import React from 'react';
import { Bar } from 'react-chartjs-2';

const Chart = ({ data }) => {
    if (!data.length) return <p>No data for chart</p>;

    const chartData = {
        labels: data.map((row) => row.product || 'N/A'), // Use product as the label
        datasets: [
            {
                label: 'Sales Chart',
                data: data.map((row) => row.total || 0), // Use 'total' for sales data
                backgroundColor: 'rgba(75,192,192,0.6)',
            },
        ],
    };

    return <Bar data={chartData} />;
};

export default Chart;