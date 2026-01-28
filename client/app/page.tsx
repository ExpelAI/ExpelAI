'use client';
import { useEffect, useState, useCallback } from 'react';
import { DataService } from '@/utils/api';
import PestTrendChart from '@/components/Dashboard/PestTrendChart';
import StatCard from '@/components/Dashboard/StatCard';

interface SensorData {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    riskLevel: string;
}

interface PestData {
    pestType: string;
    count: number;
    severity: string;
    createdAt: string;
}

export default function Dashboard() {
    const [pestData, setPestData] = useState<PestData[]>([]);
    const [sensorData, setSensorData] = useState<SensorData[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const [pests, sensors] = await Promise.all([
                DataService.getPestDetections(),
                DataService.getSensorData()
            ]);
            setPestData(pests);
            setSensorData(sensors);
        } catch (err) {
            console.error('Data fetch failed');
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // 1. Get the latest sensor data
    const latest: SensorData = sensorData[sensorData.length - 1] || {
        temperature: 0,
        humidity: 0,
        soilMoisture: 0,
        riskLevel: 'Low'
    };

    // 2. Get the latest pest scan severity
    const latestPest = pestData[pestData.length - 1];
    const pestRisk = latestPest?.severity || 'Low';

    // 3. Combine them: If EITHER the sensors OR the pests say "High", show "High"
    const displayRisk = (latest.riskLevel === 'High' || pestRisk === 'High') ? 'High' :
        (latest.riskLevel === 'Medium' || pestRisk === 'Medium') ? 'Medium' : 'Low';

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-black text-white tracking-tight">System Overview</h1>
                <p className="text-slate-500 font-medium">Real-time polyhouse climate and pest analytics.</p>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard label="Air Temp" value={latest.temperature} color="emerald" />
                <StatCard label="Humidity" value={latest.humidity} color="blue" />
                <StatCard label="Soil Moisture" value={latest.soilMoisture} color="cyan" />

                {/* ✅ FIXED: Now correctly displays the combined AI + Sensor risk level */}
                <StatCard
                    label="System Risk"
                    value={displayRisk}
                    // This line ensures Medium is Yellow and High is Red
                    color={displayRisk === 'High' ? 'red' : displayRisk === 'Medium' ? 'yellow' : 'emerald'}
                />
            </div>

            {/* 📊 FIXED CHART SECTION */}
            <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Pest Population Trends</h2>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                        Live Feed
                    </span>
                </div>

                <div className="h-[500px] w-full overflow-hidden">
                    <PestTrendChart data={pestData} />
                </div>
            </section>
        </div>
    );
}