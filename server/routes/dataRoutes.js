const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Import Models
const PestDetection = require('../models/PestDetection');
const SensorData = require('../models/SensorData');

// 1. Configure Multer (Image Storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// 2. Initialize Gemini AI (Using Gemini 3 Flash for speed and reasoning)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

/**
 * @route   POST /api/data/detect
 * @desc    AI Image Analysis - Fixed to use Gemini 3 agentic reasoning
 */
router.post('/detect', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image provided' });

        const imagePath = path.resolve(req.file.path);
        const imageBase64 = fs.readFileSync(imagePath).toString('base64');

        const prompt = `
    Analyze this polyhouse leaf image as an expert Agricultural AI Pathologist.
    
    CRITICAL GRADING SCALE FOR SEVERITY:
    - LOW: Leaf is mostly healthy. Fewer than 5 pests visible OR very minor spotting (<5% of leaf area).
    - MEDIUM: 5-15 pests visible OR clear signs of curling, yellowing, or holes (5-20% of leaf area).
    - HIGH: Over 15 pests visible OR severe structural damage, necrosis, or dense webbing (>20% of leaf area).

    If the leaf is perfectly healthy, set pestType to "None", count to 0, and severity to "Low".

    Return ONLY a raw JSON object with this EXACT structure:
    {
        "pestType": "Common name of the pest",
        "count": number,
        "confidence": number (between 0 and 1),
        "severity": "Low" | "Medium" | "High",
        "reasoning": "Explain the specific visual evidence (e.g., 'Found 8 aphids on the underside', 'Yellow halo spots seen').",
        "recommendation": "Provide one specific, chemical-free organic farming action."
    }
`;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: imageBase64, mimeType: req.file.mimetype } }
        ]);

        const text = result.response.text();
        let analysis;
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            analysis = JSON.parse(jsonMatch ? jsonMatch[0] : text);
        } catch (e) {
            throw new Error("Failed to parse AI structured response");
        }

        const detection = new PestDetection({
            pestType: analysis.pestType || "Unidentified",
            count: Number(analysis.count) || 0,
            confidence: Number(analysis.confidence) || 0,
            severity: analysis.severity || "Low",
            reasoning: analysis.reasoning || "Standard AI visual analysis completed.",
            recommendation: analysis.recommendation || "Maintain standard monitoring.",
            imageUrl: req.file.path
        });

        await detection.save();
        res.json({ message: 'Success', data: detection });

    } catch (err) {
        console.error("DETECTION ERROR:", err.message);
        res.status(500).json({ error: 'Internal detection failure' });
    }
});

/**
 * @route   GET /api/data/seed
 * @desc    DYNAMIC SEEDING: Fixed the "repeating text" bug
 */
router.get('/seed', async (req, res) => {
    try {
        await PestDetection.deleteMany({});
        await SensorData.deleteMany({});

        // --- DYNAMIC KNOWLEDGE BASE FOR DIVERSE LOGS ---
        const pestMap = {
            'Aphids': {
                r: "Clusters of small green/black insects found on new growth.",
                a: "Apply organic neem oil spray and increase airflow."
            },
            'Whiteflies': {
                r: "Cloud of tiny white insects emerged when leaf was shaken.",
                a: "Install yellow sticky traps and introduce Encarsia formosa."
            },
            'Thrips': {
                r: "Silvery scars and black specks (frass) visible on leaves.",
                a: "Use blue sticky traps and maintain high humidity."
            },
            'Scale Insects': {
                r: "Waxy, stationary brown bumps found along the leaf veins.",
                a: "Prune heavily infested stems and scrub remaining with soapy water."
            }
        };

        const mockPests = Array.from({ length: 15 }).map((_, i) => {
            const types = Object.keys(pestMap);
            const selectedType = types[Math.floor(Math.random() * types.length)];

            return {
                pestType: selectedType,
                count: Math.floor(Math.random() * 75) + 5,
                confidence: 0.95,
                severity: Math.random() > 0.7 ? 'High' : 'Low',
                reasoning: pestMap[selectedType].r,
                recommendation: pestMap[selectedType].a,
                createdAt: new Date(Date.now() - i * 86400000)
            };
        });

        const mockSensors = Array.from({ length: 20 }).map((_, i) => ({
            temperature: 20 + Math.random() * 10,
            humidity: 45 + Math.random() * 35,
            soilMoisture: 30 + Math.random() * 30,
            riskLevel: 'Low',
            createdAt: new Date(Date.now() - i * 3600000)
        }));

        await PestDetection.insertMany(mockPests);
        await SensorData.insertMany(mockSensors);

        res.status(201).json({ message: 'DB Seeded with Diverse Gemini 3 Data' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GET ROUTES ---
router.get('/pests', async (req, res) => {
    const data = await PestDetection.find().sort({ createdAt: 1 });
    res.json(data);
});

router.get('/sensors', async (req, res) => {
    const data = await SensorData.find().sort({ createdAt: 1 });
    res.json(data);
});

module.exports = router;