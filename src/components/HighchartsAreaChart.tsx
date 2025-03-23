import React, { useEffect, useRef } from 'react';

interface HighchartsAreaChartProps {
    id: string;
    title: string;
    xAxisTitle: string;
    yAxisTitle: string;
    data: Array<[number, number]>; // [x, y] punkty dla wykresu
    color?: string;
    fillOpacity?: number;
    minX?: number;
    maxX?: number;
    invertXAxis?: boolean; // czy oś X powinna być odwrócona
}

declare global {
    interface Window {
        Highcharts: any;
    }
}

const HighchartsAreaChart: React.FC<HighchartsAreaChartProps> = ({
    id,
    title,
    xAxisTitle,
    yAxisTitle,
    data,
    color = '#8884d8',
    fillOpacity = 0.5,
    minX = 0,
    maxX = 1.0,
    invertXAxis = false
}) => {
    const chartContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Inicjalizacja wykresu
        const initChart = () => {
            if (!chartContainer.current || !window.Highcharts) return;

            const Highcharts = window.Highcharts;

            Highcharts.chart(chartContainer.current, {
                chart: {
                    type: 'area',
                    backgroundColor: 'transparent',
                    height: '300px',
                    inverted: false
                },
                title: {
                    text: title,
                    style: {
                        color: '#FFFFFF'
                    }
                },
                xAxis: {
                    title: {
                        text: xAxisTitle,
                        style: {
                            color: '#FFFFFF'
                        }
                    },
                    labels: {
                        style: {
                            color: '#CCCCCC'
                        }
                    },
                    tickInterval: 0.05,
                    min: minX,
                    max: maxX,
                    reversed: invertXAxis, // Odwrócenie osi X jeśli potrzeba
                    gridLineColor: 'rgba(255, 255, 255, 0.1)',
                    lineColor: 'rgba(255, 255, 255, 0.3)',
                    tickColor: 'rgba(255, 255, 255, 0.3)'
                },
                yAxis: {
                    title: {
                        text: yAxisTitle,
                        style: {
                            color: '#FFFFFF'
                        }
                    },
                    labels: {
                        style: {
                            color: '#CCCCCC'
                        }
                    },
                    gridLineColor: 'rgba(255, 255, 255, 0.1)'
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: `${yAxisTitle}: {point.y}`
                },
                plotOptions: {
                    area: {
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        },
                        lineWidth: 2,
                        states: {
                            hover: {
                                lineWidth: 3
                            }
                        },
                        threshold: null,
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.color(color).setOpacity(fillOpacity).get('rgba')],
                                [1, Highcharts.color(color).setOpacity(0).get('rgba')]
                            ]
                        }
                    }
                },
                series: [{
                    name: yAxisTitle,
                    color: color,
                    data: data
                }],
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                }
            });
        };

        // Sprawdź, czy Highcharts jest już załadowany
        if (window.Highcharts) {
            initChart();
        } else {
            // Jeśli nie, obserwuj DOM, aż zostanie załadowany (przez komponent HighchartsGauge)
            const checkHighchartsInterval = setInterval(() => {
                if (window.Highcharts) {
                    clearInterval(checkHighchartsInterval);
                    initChart();
                }
            }, 100);

            // Oczyszczenie interwału przy odmontowaniu komponentu
            return () => clearInterval(checkHighchartsInterval);
        }
    }, [id, title, xAxisTitle, yAxisTitle, data, color, fillOpacity, minX, maxX, invertXAxis]);

    return (
        <div ref={chartContainer} id={id} className="w-full h-[300px]"></div>
    );
};

export default HighchartsAreaChart; 