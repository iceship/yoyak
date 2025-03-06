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
import { getLogger } from "@logtape/logtape";
import { detect } from "tinyld";
import type { Model } from "./models.ts";

const logger = getLogger(["yoyak", "translate"]);

function getPrompt(language: LanguageCode): string {
  const languageName = authoritativeLabels[language].en;
  return `You are a highly skilled translator with expertise in many languages. \
Your task is to identify the language of the text I provide and accurately translate \
it into the ${languageName} language while preserving the meaning, tone, \
and nuance of the original text. Please maintain proper grammar, spelling, \
and punctuation in the translated version. The input and output are both in Markdown. \
No other information is needed than the text itself.`;
}

/**
 * Options for {@link translate} function.
 */
export interface TranslateOptions {
  /**
   * An optional signal to cancel the operation.
   */
  signal?: AbortSignal;
}

/**
 * Translates the given text into the target language.
 * @param model The model to use for translation.
 * @param text The text to translate.
 * @param targetLanguage The target language code in ISO 639-1.
 * @param options The options for translation.
 * @returns The translated text.
 */
export async function* translate(
  model: Model,
  text: string,
  targetLanguage: LanguageCode,
  options: TranslateOptions = {},
): AsyncIterable<string> {
  if (detect(text) === targetLanguage) {
    yield text;
    return;
  }
  const messages = [
    new SystemMessage(getPrompt(targetLanguage)),
    new HumanMessage(text),
  ];
  logger.debug("Invoking the model with messages: {messages}", { messages });
  const result = await model.stream(messages, { signal: options.signal });
  logger.debug("Received the result: {result}", { result });
  for await (const chunk of result) yield chunk.content.toString();
}
