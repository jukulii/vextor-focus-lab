
import React from 'react';
import { AgChartsReact } from 'ag-charts-community';
import { AgChartOptions } from 'ag-charts-community';

interface AgChartDemoProps {
  title?: string;
  className?: string;
}

const AgChartDemo: React.FC<AgChartDemoProps> = ({ title, className }) => {
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
        strokes: 'white',
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

  return (
    <div className={className}>
      <AgChartsReact options={chartOptions} />
    </div>
  );
};

export default AgChartDemo;
