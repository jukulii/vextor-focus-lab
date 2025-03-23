import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Highcharts from 'highcharts';

// Ważne - importy modułów muszą być wykonane przed użyciem
import HighchartsMore from 'highcharts/highcharts-more';
import TreeMapModule from 'highcharts/modules/treemap';

// Inicjalizacja modułów - tylko po stronie klienta
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
        // Sprawdź czy DOM jest dostępny
        if (!chartRef.current) return;

        // Upewnij się, że Highcharts jest dostępny i moduł TreeMap został załadowany
        if (typeof Highcharts === 'undefined' || !Highcharts.seriesTypes.treemap) {
            console.error('Highcharts lub moduł TreeMap nie został zainicjalizowany');
            return;
        }

        // Tłumaczenia
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

        // Funkcja pomocnicza do tłumaczenia
        const t = (key: keyof typeof translations) => {
            return translations[key][language as 'pl' | 'en'] || translations[key].en;
        };

        // Definicje kolorów dla różnych sekcji - więcej różnorodnych kolorów
        const sectionColors = [
            '#50FFB1', // zielonkawy
            '#8884d8', // fioletowy
            '#5DADE2', // niebieski
            '#F7DC6F', // żółty
            '#E74C3C', // czerwony
            '#9B59B6', // purpurowy
            '#27AE60', // zielony
            '#F1C40F', // złoty
            '#E67E22'  // pomarańczowy
        ];

        try {
            // Przygotuj dane z konkretnymi kolorami dla poszczególnych sekcji
            const processedData = data.map((item, index) => {
                // Ustal kolor na podstawie id elementu dla spójności
                let colorIndex;

                if (!item.parent) {
                    // Główny element - kolor na podstawie indeksu
                    colorIndex = 0;
                } else if (item.parent === 'main') {
                    // Elementy pierwszego poziomu - systematyczne kolory
                    // Wyciągnij indeks z id (np. z "blog" bierzemy 0, z "product" bierzemy 1 itd.)
                    const parentIndex = index % sectionColors.length;
                    colorIndex = parentIndex;
                } else {
                    // Niższe poziomy - kolor bazujący na colorValue (bliskość do centroidu)
                    return {
                        ...item,
                        // Nie ustawiamy konkretnego koloru, będzie użyty colorAxis
                    };
                }

                // Dla głównych sekcji i pierwszego poziomu ustalamy konkretne kolory
                if (item.parent === 'main' || !item.parent) {
                    return {
                        ...item,
                        color: sectionColors[colorIndex]
                    };
                }

                return item;
            });

            // Tworzenie wykresu
            const chart = Highcharts.chart(chartRef.current, {
                series: [{
                    type: 'treemap',
                    name: 'URL Structure',
                    allowTraversingTree: true,
                    alternateStartingDirection: true,
                    // Wyłącz efekt zmiany koloru przy najechaniu myszą
                    states: {
                        hover: {
                            brightness: 0, // Brak zmiany jasności
                            halo: false // Brak efektu halo
                        },
                        inactive: {
                            opacity: 1 // Brak zmiany przezroczystości
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
                    borderRadius: 3,
                    nodeSizeBy: 'value',
                    levels: [{
                        level: 1,
                        layoutAlgorithm: 'strip', // Zmienione na strip dla większej różnorodności
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: '0.9em',
                                fontWeight: 'bold',
                                color: '#ffffff',
                                textTransform: 'uppercase'
                            }
                        },
                        borderRadius: 3,
                        borderWidth: 2
                    }, {
                        level: 2,
                        layoutAlgorithm: 'stripes', // Pionowe paski
                        layoutStartingDirection: 'vertical', // Wymusza pionowy kierunek
                        alternateStartingDirection: true, // Naprzemiennie zmienia kierunek
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
                        layoutAlgorithm: 'sliceAndDice', // Naprzemienne pionowe i poziome paski
                        layoutStartingDirection: 'vertical', // Zaczynamy od pionowych 
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
                },
                chart: {
                    backgroundColor: 'transparent',
                    style: {
                        fontFamily: 'Inter, sans-serif'
                    },
                    animation: {
                        duration: 1000
                    }
                }
            });

            // Czyszczenie przy odmontowaniu komponentu
            return () => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            };
        } catch (error) {
            console.error('Błąd podczas tworzenia wykresu TreeMap:', error);
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