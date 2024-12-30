import React from 'react';

const DataTable = ({ data }) => {
  if (!data || !data.length) return <p>No data available</p>;

  const keys = Object.keys(data[0]);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            {keys.map((key) => (
              <th
                key={key}
                style={{
                  padding: '10px',
                  textAlign: 'left',
                  border: '1px solid #ddd',
                  whiteSpace: 'nowrap', // Prevent header text from wrapping
                }}
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {keys.map((key) => (
                <td
                  key={key}
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', // Prevent text from wrapping
                    overflow: 'hidden', // Ensure overflow is hidden
                  }}
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
