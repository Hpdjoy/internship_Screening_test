import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Container, Typography, Grid, Paper } from '@mui/material';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function Stat() {
  const [data, setData] = useState([]);

  // Fetch and parse CSV on mount
  useEffect(() => {
    fetch('Data.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setData(result.data);
          },
          error: (error) => console.error('Error parsing CSV:', error),
        });
      })
      .catch((error) => console.error('Error fetching CSV:', error));
  }, []);

  // Calculate analytics
  const totalVehicles = data.length;

  const evTypeBreakdown = data.reduce((acc, row) => {
    acc[row['Electric Vehicle Type']] = (acc[row['Electric Vehicle Type']] || 0) + 1;
    return acc;
  }, {});

  const countyBreakdown = data.reduce((acc, row) => {
    acc[row['County']] = (acc[row['County']] || 0) + 1;
    return acc;
  }, {});

  const cafvEligibility = data.reduce((acc, row) => {
    acc[row['Clean Alternative Fuel Vehicle (CAFV) Eligibility']] = 
      (acc[row['Clean Alternative Fuel Vehicle (CAFV) Eligibility']] || 0) + 1;
    return acc;
  }, {});

  const electricRangeData = data.reduce((acc, row) => {
    const range = parseInt(row['Electric Range']) || 0;
    if (range > 0) {
      const rangeBucket = Math.floor(range / 50) * 50; // Bucket by 50-mile increments
      acc[rangeBucket] = (acc[rangeBucket] || 0) + 1;
    }
    return acc;
  }, {});

  // Chart data
  const evTypeChartData = {
    labels: Object.keys(evTypeBreakdown),
    datasets: [{
      data: Object.values(evTypeBreakdown),
      backgroundColor: ['#FF6384', '#36A2EB'],
    }],
  };

  const countyChartData = {
    labels: Object.keys(countyBreakdown).slice(0, 5), // Top 5 counties
    datasets: [{
      label: 'Vehicles by County',
      data: Object.values(countyBreakdown).slice(0, 5),
      backgroundColor: '#36A2EB',
    }],
  };

  const rangeChartData = {
    labels: Object.keys(electricRangeData).map(key => `${key}-${parseInt(key) + 49}`),
    datasets: [{
      label: 'Electric Range Distribution',
      data: Object.values(electricRangeData),
      backgroundColor: '#FFCE56',
    }],
  };

  const cafvChartData = {
    labels: Object.keys(cafvEligibility),
    datasets: [{
      data: Object.values(cafvEligibility),
      backgroundColor: ['#4BC0C0', '#FF9F40', '#9966FF'],
    }],
  };

  return (
    <Container maxWidth="lg" style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
      </Typography>

      <Grid container spacing={3}>
        {/* Total Vehicles */}
        <Grid item xs={12} sm={4}>
          <Paper style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h6">Total Vehicles</Typography>
            <Typography variant="h4">{totalVehicles}</Typography>
          </Paper>
        </Grid>

        {/* EV Type Breakdown */}
        <Grid item xs={12} sm={4}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6">EV Type Breakdown</Typography>
            <Pie data={evTypeChartData} />
          </Paper>
        </Grid>

        {/* CAFV Eligibility */}
        <Grid item xs={12} sm={4}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6">CAFV Eligibility</Typography>
            <Pie data={cafvChartData} />
          </Paper>
        </Grid>

        {/* Top Counties */}
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
