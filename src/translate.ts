// yoyak: An LLM-powered CLI tool for summarizing web pages
// Copyright (C) 2025 Hong Minhee <https://hongminhee.org/>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import { authoritativeLabels, type LanguageCode } from "@hongminhee/iso639-1";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

function getPrompt(language: LanguageCode): string {
  const languageName = authoritativeLabels[language].en;
  return `You are a highly skilled translator with expertise in many languages. \
Your task is to identify the language of the text I provide and accurately translate \
it into the ${languageName} language while preserving the meaning, tone, \
and nuance of the original text. Please maintain proper grammar, spelling, \
and punctuation in the translated version. The input and output are both in Markdown.`;
}

/**
 * Translates the given text into the target language.
 * @param text The text to translate.
 * @param targetLanguage The target language code in ISO 639-1.
 * @returns The translated text.
 */
export async function translate(
  text: string,
  targetLanguage: LanguageCode,
): Promise<string> {
  const messages = [
    new SystemMessage(getPrompt(targetLanguage)),
    new HumanMessage(text),
  ];
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-exp",
    maxRetries: 2,
  });
  const result = await llm.invoke(messages);
  return result.content.toString();
}
