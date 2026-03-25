const generateTagsAndCategory = async (product_name, description) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_key') {
    throw new Error('Valid OPENROUTER_API_KEY is missing');
  }

  const allowedCategories = [
    'Kitchen', 'Personal Care', 'Packaging', 'Office Supplies', 
    'Transportation', 'Home & Living', 'Grocery', 'Fashion', 'Electronics Accessories'
  ];

  const prompt = `Analyze the following product and provide a categorization.
Product Name: ${product_name}
Description: ${description}

Requirements:
1. Assign a primary category from this exact list only: ${allowedCategories.join(', ')}
2. Suggest a subcategory
3. Generate 5-10 SEO tags (all lowercase)
4. Suggest sustainability filters (e.g., plastic-free, compostable, vegan, recycled)

Return the output in STRICT JSON format with exactly the following structure:
{
  "category": "...",
  "subcategory": "...",
  "tags": ["..."],
  "filters": ["..."]
}

Do not include any markdown formatting, code blocks, or explanations outside the JSON block.`;

  const messages = [
    {
      role: "user",
      content: prompt
    }
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "nvidia/nemotron-3-super-120b-a12b:free",
      "messages": messages,
      "reasoning": {"enabled": true}
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log(result);
  const rawContent = result.choices[0].message.content;

  try {
    let jsonStr = rawContent.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.substring(7);
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.substring(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.substring(0, jsonStr.length - 3);
    }
    
    const startIdx = jsonStr.indexOf('{');
    const endIdx = jsonStr.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
      jsonStr = jsonStr.substring(startIdx, endIdx + 1);
    }

    const parsedData = JSON.parse(jsonStr);
    console.log(parsedData);
    if (!parsedData.category) parsedData.category = 'Unknown';
    if (!Array.isArray(parsedData.tags)) parsedData.tags = [];
    if (!Array.isArray(parsedData.filters)) parsedData.filters = [];

    return { data: parsedData, prompt };
  } catch (error) {
    console.error("Failed to parse JSON from AI response", rawContent);
    throw new Error("AI returned invalid formatted JSON");
  }
};

module.exports = { generateTagsAndCategory };
