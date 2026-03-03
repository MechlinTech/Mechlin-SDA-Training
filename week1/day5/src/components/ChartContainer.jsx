import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/*
  ChartContainer.jsx
  ------------------
  Takes in the dictionary of all live socket updates, and forms a sliding array 
  so `recharts` can draw a real-time time-series feed.
*/
export function ChartContainer({ data, selectedMetric, onMetricChange }) {
    const [history, setHistory] = useState([]);

    // Every time `data` prop objects mutate (from WS message), we append a record
    useEffect(() => {
        if (!data || !data.revenue || !data.users || !data.orders) return;

        const now = new Date();
        const timeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        setHistory(prev => {
            // Keep only the last 20 data points
            const newHistory = [...prev, {
                time: timeLabel,
                revenue: data.revenue?.total || 0,
                users: data.users?.total || 0,
                orders: data.orders?.total || 0
            }];
            if (newHistory.length > 20) {
                return newHistory.slice(newHistory.length - 20); // shift old data out
            }
            return newHistory;
        });
    }, [data]);

    const colors = {
        revenue: '#10b981', // green
        users: '#60a5fa',   // blue
        orders: '#f59e0b'   // yellow
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '1.2rem', fontWeight: 600 }}>Live Activity Stream</h3>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['revenue', 'users', 'orders'].map(metric => (
                        <button
                            key={metric}
                            onClick={() => onMetricChange(metric)}
                            style={{
                                background: selectedMetric === metric ? 'rgba(255,255,255,0.1)' : 'transparent',
                                border: '1px solid',
                                borderColor: selectedMetric === metric ? colors[metric] : 'rgba(255,255,255,0.1)',
                                color: selectedMetric === metric ? colors[metric] : '#94a3b8',
                                padding: '4px 12px',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s',
                                fontWeight: 500
                            }}
                        >
                            {metric}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colors[selectedMetric]} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={colors[selectedMetric]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#64748b"
                            fontSize={12}
                            tickMargin={10}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={12}
                            tickMargin={10}
                            axisLine={false}
                            tickLine={false}
                            domain={['auto', 'auto']}
                            tickFormatter={(val) => {
                                if (selectedMetric === 'revenue') return `$${(val / 1000).toFixed(1)}k`;
                                if (selectedMetric === 'users') return `${(val / 1000).toFixed(1)}k`;
                                return val;
                            }}
                        />
                        <Tooltip
                            contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }}
                            itemStyle={{ color: colors[selectedMetric], fontWeight: 600 }}
                        />
                        <Area
                            type="monotone"
                            dataKey={selectedMetric}
                            stroke={colors[selectedMetric]}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorMetric)"
                            isAnimationActive={false} /* False so sliding window looks fluid */
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
