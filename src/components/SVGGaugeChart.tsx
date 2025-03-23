import React from 'react';

interface SVGGaugeChartProps {
    value: number;
    maxValue: number;
    title: string;
    color?: string;
}

const SVGGaugeChart: React.FC<SVGGaugeChartProps> = ({
    value,
    maxValue,
    title,
    color = '#8884d8'
}) => {
    // Bezpieczne ograniczanie wartości do przedziału [0, maxValue]
    const safeValue = Math.min(Math.max(0, value), maxValue);

    // Konwersja na procent i na kąt
    const percentage = (safeValue / maxValue) * 100;

    // Oblicz kąt (łuk od -135 do 135 stopni, czyli zakres 270 stopni)
    const angle = -135 + (percentage * 270) / 100;

    // Oblicz współrzędne końcowe łuku
    const startAngle = -135 * (Math.PI / 180);
    const endAngle = angle * (Math.PI / 180);

    // Środek i promień
    const cx = 100;
    const cy = 100;
    const radius = 80;

    // Współrzędne początkowe i końcowe łuku
    const startX = cx + radius * Math.cos(startAngle);
    const startY = cy + radius * Math.sin(startAngle);
    const endX = cx + radius * Math.cos(endAngle);
    const endY = cy + radius * Math.sin(endAngle);

    // Określ flagę 'large-arc'
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    // Tworzymy ścieżkę SVG
    const backgroundPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${cx + radius * Math.cos(135 * (Math.PI / 180))} ${cy + radius * Math.sin(135 * (Math.PI / 180))}`;
    const valuePath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
            <div className="relative">
                <svg width="200" height="200" viewBox="0 0 200 200">
                    {/* Tło wykresu */}
                    <path
                        d={backgroundPath}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="18"
                        strokeLinecap="round"
                    />

                    {/* Wartość */}
                    <path
                        d={valuePath}
                        fill="none"
                        stroke={color}
                        strokeWidth="18"
                        strokeLinecap="round"
                    />

                    {/* Wskaźnik (igła) */}
                    <line
                        x1={cx}
                        y1={cy}
                        x2={endX}
                        y2={endY}
                        stroke="#ffffff"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {/* Punkt środkowy */}
                    <circle cx={cx} cy={cy} r="8" fill="#ffffff" />

                    {/* Wartość tekstowa */}
                    <text
                        x={cx}
                        y={cy + 40}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="22"
                        fontWeight="bold"
                    >
                        {value}
                    </text>

                    {/* Max wartość */}
                    <text
                        x={cx}
                        y={cy + 60}
                        textAnchor="middle"
                        fill="rgba(255, 255, 255, 0.7)"
                        fontSize="14"
                    >
                        / {maxValue}
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default SVGGaugeChart; 