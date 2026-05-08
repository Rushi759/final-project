import React, { useMemo } from 'react';
import { FiTrendingUp, FiTrendingDown, FiBarChart2 } from 'react-icons/fi';

const MarketChart = ({ cropName, data, color = "#10b981" }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const height = 150;
    const width = 300;

    const points = useMemo(() => {
        return data.map((d, i) => ({
            x: (i / (data.length - 1)) * width,
            y: height - ((d - min) / range) * (height - 40) - 20
        }));
    }, [data, range, min]);

    const pathData = useMemo(() => {
        let p = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const cp1x = points[i].x + (points[i + 1].x - points[i].x) / 2;
            p += ` C ${cp1x},${points[i].y} ${cp1x},${points[i + 1].y} ${points[i + 1].x},${points[i + 1].y}`;
        }
        return p;
    }, [points]);

    const areaData = `${pathData} L ${width},${height} L 0,${height} Z`;

    return (
        <div className="market-analyzer-brick glass">
            <div className="analyzer-header">
                <div>
                    <small>MARKET MOMENTUM</small>
                    <h4>{cropName} Trend</h4>
                </div>
                <div className={`trend-badge ${data[data.length-1] >= data[0] ? 'up' : 'down'}`}>
                    {data[data.length-1] >= data[0] ? <FiTrendingUp /> : <FiTrendingDown />}
                    {((Math.abs(data[data.length-1] - data[0]) / data[0]) * 100).toFixed(1)}%
                </div>
            </div>
            
            <div className="chart-wrapper">
                <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={areaData} fill="url(#chartGradient)" />
                    <path d={pathData} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
                    
                    {/* Data Nodes */}
                    {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke={color} strokeWidth="2" />
                    ))}
                </svg>
            </div>
            
            <div className="chart-footer">
                <span>7 Days Ago</span>
                <span>Today</span>
            </div>
        </div>
    );
};

export default MarketChart;
