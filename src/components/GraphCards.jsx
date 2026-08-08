import React from "react";
import { useTranslation } from "react-i18next";
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const CustomizedContent = (props) => {
  const { x, y, width, height, index, name, displayPercent, root } = props;

  const totalItems = root?.children?.length || 1;
  const hue = (index * (360 / totalItems)) % 360;

  // Oculta el texto si el bloque resulta ser demasiado estrecho o bajo
  const showTitle = width > 50 && height > 30;
  const showPercent = width > 40 && height > 45;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: `hsl(${hue}, 60%, 45%)`,
          stroke: "#0a0027",
          strokeWidth: 1.5,
        }}
      />
      {showTitle && (
        <text
          x={x + width / 2}
          y={y + height / 2 - (showPercent ? 6 : 0)}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          fontSize={Math.min(width / 10, 24)}
          
          style={{ pointerEvents: 'none' }}
        >
          {/* Recorta el texto si es más largo que el ancho disponible */}
          {name.length > Math.floor(width / 7) ? `${name.slice(0, Math.floor(width / 7))}...` : name}
        </text>
      )}
      {showPercent && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 15}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#e0e0e0"
          fontSize={14}
          style={{ pointerEvents: 'none' }}
        >
          {displayPercent}
        </text>
      )}
    </g>
  );
};

const GraphCards = ({ cards, numberOfHands }) => {
  const { t } = useTranslation();
  
  const data = cards
    .map((c) => {
      const realPercent = Number((c.appears * 100 / numberOfHands).toFixed(1)) || 0;
      return {
        name: c.name,
        // Usamos la raíz cuadrada para suavizar la diferencia de proporciones
        size: Math.sqrt(realPercent), 
        displayPercent: `${realPercent}%`,
        realValue: realPercent,
      };
    })
    .filter((c) => c.realValue > 0);

  if (data.length === 0) return <p>Cargando datos...</p>;

  return (
    <div style={{ width: '100%', height: '600px', minWidth: '0' }}>
      <h1 style={{ textAlign: "center", color: "#fff" }}>{t('cardAppears')}</h1>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          stroke="#ffffff"
          content={<CustomizedContent />}
        >
          <Tooltip
            formatter={(value, name, props) => [
              `${t('numberOf')}${props.payload.displayPercent}${t('numberOf2')}`, 
              props.payload.name
            ]}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphCards;