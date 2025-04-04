
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Highcharts from 'highcharts';

// Important - module imports must be done before use
import HighchartsMore from 'highcharts/highcharts-more';
import TreeMapModule from 'highcharts/modules/treemap';

// Initialize modules - only on the client side
if (typeof window !== 'undefined') {
    if (typeof HighchartsMore === 'function') {
        HighchartsMore(Highcharts);
    }
    if (typeof TreeMapModule === 'function') {
        TreeMapModule(Highcharts);
    }
}

interface TreeMapDataItem {
    id: string;
    name: string;
    parent?: string;
    value: number;
    colorValue?: number;
    color?: string;
}

interface HighchartsTreeMapProps {
    id: string;
    data: TreeMapDataItem[];
}

const HighchartsTreeMap = ({ id, data }: HighchartsTreeMapProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { language } = useLanguage();

    useEffect(() => {
        // Check if DOM is available
        if (!chartRef.current) return;

        // Make sure Highcharts is available and the TreeMap module has been loaded
        if (typeof Highcharts === 'undefined' || !Highcharts.seriesType) {
            console.error('Highcharts or TreeMap module was not initialized');
            return;
        }

        // Translations
        const translations = {
            url_structure: {
                pl: "Struktura URL",
                en: "URL Structure"
            },
            proximity: {
                pl: "Bliskość do centroidu",
                en: "Proximity to Centroid"
            },
            pages_count: {
                pl: "Liczba stron",
                en: "Pages Count"
            }
        };

        // Helper function for translation
        const t = (key: keyof typeof translations) => {
            return translations[key][language as 'pl' | 'en'] || translations[key].en;
        };

        // Color definitions for different sections - more diverse colors
        const sectionColors = [
            '#50FFB1', // greenish
            '#8884d8', // purple
            '#5DADE2', // blue
            '#F7DC6F', // yellow
            '#E74C3C', // red
            '#9B59B6', // magenta
            '#27AE60', // green
            '#F1C40F', // gold
            '#E67E22'  // orange
        ];

        try {
            // Prepare data with specific colors for individual sections
            const processedData = data.map((item, index) => {
                // Set color based on item id for consistency
                let colorIndex;

                if (!item.parent) {
                    // Main element - color based on index
                    colorIndex = 0;
                } else if (item.parent === 'main') {
                    // First level elements - systematic colors
                    // Extract index from id (e.g., from "blog" take 0, from "product" take 1, etc.)
                    const parentIndex = index % sectionColors.length;
                    colorIndex = parentIndex;
                } else {
                    // Lower levels - color based on colorValue (proximity to centroid)
                    return {
                        ...item,
                        // Don't set a specific color, colorAxis will be used
                    };
                }

                // For main sections and first level, set specific colors
                if (item.parent === 'main' || !item.parent) {
                    return {
                        ...item,
                        color: sectionColors[colorIndex]
                    };
                }

                return item;
            });

            // Create chart
            const chart = Highcharts.chart({
                chart: {
                    renderTo: id,
                    backgroundColor: 'transparent',
                    style: {
                        fontFamily: 'Inter, sans-serif'
                    },
                    animation: {
                        duration: 1000
                    }
                },
                series: [{
                    type: 'treemap',
                    name: 'URL Structure',
                    allowTraversingTree: true,
                    // Remove alternateStartingDirection from here
                    // Disable color change effect on hover
                    states: {
                        hover: {
                            brightness: 0, // No brightness change
                            halo: {
                                size: 0, // Set to 0 instead of false
                                opacity: 0
                            }
                        },
                        inactive: {
                            opacity: 1 // No opacity change
                        }
                    },
                    dataLabels: {
                        format: '{point.name}',
                        style: {
                            textOutline: 'none',
                            color: '#ffffff',
                            fontWeight: 'bold'
                        }
                    },
                    borderColor: '#121212',
                    // borderRadius: 3, // Remove from here
                    nodeSizeBy: 'value',
                    levels: [{
                        level: 1,
                        layoutAlgorithm: 'strip', // Changed to strip for more variety
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: '0.9em',
                                fontWeight: 'bold',
                                color: '#ffffff',
                                textTransform: 'uppercase'
                            }
                        },
                        // borderRadius: 3, // Remove this property as it's not valid
                        borderWidth: 2
                    }, {
                        level: 2,
                        layoutAlgorithm: 'stripes', // Vertical strips
                        layoutStartingDirection: 'vertical', // Enforce vertical direction
                        // alternateStartingDirection: true, // Remove this invalid property
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: '0.8em',
                                color: '#ffffff'
                            }
                        },
                        borderWidth: 1
                    }, {
                        level: 3,
                        layoutAlgorithm: 'sliceAndDice', // Alternating vertical and horizontal strips
                        layoutStartingDirection: 'vertical', // Start with vertical 
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: '0.7em',
                                color: '#ffffff'
                            }
                        },
                        borderWidth: 1
                    }],
                    data: processedData
                }],
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },
                colorAxis: {
                    minColor: '#e74c3c',
                    maxColor: '#2ecc71',
                    labels: {
                        style: {
                            color: '#ffffff'
                        }
                    }
                },
                tooltip: {
                    useHTML: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    style: {
                        color: '#FFFFFF'
                    },
                    borderWidth: 0,
                    shadow: true,
                    pointFormat: `
                        <div style="padding: 8px 0">
                            <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px;">{point.name}</div>
                            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
                                <span>${t('pages_count')}:</span>
                                <span style="font-weight: bold">{point.value}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
                                <span>${t('proximity')}:</span>
                                <span style="font-weight: bold">{point.colorValue:.2f}</span>
                            </div>
                            <div style="height: 3px; background: linear-gradient(90deg, #e74c3c, #f5b041, #2ecc71); margin-top: 6px;"></div>
                        </div>
                    `
                },
                credits: {
                    enabled: false
                }
            });

            // Cleanup when component unmounts
            return () => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            };
        } catch (error) {
            console.error('Error creating TreeMap chart:', error);
        }
    }, [id, data, language]);

    return (
        <div
            ref={chartRef}
            id={id}
            className="w-full"
            style={{ height: '600px', minHeight: '500px' }}
        />
    );
};

export default HighchartsTreeMap;
