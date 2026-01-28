'use client';
import ImageUpload from '@/components/Dashboard/ImageUpload';

export default function ScanPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <header>
                <h1 className="text-3xl font-black text-white">AI Pest Scanner</h1>
                <p className="text-slate-500">Upload high-res leaf images for PhD-level agricultural reasoning.</p>
            </header>

            <section className="bg-slate-900/50 border border-slate-800 p-10 rounded-[2.5rem]">
                <ImageUpload onUploadSuccess={() => alert('Detection complete! Check History.')} />
            </section>
        </div>
    );
}