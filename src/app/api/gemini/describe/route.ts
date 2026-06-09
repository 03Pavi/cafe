import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const body = await request.json();
    const { name, category, price } = body;

    if (!name) {
      return NextResponse.json({ error: "Item name is required" }, { status: 400 });
    }

    // Fallback descriptor if the Gemini API Key is not set or configured
    if (!apiKey) {
      const fallbackDescription = `Indulge in our delicious, freshly crafted ${name} from our ${category || "menu"} selection. Prepared fresh to order.`;
      return NextResponse.json({ 
        description: fallbackDescription,
        notice: "Gemini API key is not set in environment variables. Used fallback generation."
      });
    }

    const prompt = `Write a premium, mouth-watering, and concise description (maximum 15 words) for a café menu item. 
Item Name: ${name}
Category: ${category || "Beverage/Food"}
Price: ${price ? "₹" + price : ""}
Focus on its flavor profile, aroma, and premium texture. Do not include quotes, HTML, or markdown. Make it feel inviting and warm.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Gemini API call failed, using fallback:", errText);
      const fallbackDescription = `Indulge in our delicious, freshly crafted ${name} from our ${category || "menu"} selection. Prepared fresh to order.`;
      return NextResponse.json({ 
        description: fallbackDescription,
        notice: "Gemini API request failed. Used fallback generation."
      });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!generatedText) {
      throw new Error("Empty response from Gemini API");
    }

    return NextResponse.json({ description: generatedText });
  } catch (error: any) {
    console.error("Gemini description error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate description with Gemini" },
      { status: 500 }
    );
  }
}
