
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface HighchartsDemoProps {
    className?: string;
}

const HighchartsDemo: React.FC<HighchartsDemoProps> = ({ className }) => {
    // Konfiguracja wykresu
    const options: Highcharts.Options = {
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',
        },
        title: {
            text: 'Analiza domenowa',
            style: {
                color: '#FFFFFF'
            }
        },
        xAxis: {
            categories: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec'],
            labels: {
                style: {
                    color: '#CCCCCC'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Wartość',
                style: {
                    color: '#CCCCCC'
                }
            },
            labels: {
                style: {
                    color: '#CCCCCC'
                }
            },
            gridLineColor: 'rgba(255, 255, 255, 0.1)'
        },
        series: [
            {
                type: 'spline', // Added the type property
                name: 'Domena A',
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0],
                color: '#8884d8'
            },
            {
                type: 'spline', // Added the type property
                name: 'Domena B',
                data: [19.2, 51.7, 86.8, 109.5, 124.3, 156.2],
                color: '#82ca9d'
            }
        ],
        legend: {
            itemStyle: {
                color: '#CCCCCC'
            },
            itemHoverStyle: {
                color: '#FFFFFF'
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
