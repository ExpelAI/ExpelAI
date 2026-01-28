'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface PestData {
    createdAt: string;
    count: number;
    pestType: string;
}

interface PestTrendChartProps {
    data: PestData[];
}

const PestTrendChart: React.FC<PestTrendChartProps> = ({ data }) => {
    const chartData = data.map(item => ({
        time: item.createdAt,
        count: item.count,
    }));

    return (
        <div className="w-full h-full min-h-[450px] bg-[#0f172a]/20 p-2 rounded-[2rem] border border-slate-800/40">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
                >
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1e293b" />

                    <XAxis
                        dataKey="time"
                        /* 🛠️ BOLD & BRIGHT LABELS */
                        stroke="#94a3b8"
                        fontSize={13}
                        fontWeight={700}
                        tickLine={false}
                        axisLine={false}
                        angle={0}
                        textAnchor="end"
                        height={60}
                        interval="preserveStartEnd"
                        minTickGap={35}
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                    />

                    <YAxis
                        /* 🛠️ BOLD & BRIGHT LABELS */
                        stroke="#94a3b8"
                        fontSize={13}
                        fontWeight={700}
                        tickLine={false}
                        axisLine={false}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#020617',
                            borderRadius: '12px',
                            border: '1px solid #1e293b',
                            fontWeight: 'bold'
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#10b981"
                        strokeWidth={4}
                        dot={{ fill: '#0f172a', stroke: '#10b981', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 8, strokeWidth: 0, fill: '#34d399' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PestTrendChart;