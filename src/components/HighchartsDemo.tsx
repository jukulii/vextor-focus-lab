
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface HighchartsDemoProps {
    className?: string;
}

const HighchartsDemo: React.FC<HighchartsDemoProps> = ({ className }) => {
    // Chart configuration
    const options: Highcharts.Options = {
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',
        },
        title: {
            text: 'Analiza domenowa',
            style: {
                color: '#333333'
            }
        },
        xAxis: {
            categories: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec'],
            labels: {
                style: {
                    color: '#555555'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Wartość',
                style: {
                    color: '#555555'
                }
            },
            labels: {
                style: {
                    color: '#555555'
                }
            },
            gridLineColor: 'rgba(0, 0, 0, 0.1)'
        },
        series: [
            {
                type: 'spline',
                name: 'Domena A',
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0],
                color: '#8884d8'
            },
            {
                type: 'spline',
                name: 'Domena B',
                data: [19.2, 51.7, 86.8, 109.5, 124.3, 156.2],
                color: '#82ca9d'
            }
        ],
        legend: {
            itemStyle: {
                color: '#333333'
            },
            itemHoverStyle: {
                color: '#000000'
            }
        },
        credits: {
            enabled: false
        }
    };

    return (
        <div className={className}>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default HighchartsDemo;
