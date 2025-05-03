import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import io from 'socket.io-client';

const SecurityChart = ({ ticker, historicalData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const socketRef = useRef(null);
  const [realtimeData, setRealtimeData] = useState([]);

  // Connect to WebSocket and set up real-time updates
  useEffect(() => {
    // Connect to Socket.io
    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';
    socketRef.current = io(SOCKET_URL);
    
    // Subscribe to chart updates for this ticker
    socketRef.current.emit('subscribeChart', ticker);
    
    // Listen for bar updates
    socketRef.current.on('barUpdate', (bar) => {
      if (bar.symbol === ticker) {
        setRealtimeData(prev => {
          // Add new bar to the array
          const updated = [...prev, {
            date: new Date(bar.timestamp).toISOString().split('T')[0],
            open: bar.open,
            high: bar.high,
            low: bar.low,
            close: bar.close,
            volume: bar.volume
          }];
          
          // Keep only the most recent 100 bars
          return updated.slice(-100);
        });
      }
    });
    
    // Cleanup socket connection
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [ticker]);

  // Initialize and update chart
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Destroy any existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    // Combine historical and real-time data
    let chartData = [...(historicalData || [])];
    
    // Add real-time data that isn't already in historical data
    if (realtimeData.length > 0) {
      const lastHistoricalDate = chartData.length > 0 ? 
        chartData[chartData.length - 1].date : '';
        
      const newRealtimeData = realtimeData.filter(
        bar => bar.date > lastHistoricalDate
      );
      
      chartData = [...chartData, ...newRealtimeData];
    }

    // If there's no data, bail out
    if (chartData.length === 0) {
      return;
    }

    // Prepare chart data
    const dates = chartData.map(item => item.date);
    const prices = chartData.map(item => item.close);

    // Create chart
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: `${ticker} Price`,
            data: prices,
            borderColor: '#007BFF',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 5,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: context => `$${context.parsed.y.toFixed(2)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 7, maxRotation: 0 },
          },
          y: {
            grid: { borderDash: [5, 5] },
            ticks: { callback: value => `$${value}` },
          },
        },
      },
    });

    // Cleanup
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [ticker, historicalData, realtimeData]);

  return (
    <div className="security-chart-container">
      <h3>{ticker} Price History (Real-time Updates)</h3>
      <div
        className="chart-wrapper"
        style={{ position: 'relative', height: '300px' }}
      >
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default SecurityChart;