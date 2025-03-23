import React, { useEffect, useRef } from 'react';

// Definicja typu dla danych
interface DonutChartDataItem {
    name: string;
    y: number;
    color?: string;
}

interface HighchartsDonutProps {
    id: string;
    title: string;
    data: DonutChartDataItem[];
}

declare global {
    interface Window {
        Highcharts: any;
    }
}

const HighchartsDonut: React.FC<HighchartsDonutProps> = ({
    id,
    title,
    data
}) => {
    const chartContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Inicjalizacja wykresu
        const initChart = () => {
            if (!chartContainer.current || !window.Highcharts) return;

            const Highcharts = window.Highcharts;

            Highcharts.chart(chartContainer.current, {
                chart: {
                    type: 'pie',
                    backgroundColor: 'transparent',
                    height: '400px'
                },
                title: {
                    text: title,
                    style: {
                        color: '#FFFFFF'
                    }
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: '#FFFFFF',
                                textOutline: 'none'
                            }
                        },
                        innerSize: '50%', // To sprawia, że wykres jest typu "donut"
                        showInLegend: true
                    }
                },
                legend: {
                    enabled: true,
                    itemStyle: {
                        color: '#FFFFFF'
                    },
                    itemHoverStyle: {
                        color: '#CCCCCC'
                    }
                },
                series: [{
                    name: 'Pages',
                    colorByPoint: true,
                    data: data
                }],
                credits: {
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
    }, [id, title, data]);

    return (
        <div ref={chartContainer} id={id} className="w-full h-[400px]"></div>
    );
};

export default HighchartsDonut; 