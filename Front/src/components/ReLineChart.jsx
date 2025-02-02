import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ReLineChart = ({ data = [], fields = [] },) => {
    return (
        <ResponsiveContainer width="95%" height="110%">
            <LineChart data={data} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="key" />
                <YAxis domain={['dataMin - dataMin', 'dataMax + dataMax']} />
                <Tooltip />
                <Legend verticalAlign="top" height={30} />

                {/* fields가 비어있지 않은 경우에만 렌더링 */}
                {fields.length > 0 && fields
                    .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                    .map((field) => (
                        <Line
                            key={field.dataKey}
                            type="monotone"
                            dataKey={field.dataKey}
                            name={field.name}
                            stroke={field.strokeColor || field.color}
                            strokeWidth={4}  // 두꺼운 선 설정
                            dot={false}      // 점 제거
                        />
                    ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ReLineChart;
