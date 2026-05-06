import { HfInference } from "@huggingface/inference";
const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const aiModel = "google/gemma-4-26B-A4B-it";

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
      model: aiModel,
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

export const applyThemeToUI = async (currentHtml, themePrompt) => {
  const systemPrompt = `You are an expert UI Reskinner and Tailwind CSS Master.
Your goal is to take an existing HTML document and completely change its aesthetic based on a user's prompt.

Return ONLY the raw HTML code. DO NOT wrap your response in a JSON object. DO NOT include conversational text.

## CORE RULES:
1. PRESERVE STRUCTURE: You MUST NOT add, remove, or alter any HTML tags, text content, image sources, or overall DOM structure. 
2. OVERHAUL STYLING: You may completely rewrite the Tailwind class="..." attributes to match the user's theme.
3. FORMATTING: Output standard, beautifully formatted, multi-line HTML. 

## MERMAID DIAGRAM RULES:
If the HTML contains a <div class='mermaid'>:
1. PRESERVE FLOW: Leave the layout text exactly as it is (e.g., A --> B). Do not change the text on the arrows.
2. NATURAL LINE BREAKS: Ensure each mermaid statement is on its own line. Do NOT minify it into a single line.
3. THEMING DIAGRAMS: To change colors, ONLY modify the hex color codes inside the classDef statements at the bottom.

User's Theme Request: "${themePrompt}"

Existing HTML to reskin:
${currentHtml}
`;

  try {
    const response = await hf.chatCompletion({
      model: aiModel,
      messages: [{ role: "user", content: systemPrompt }],
      max_tokens: 8000,
      temperature: 0.2,
    });

    const rawOutput = response.choices[0].message.content;

    const cleanedHtml = rawOutput
      .replace(/^```(html)?/i, "") // Remove opening ``` or ```html
      .replace(/```$/, "") // Remove closing ```
      .trim();

    return { html: cleanedHtml };
  } catch (error) {
    console.error("🎨 Theming Inference failed:", error);
    return { html: currentHtml };
  }
};
