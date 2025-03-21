
import React, { useState, useEffect } from 'react';
import { AgChart } from 'ag-charts-community';
import { AgChartReact } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';

interface AgChartDemoProps {
  title?: string;
  className?: string;
}

const AgChartDemo: React.FC<AgChartDemoProps> = ({ title, className }) => {
  const [chartOptions, setChartOptions] = useState<AgChartOptions>({
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
  });

  // Update chart options when title changes
  useEffect(() => {
    setChartOptions(prevOptions => ({
      ...prevOptions,
      title: {
        ...prevOptions.title,
        text: title || 'Website Focus Distribution',
      },
    }));
  }, [title]);

  return (
    <div className={className}>
      <AgChartReact options={chartOptions} />
    </div>
  );
};

export default AgChartDemo;
