import React, { useEffect, useRef } from 'react';

// Importujemy biblioteki Highcharts bezpośrednio poprzez CDN
// Ten sposób pozwala uniknąć problemów z importowaniem modułów
declare global {
    interface Window {
        Highcharts: any;
    }
}

interface HighchartsGaugeProps {
    id: string;
    value: number;
    title: string;
    suffix?: string;
    min?: number;
    max?: number;
}

const HighchartsGauge: React.FC<HighchartsGaugeProps> = ({
    id,
    value,
    title,
    suffix = '',
    min = 0,
    max = 100
}) => {
    const chartContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Wczytaj Highcharts z CDN
        const loadHighcharts = () => {
            if (window.Highcharts) {
                initChart();
                return;
            }

            // Główna biblioteka
            const highchartsScript = document.createElement('script');
            highchartsScript.src = 'https://code.highcharts.com/highcharts.js';
            highchartsScript.async = true;

            // Dodatkowe moduły
            const moreScript = document.createElement('script');
            moreScript.src = 'https://code.highcharts.com/highcharts-more.js';
            moreScript.async = true;

            highchartsScript.onload = () => {
                document.body.appendChild(moreScript);
            };

            moreScript.onload = () => {
                initChart();
            };

            document.body.appendChild(highchartsScript);
        };

        // Funkcja inicjująca wykres
        const initChart = () => {
            if (!chartContainer.current || !window.Highcharts) return;

            const Highcharts = window.Highcharts;

            // Stwórz wykres zgodnie z przykładem
            Highcharts.chart(chartContainer.current, {
                chart: {
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    height: '300px',
                    backgroundColor: 'transparent'
                },
                title: {
                    text: title,
                    style: {
                        color: '#FFFFFF'
                    }
                },
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#333'],
                                [1, '#111']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#333'],
                                [1, '#111']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        backgroundColor: 'transparent',
                        borderWidth: 0
                    }, {
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },
                yAxis: {
                    min: min,
                    max: max,
                    tickPixelInterval: 72,
                    tickPosition: 'inside',
                    tickColor: '#FFFFFF',
                    tickLength: 20,
                    tickWidth: 2,
                    minorTickInterval: null,
                    labels: {
                        distance: 20,
                        style: {
                            fontSize: '14px',
                            color: '#FFFFFF'
                        }
                    },
                    lineWidth: 0,
                    plotBands: [{
                        from: min,
                        to: max * 0.6,
                        color: '#DF5353', // red
                        thickness: 20
                    }, {
                        from: max * 0.6,
                        to: max * 0.8,
                        color: '#DDDF0D', // yellow
                        thickness: 20
                    }, {
                        from: max * 0.8,
                        to: max,
                        color: '#55BF3B', // green
                        thickness: 20
                    }]
                },
                series: [{
                    name: title,
                    data: [value],
                    tooltip: {
                        valueSuffix: suffix
                    },
                    dataLabels: {
                        format: `{y}${suffix}`,
                        borderWidth: 0,
                        color: '#FFFFFF',
                        style: {
                            fontSize: '16px'
                        }
                    },
                    dial: {
                        radius: '80%',
                        backgroundColor: 'silver',
                        baseWidth: 12,
                        baseLength: '0%',
                        rearLength: '0%'
                    },
                    pivot: {
                        backgroundColor: 'silver',
                        radius: 6
                    }
                }],
                credits: {
                    enabled: false
                }
            });
        };

        loadHighcharts();

        // Cleanup on unmount
        return () => {
            // Tu można dodać logikę czyszczenia jeśli jest potrzebna
        };
    }, [id, value, title, suffix, min, max]);

    return (
        <div className="w-full">
            <div ref={chartContainer} id={id} className="h-[300px]"></div>
        </div>
    );
};

export default HighchartsGauge; 