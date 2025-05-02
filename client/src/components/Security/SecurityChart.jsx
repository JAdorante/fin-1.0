import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SecurityChart = ({ ticker, historicalData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;                           // Make sure we have the canvas
    const ctx = canvas.getContext('2d');

    // Destroy any existing chart before creating a new one
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    // If there's no data, bail out
    if (!historicalData || historicalData.length === 0) {
      return;
    }

    // Prepare labels and data
    const dates = historicalData.map(item => item.date);
    const prices = historicalData.map(item => item.close);

    // Create new chart
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: `${ticker} Price`,     // <-- Fixed: closed template literal and added comma
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

    // Cleanup on unmount or before next effect run
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [ticker, historicalData]);

  return (
    <div className="security-chart-container">
      <h3>{ticker} Price History</h3>
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
