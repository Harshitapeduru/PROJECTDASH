// Your pie chart data (example)
var pieData = [{
    values: [1650, 1200, 850, 600, 400],
    labels: ['Electronics', 'Clothing', 'Furniture', 'Books', 'Toys'],
    type: 'pie'
}];

// Create the pie chart
var pieLayout = {
    title: 'Category Sales'
};
Plotly.newPlot('pieChart', pieData, pieLayout);

// Your other chart data (example for bar chart)
var barData = [{
    x: ['Electronics', 'Clothing', 'Furniture', 'Books', 'Toys'],
    y: [1650, 1200, 850, 600, 400],
    type: 'bar'
}];

// Create the bar chart
var barLayout = {
    title: 'Category Sales - Bar Chart'
};
Plotly.newPlot('barChart', barData, barLayout);

// Function to update other charts based on pie chart selection
function updateCharts(selectedCategory) {
    // Update bar chart data based on selected category
    var updatedBarData = [{
        x: [selectedCategory],
        y: [getCategoryValue(selectedCategory)], // Function to get the value of the selected category
        type: 'bar'
    }];
    
    // Update the bar chart using Plotly
    Plotly.react('barChart', updatedBarData, barLayout);

    // You can update line charts or other charts in a similar manner
    var updatedLineData = [{
        x: [selectedCategory],
        y: [getCategoryValue(selectedCategory)],
        type: 'line'
    }];
    
    // Update the line chart
    Plotly.react('lineChart', updatedLineData, {});
}

// Function to get the value of a selected category
function getCategoryValue(category) {
    const categoryValues = {
        'Electronics': 1650,
        'Clothing': 1200,
        'Furniture': 850,
        'Books': 600,
        'Toys': 400
    };
    return categoryValues[category] || 0;
}

// Listen for clicks on the pie chart and update other charts
document.getElementById('pieChart').on('plotly_click', function(eventData){
    // Get the category selected from the pie chart
    var selectedCategory = eventData.points[0].label;
    console.log('Selected Category: ', selectedCategory); // For debugging

    // Call the function to update other charts
    updateCharts(selectedCategory);
});
