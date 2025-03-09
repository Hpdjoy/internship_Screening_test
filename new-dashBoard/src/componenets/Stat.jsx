import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Container, Typography, Grid, Paper } from '@mui/material';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function Stat() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('Data.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => setData(result.data),
          error: (error) => console.error('Error parsing CSV:', error),
        });
      })
      .catch((error) => console.error('Error fetching CSV:', error));
  }, []);

  const totalVehicles = data.length;

  const evTypeBreakdown = data.reduce((acc, row) => {
    if (row['Electric Vehicle Type']) {
      acc[row['Electric Vehicle Type']] = (acc[row['Electric Vehicle Type']] || 0) + 1;
    }
    return acc;
  }, {});

  const countyBreakdown = data.reduce((acc, row) => {
    if (row['County']) {
      acc[row['County']] = (acc[row['County']] || 0) + 1;
    }
    return acc;
  }, {});

  const cafvEligibility = data.reduce((acc, row) => {
    if (row['Clean Alternative Fuel Vehicle (CAFV) Eligibility']) {
      acc[row['Clean Alternative Fuel Vehicle (CAFV) Eligibility']] =
        (acc[row['Clean Alternative Fuel Vehicle (CAFV) Eligibility']] || 0) + 1;
    }
    return acc;
  }, {});

  const brandSales = data.reduce((acc, row) => {
    if (row['Make']) {
      acc[row['Make']] = (acc[row['Make']] || 0) + 1;
    }
    return acc;
  }, {});

  // Fix: Define electric range distribution
  const electricRangeData = data.reduce((acc, row) => {
    const range = parseInt(row['Electric Range'], 10);
    if (!isNaN(range)) {
      const rangeBucket = Math.floor(range / 50) * 50; // Group ranges in 50-unit intervals
      acc[rangeBucket] = (acc[rangeBucket] || 0) + 1;
    }
    return acc;
  }, {});

  const evTypeChartData = {
    labels: Object.keys(evTypeBreakdown),
    datasets: [{ data: Object.values(evTypeBreakdown), backgroundColor: ['#FF6384', '#36A2EB'] }],
  };

  const countyChartData = {
    labels: Object.keys(countyBreakdown).slice(0, 5),
    datasets: [{ label: 'Vehicles by County', data: Object.values(countyBreakdown).slice(0, 5), backgroundColor: '#36A2EB' }],
  };

  const cafvChartData = {
    labels: Object.keys(cafvEligibility),
    datasets: [{ data: Object.values(cafvEligibility), backgroundColor: ['#4BC0C0', '#FF9F40', '#9966FF'] }],
  };

  const brandSalesChartData = {
    labels: Object.keys(brandSales).sort(),
    datasets: [{ label: 'Sales by Comapny', data: Object.values(brandSales), backgroundColor: '#8A2BE2' }],
  };

  const rangeChartData = {
    labels: Object.keys(electricRangeData).map(key => `${key}-${parseInt(key) + 49}`),
    datasets: [{
      label: 'Electric Range Distribution',
      data: Object.values(electricRangeData),
      backgroundColor: '#FFCE56',
    }],
  };

  return (
    <Container maxWidth="lg" style={{ padding: '20px' }}>
      <Grid container spacing={2}>
        {/* Top Statistic Boxes */}
        {[
          { title: 'Total Vehicles', value: totalVehicles },
          { title: 'EV Type Breakdown', chart: <Pie data={evTypeChartData} /> },
          { title: 'CAFV Eligibility', chart: <Pie data={cafvChartData} /> },
        ].map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper style={{ padding: '20px', textAlign: 'center', height: '100%' }}>
              <Typography variant="h6">{item.title}</Typography>
              {item.value !== undefined ? (
                <Typography variant="h4">{item.value}</Typography>
              ) : (
                <div style={{ height: '200px' }}>{item.chart}</div>
              )}
            </Paper>
          </Grid>
        ))}

        {/* Model Year Sales Chart */}
        <Grid item xs={12}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6">Sales by Model Year</Typography>
            <Bar data={brandSalesChartData} options={{ scales: { y: { beginAtZero: true } } }} />
          </Paper>
        </Grid>

        {/* Other Charts */}
        <Grid item xs={12} sm={6}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6">Top Counties by Vehicle Count</Typography>
            <Bar data={countyChartData} options={{ scales: { y: { beginAtZero: true } } }} />
          </Paper>
        </Grid>

        {/* Electric Range Distribution */}
        <Grid item xs={12} sm={6}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6">Electric Range Distribution</Typography>
            <Bar data={rangeChartData} options={{ scales: { y: { beginAtZero: true } } }} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Stat;
