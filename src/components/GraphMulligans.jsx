import React, { Fragment } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';
import './Graph.css';
import { useTranslation } from "react-i18next";

const GraphMulligans = ({ data }) => {
    const {t, i18n} = useTranslation();
    const COLORS = data.datasets[0].backgroundColor;
    const chartData = data.labels.map((label, index) => ({
        name: label,
        value: data.datasets[0].data[index],
    }));

    // Función mágica para calcular la posición interna
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
        
        const RADIAN = Math.PI / 180;
        // El factor 0.5 determina qué tan cerca del centro está el número
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text"
            >
                {`${(value * 100 / (data.datasets[0].data[0] + data.datasets[0].data[1])).toFixed(1)}%`}
            </text>
        );
    };

    return (
        <Fragment>
            <div className="graph-container">
                <h1 style={{textAlign:"center"}}>{t('mulliganPercent')}</h1>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false} // Quitamos las líneas de afuera
                            label={renderCustomizedLabel} // Usamos nuestra función
                            outerRadius="100%"
                            dataKey="value"
                            stroke={data.datasets[0].borderColor || "black"}
                            strokeWidth={data.datasets[0].borderWith || 1}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Fragment>
    );
}

export default GraphMulligans;