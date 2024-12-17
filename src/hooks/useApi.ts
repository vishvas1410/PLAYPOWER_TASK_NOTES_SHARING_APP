import axios from "axios";
import { useEffect, useState } from "react";

type TermDetails = {
  term: string;
  description: string;
};

const useApi = () => {
  const [response, setResponse] = useState<TermDetails[]>([]); // State for the full response
  const [terms, setTerms] = useState<string[]>([]); // State for terms
  const [descriptions, setDescriptions] = useState<string[]>([]); // State for descriptions
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading indicator
  const API = import.meta.env.VITE_OPEN_API; // Your API key

  const handleFetchKeyTerms = async (text: string) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "https://api.x.ai/v1/chat/completions",
        {
          messages: [
            {
              role: "system",
              content:
                'You are an assistant that identifies key terms in a given text and provides their definitions. Return an array of terms as JSON only. Do not include backticks, code blocks, or any additional text. Format the response like this: [ { "term": "term_name", "description": "term_description" }, { "term": "another_term", "description": "another_description" } ]',
            },
            {
              role: "user",
              content: `Identify key terms in the following text: ${text}`,
            },
          ],
          model: "grok-beta",
        },
        {
          headers: {
            Authorization: `Bearer ${API}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data?.choices?.[0]?.message?.content) {
        const rawContent = data.choices[0].message.content;

        // Parse JSON response into an array
        const parsedResponse: TermDetails[] = JSON.parse(rawContent);
        setResponse(parsedResponse); // Store the full response
      } else {
        console.warn("Unexpected API response format:", data);
      }
    } catch (e) {
      console.error("Error fetching terms:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Separate terms and descriptions whenever the response updates
  useEffect(() => {
    if (response.length > 0) {
      const termData = response.map((item) => item.term);
      const descriptionData = response.map((item) => item.description);

      setTerms(termData); // Update terms state
      setDescriptions(descriptionData); // Update descriptions state
    }
  }, [response]);

  return {
    handleFetchKeyTerms,
    response, // Full response with both term and description
    terms, // Array of terms
    descriptions, // Array of descriptions
    isLoading, // Loading state
  };
};

export default useApi;
