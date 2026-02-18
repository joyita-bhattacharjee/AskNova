import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("OpenRouter Response:", data);

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }

    return "No AI response received";

  } catch (err) {
    console.log("OpenRouter Error:", err);
    return "Error generating AI response";
  }
};

export default getOpenAIAPIResponse;
