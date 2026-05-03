import { HfInference } from "@huggingface/inference";

const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

// Initialize the official client
const hf = new HfInference(API_KEY);

const systemPrompt = `You are an expert UX Architect, Senior Frontend Developer, and Systems Engineer. Analyze this hand-drawn sketch and convert it into the appropriate format.

Return ONLY a valid JSON object wrapped in \`\`\`json fences. No conversational text.
Schema to return: { "html": "<Complete HTML string>" }

## Mode Detection & Directives (CRITICAL):
Analyze the sketch to determine which of the following 3 modes to use:

1. MODE A: ARCHITECTURE DIAGRAM / FLOWCHART
If the sketch contains boxes connected by arrows, database cylinders, or cloud architecture, generate a stylized Mermaid.js diagram. 
Execution: Output a complete HTML document. 
Include this script: <script type='module'>import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs'; mermaid.initialize({startOnLoad:true, theme:'neutral'});</script>.
Layout: Wrap the diagram in a beautiful presentation card using Tailwind: <body class='bg-gray-100 flex items-center justify-center min-h-screen p-8'><div class='w-full max-w-4xl bg-white p-10 rounded-2xl shadow-xl border border-gray-200'><h2 class='text-2xl font-bold text-slate-800 mb-8 text-center'>System Architecture</h2><div class='mermaid flex justify-center text-lg'></div></div></body>.
MERMAID SYNTAX RULES (CRITICAL): 
- Start with 'flowchart LR' or 'flowchart TD'.
- INFER INTENT: Understand the technical flow. Automatically add descriptive labels to the arrows (e.g., A -- 'Sends JSON' --> B) to explain how the system interacts.
- Use proper shapes: [Node] for servers/clients, [(Database)] for databases/storage, ((Cloud)) for external APIs.
- CUSTOM STYLING: Add these exact CSS classes at the bottom of your mermaid syntax to make it look professional:
  classDef default fill:#f8fafc,stroke:#94a3b8,stroke-width:2px,color:#0f172a,rx:8,ry:8;
  classDef db fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e40af;
  classDef client fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;
  Apply these classes to your nodes (e.g., B[(Database)]:::db).

2. MODE B: LOW-FIDELITY WIREFRAME
If the sketch is very rough, blocky, or looks like a structural blueprint, build a structural wireframe.
Execution: Use Tailwind CSS via CDN. STRICTLY grayscale. Use dashed borders (border-2 border-dashed border-gray-400), solid gray blocks for images (bg-gray-200 flex items-center justify-center), and generic placeholder text. Do not use brand colors.

3. MODE C: PRODUCTION UI
If the sketch looks like a standard app screen or website, build a polished UI.
Execution: Use Tailwind CSS via CDN. Apply modern styling, attractive colors, rounded corners, and realistic high-quality placeholders (e.g., <img src='https://picsum.photos/seed/ui/800/600' />). Center single components on the screen.

## Global Rules:
- STRICT ADHERENCE: Do not invent extra sections (like footers) that are not in the sketch.
- JSON SAFETY: Inside the "html" string, you MUST use SINGLE QUOTES for all HTML attributes. DO NOT use double quotes inside the HTML to prevent JSON parsing crashes.`;

export const generateUISchema = async (base64Image) => {
  console.log("🤖 Initializing AI inference via Hugging Face SDK...");

  try {

    const response = await hf.chatCompletion({
      model: "google/gemma-4-31B-it",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: systemPrompt,
            },
            {
              type: "image_url",
              image_url: { url: base64Image },
            },
          ],
        },
      ],
      max_tokens: 10000,
    });

    let rawText = response.choices[0].message.content;

    // Clean up any potential markdown code blocks the AI might inject
    let cleanJsonString = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJsonString);
  } catch (error) {
    console.warn(
      "⚠️ AI Inference failed or timed out. Initializing Fallback Demo Mode.",
      error,
    );
  }
};
