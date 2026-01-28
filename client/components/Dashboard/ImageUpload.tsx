'use client';

import React, { useState, useRef } from 'react';
import { DataService } from '@/utils/api';

// This tells TypeScript that ImageUpload can now receive the 'onUploadSuccess' instruction
export default function ImageUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setMessage(null);
            setAnalysisResult(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setMessage(null);
        setAnalysisResult(null);

        try {
            const response = await DataService.uploadImage(selectedFile);

            // 1. Save results to show in the UI box
            setAnalysisResult(response.data);
            setMessage({ text: 'Analysis complete!', type: 'success' });

            // 🔄 2. NEW: Trigger the refresh of the main dashboard history
            if (onUploadSuccess) {
                onUploadSuccess();
            }

        } catch (error) {
            console.error('Upload failed:', error);
            setMessage({ text: 'Analysis failed. Please try again.', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl mb-6">
            <h3 className="text-xl font-bold text-white mb-4">AI Pest Detection</h3>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 w-full">
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                            ${selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}
                        `}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="hidden"
                        />

                        {previewUrl ? (
                            <div className="relative h-48 w-full flex items-center justify-center">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-h-full max-w-full rounded-lg shadow-lg border border-slate-700"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 py-6">
                                <p className="text-slate-300 font-medium">Click to upload leaf image</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-64 flex flex-col gap-4">
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className={`py-3 px-6 rounded-xl font-bold text-white transition-all transform shadow-lg
                            ${!selectedFile || uploading ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500'}
                        `}
                    >
                        {uploading ? 'Analyzing...' : 'Analyze Image'}
                    </button>
                    {message && (
                        <div className={`p-3 rounded-lg text-sm font-medium text-center ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'}`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </div>

            {analysisResult && (
                <div className="mt-8 p-6 bg-slate-900/90 border border-emerald-500/30 rounded-2xl shadow-2xl transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`w-3 h-3 rounded-full ${analysisResult.severity === 'High' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                        <h3 className="text-white font-bold text-lg">Field Analysis: {analysisResult.pestType}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Pest Count</p>
                            <p className="text-2xl font-bold text-white">{analysisResult.count}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Risk Level</p>
                            <p className={`text-2xl font-bold ${analysisResult.severity === 'High' ? 'text-red-400' : 'text-emerald-400'}`}>{analysisResult.severity}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-slate-300 text-sm italic bg-slate-800/30 p-4 rounded-xl border border-slate-800">"{analysisResult.reasoning}"</p>
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <p className="text-[10px] text-emerald-500 font-black uppercase mb-1">Recommended Action</p>
                            <p className="text-white text-sm font-medium">{analysisResult.recommendation}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}