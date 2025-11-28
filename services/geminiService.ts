import { GoogleGenAI } from "@google/genai";
import { NewsItem, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to parse the custom text format we ask Gemini for
const parseNewsResponse = (text: string): NewsItem[] => {
  const items: NewsItem[] = [];
  const rawItems = text.split('###ITEM###').filter(i => i.trim().length > 0);

  rawItems.forEach((raw, index) => {
    const titleMatch = raw.match(/Title:\s*(.+)/);
    const sourceMatch = raw.match(/Source:\s*(.+)/);
    const dateMatch = raw.match(/Date:\s*(.+)/);
    const summaryMatch = raw.match(/Summary:\s*(.+)/);
    const tagsMatch = raw.match(/Tags:\s*(.+)/);
    const urlMatch = raw.match(/URL:\s*(.+)/);

    if (titleMatch && summaryMatch) {
      items.push({
        id: `gen-${Date.now()}-${index}`,
        title: titleMatch[1].trim(),
        source: sourceMatch ? sourceMatch[1].trim() : 'Industry News',
        date: dateMatch ? dateMatch[1].trim() : 'Recent',
        summary: summaryMatch[1].trim(),
        tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : ['Digital Marketing'],
        url: urlMatch ? urlMatch[1].trim() : undefined,
      });
    }
  });

  return items;
};

export const fetchSEONews = async (sources: string[]): Promise<{ items: NewsItem[], grounding: GroundingSource[] }> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    You are an expert Digital Marketing and SEO News aggregator.
    
    Task: Search the ENTIRE web for the latest, most important updates in SEO and Digital Marketing.
    Do NOT limit yourself to specific blogs. Look for breaking news, official documentation updates, and high-impact articles from any credible source.
    
    Key Topics:
    - Google Core Updates & Algorithm Changes
    - New SEO Features (AI Overviews, Rich Snippets)
    - Major Digital Marketing Platform Updates (Meta, LinkedIn, TikTok)
    - Technical SEO breakthroughs
    - Content Strategy shifts
    
    Timeframe: Last 7 days (prioritize last 24-48 hours).
    
    CRITICAL REQUIREMENT:
    - You MUST provide a valid, direct URL for every single news item.
    - If a direct URL is not found, do not include the item.
    - Diversify sources. Do not just use one website.
    
    Format the output strictly as follows for each news item found (find at least 6-8 high quality items):
    
    ###ITEM###
    Title: [Engaging Article Headline]
    Source: [Publication Name]
    Date: [e.g., Oct 24, 2023]
    Summary: [A clear, easy-to-read summary (approx 40-50 words). Focus on the "What" and "Why it matters".]
    Tags: [Tag1, Tag2, Tag3]
    URL: [https://...]
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || '';
    const items = parseNewsResponse(text);
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingSources: GroundingSource[] = groundingChunks
      .filter(chunk => chunk.web?.uri && chunk.web?.title)
      .map(chunk => ({
        title: chunk.web!.title!,
        uri: chunk.web!.uri!
      }));

    return { items, grounding: groundingSources };

  } catch (error) {
    console.error("Error fetching SEO news:", error);
    throw error;
  }
};