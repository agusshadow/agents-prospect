import { createGoogleGenerativeAI } from "@ai-sdk/google";

import type { LanguageModel } from "ai";

export function getModel(provider: string, model: string): LanguageModel {
  switch (provider) {
    case "google": {
      const google = createGoogleGenerativeAI({
        apiKey: process.env["GOOGLE_GENERATIVE_AI_API_KEY"] ?? "",
      });
      return google(model);
    }
    default: {
      throw new Error(`Provider "${provider}" no soportado aún. Usar "google".`);
    }
  }
}
