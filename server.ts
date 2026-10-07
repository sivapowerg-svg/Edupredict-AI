import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini if API key is provided
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'EduPredict AI Backend',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // POST /api/ai-recommendation: Generates deep personalized pedagogical recommendations
  app.post('/api/ai-recommendation', async (req, res) => {
    try {
      const {
        studentName,
        rollNo,
        attendance,
        internalMarks,
        assignmentScore,
        participation,
        previousScore,
        predictedScore,
        riskLevel,
        expectedGrade,
      } = req.body;

      if (!ai) {
        // Return structured intelligent pedagogical fallback if API key is not yet configured
        return res.json({
          source: 'local-heuristic-engine',
          summary: `${studentName || 'The student'} is categorized as ${riskLevel} Risk with a predicted score of ${predictedScore}% (Grade ${expectedGrade}). Primary focal point is ${
            attendance < 75 ? 'recovering mandatory lecture attendance' : 'reinforcing mid-term exam preparation'
          }.`,
          immediateAction:
            attendance < 75
              ? `Initiate mandatory attendance intervention. Student needs to attend upcoming lectures to cross 75%.`
              : `Review assignment submissions and organize problem-solving tutorial session with lab assistants.`,
          remedialFocusAreas: [
            internalMarks < 65 ? 'Core conceptual syllabus review' : 'Advanced algorithmic challenges',
            assignmentScore < 70 ? 'Milestone-based project submission' : 'Collaborative peer coding',
            participation < 65 ? 'Low-pressure classroom discussions' : 'Technical presentation opportunities',
          ],
          parentCommunicationAdvice:
            riskLevel === 'HIGH'
              ? 'Send formal institutional notification outlining attendance status and recommend scheduled advisory call.'
              : 'Standard progress bulletin with commendation on strengths and notes for improvement.',
          monitoringCadence: riskLevel === 'HIGH' ? 'Weekly check-in' : 'Fortnightly review',
        });
      }

      const prompt = `Analyze this student academic telemetry data:
Student Name: ${studentName || 'Student'}
Roll Number: ${rollNo || 'N/A'}
Attendance: ${attendance}% (cutoff is 75%)
Internal Exam Marks: ${internalMarks}%
Assignment Score: ${assignmentScore}%
Class Participation: ${participation}%
Previous Academic Record: ${previousScore}%
Predicted Score: ${predictedScore}%
Risk Level: ${riskLevel}
Expected Grade: ${expectedGrade}

Provide an authoritative, empathetic pedagogical action plan for faculty.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an expert pedagogical advisor embedded in an institutional higher-education university system.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'Concise 2-sentence executive summary of student trajectory',
              },
              immediateAction: {
                type: Type.STRING,
                description: 'Concrete step faculty should take within 48 hours',
              },
              remedialFocusAreas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 3 key topic areas needing reinforcement',
              },
              parentCommunicationAdvice: {
                type: Type.STRING,
                description: 'Clear guidance on how to engage parents or guardians',
              },
              monitoringCadence: {
                type: Type.STRING,
                description: 'Recommended follow-up cadence, e.g. Weekly review',
              },
            },
            required: [
              'summary',
              'immediateAction',
              'remedialFocusAreas',
              'parentCommunicationAdvice',
              'monitoringCadence',
            ],
          },
        },
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText.trim());
          return res.json({ source: 'gemini-3.8-flash', ...parsed });
        } catch {
          return res.json({
            source: 'gemini-3.8-flash-text',
            summary: responseText.slice(0, 200),
            immediateAction: 'Schedule an individual faculty-student consultation.',
            remedialFocusAreas: ['Conceptual foundations', 'Attendance adherence'],
            parentCommunicationAdvice: 'Send standard progress update notification.',
            monitoringCadence: 'Weekly review',
          });
        }
      }

      res.status(500).json({ error: 'Empty response from AI model' });
    } catch (err: unknown) {
      console.error('Error generating AI recommendation:', err);
      res.json({
        source: 'fallback-on-error',
        summary: `Prediction analysis indicates ${req.body.riskLevel || 'academic'} attention required. Attendance stands at ${req.body.attendance}%.`,
        immediateAction: 'Schedule a faculty advisory check-in session.',
        remedialFocusAreas: ['Lecture attendance continuity', 'Internal test revision'],
        parentCommunicationAdvice: 'Deliver formal mid-semester academic update.',
        monitoringCadence: 'Weekly review',
      });
    }
  });

  // Setup Vite dev server or serve static build
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduPredict AI server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
