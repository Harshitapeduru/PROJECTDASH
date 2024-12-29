import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
  import Card, { CardHeader, CardTitle, CardContent } from './ui/card'; 

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ rows: 0, columns: 0 });
  
  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:5000/api/data').then(res => res.json()),
      fetch('http://127.0.0.1:5000/api/summary').then(res => res.json())
    ]).then(([dataRes, summaryRes]) => {
      setData(dataRes);
      setSummary(summaryRes);
    }).catch(err => console.error('Error:', err));
  }, []);

  // Calculate summary statistics
  const totalSales = data.reduce((sum, item) => sum + item.total, 0);
  const totalItems = data.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueCategories = [...new Set(data.map(item => item.category))];
  
  // Data for category pie chart
  const categoryData = uniqueCategories.map(category => ({
    name: category,
    value: data.filter(item => item.category === category)
              .reduce((sum, item) => sum + item.total, 0)
  }));

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${totalSales.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Total Items Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalItems}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{uniqueCategories.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Avg. Sale Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ${data.length ? Math.round(totalSales / data.length).toLocaleString() : 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#4f46e5" name="Total Sales ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price ($)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total ($)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{item.product}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{item.category}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">${item.price}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">${item.total}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
//   import Card, { CardHeader, CardTitle, CardContent } from './ui/card'; 