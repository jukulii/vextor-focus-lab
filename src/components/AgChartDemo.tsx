
import React, { useRef, useEffect } from 'react';
import { AgCharts } from 'ag-charts-community';
import { AgChartOptions } from 'ag-charts-community';

interface AgChartDemoProps {
  title?: string;
  className?: string;
}

const AgChartDemo: React.FC<AgChartDemoProps> = ({ title, className }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  const chartOptions: AgChartOptions = {
    title: {
      text: title || 'Website Focus Distribution',
    },
    data: [
      { type: 'Blog', value: 45 },
      { type: 'Product', value: 25 },
      { type: 'Category', value: 15 },
      { type: 'Support', value: 10 },
      { type: 'Landing', value: 5 },
    ],
    series: [
      {
        type: 'pie',
        angleKey: 'value',
        calloutLabelKey: 'type',
        sectorLabelKey: 'value',
        sectorLabel: {
          color: 'white',
          fontWeight: 'bold',
        },
        fills: ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#8BC34A'],
        strokes: ['white', 'white', 'white', 'white', 'white'],
        strokeWidth: 2,
        tooltip: {
          enabled: true,
        },
      },
    ],
    legend: {
      enabled: true,
      position: 'bottom',
    },
    height: 400,
  };

  useEffect(() => {
    if (chartRef.current) {
      AgCharts.create(chartOptions, chartRef.current);
    }
    
    return () => {
      if (chartRef.current) {
        AgCharts.update(chartOptions, chartRef.current);
      }
    };
  }, [chartRef, title]);

  return (
    <div className={className}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default AgChartDemo;
