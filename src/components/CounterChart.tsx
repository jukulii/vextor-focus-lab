
import React from 'react';
import GaugeChart from 'react-gauge-chart';

interface CounterChartProps {
    className?: string;
    title: string;
    value: number;
    maxValue: number;
    color?: string;
}

const CounterChart: React.FC<CounterChartProps> = ({
    className,
    title,
    value,
    maxValue,
    color = '#8884d8'
}) => {
    // Calculate percentage for gauge chart (value between 0 and 1)
    const percent = value / maxValue;

    // Colors for gradient
    const colors = ["#EA4228", "#F5CD19", "#5BE12C"];

    return (
        <div className={className}>
            <h3 className="text-center text-lg font-medium text-white mb-4">{title}</h3>
            <GaugeChart
                id={`gauge-chart-${title.replace(/\s+/g, '-').toLowerCase()}`}
                nrOfLevels={3}
                colors={colors}
                percent={percent}
                arcWidth={0.3}
                textColor="#FFFFFF"
                needleColor="#FFFFFF"
                needleBaseColor="#FFFFFF"
                animate={true}
                formatTextValue={() => `${value} / ${maxValue}`}
            />
        </div>
    );
};

export default CounterChart;
