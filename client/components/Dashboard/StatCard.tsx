'use client';

interface StatCardProps {
    label: string;
    value: string | number;
    // ✅ Added 'yellow' to the allowed color list
    color: 'emerald' | 'blue' | 'cyan' | 'red' | 'yellow';
}

export default function StatCard({ label, value, color }: StatCardProps) {
    // ✅ Added text and border styles for yellow
    const textColors = {
        emerald: "text-emerald-400",
        blue: "text-blue-400",
        cyan: "text-cyan-400",
        red: "text-red-400",
        yellow: "text-yellow-400"
    };

    const borders = {
        emerald: "border-emerald-500/20",
        blue: "border-blue-500/20",
        cyan: "border-cyan-500/20",
        red: "border-red-500/20",
        yellow: "border-yellow-500/20"
    };

    const displayValue = typeof value === 'number' ? value.toFixed(1) :
        (typeof value === 'string' && !isNaN(parseFloat(value))) ? parseFloat(value).toFixed(1) : value;

    return (
        <div className={`bg-slate-900/40 border ${borders[color]} p-6 rounded-3xl transition-all hover:-translate-y-1`}>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{label}</p>
            <p className={`text-3xl font-black ${textColors[color]}`}>
                {displayValue}
                {label !== 'System Risk' && (label === 'Air Temp' ? '°C' : '%')}
            </p>
        </div>
    );
}