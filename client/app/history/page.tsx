'use client';
import { useEffect, useState } from 'react';
import { DataService } from '@/utils/api';

export default function HistoryPage() {
    const [pestData, setPestData] = useState([]);

    useEffect(() => {
        DataService.getPestDetections().then(setPestData);
    }, []);

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white">Field History</h1>
                    <p className="text-slate-500">Historical records of AI detections and preventive actions.</p>
                </div>
            </header>

            <div className="space-y-6">
                {[...pestData].reverse().map((report: any, index) => (
                    <div key={index} className="p-8 bg-slate-900/50 border border-slate-800 rounded-[2rem] hover:border-emerald-500/30 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white">{report.pestType}</h3>
                                <p className="text-xs text-slate-500">{new Date(report.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-emerald-400 font-black text-4xl">{report.count}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Total Pests</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-800">
                            <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase mb-2">Visual Reasoning</p>
                                <p className="text-slate-300 italic">"{report.reasoning}"</p>
                            </div>
                            <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10">
                                <p className="text-[10px] text-emerald-500 font-black uppercase mb-2">Recommendation</p>
                                <p className="text-white font-medium">{report.recommendation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}