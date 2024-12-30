// Your line chart data (example)
var lineData = [{
    x: ['Electronics', 'Clothing', 'Furniture', 'Books', 'Toys'],
    y: [1650, 1200, 850, 600, 400],
    type: 'line'
}];

// Create the line chart
var lineLayout = {
    title: 'Category Sales - Line Chart'
};
Plotly.newPlot('lineChart', lineData, lineLayout);
