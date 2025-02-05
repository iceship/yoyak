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
import { ChatAnthropic } from "@langchain/anthropic";
import type { BaseChatModel } from "@langchain/core";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

/**
 * The list of available models.
 */
export const modelMonikers = [
  "chatgpt-4o-latest",
  "claude-3-5-haiku-latest",
  "claude-3-5-sonnet-latest",
  "claude-3-opus-latest",
  "deepseek-chat",
  "deepseek-reasoner",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-2.0-flash-exp",
  "gpt-4o",
  "gpt-4o-mini",
  "o1",
  "o1-mini",
  "o1-preview",
  "o3-mini",
] as const;

/**
 * The type of a model.
 */
export type ModelMoniker = typeof modelMonikers[number];

/**
 * The constructor of a model.
 */
export type Model = new (options: { model: ModelMoniker }) => BaseChatModel;

/**
 * The map of model monikers to model constructors.
 */
export const models: Record<ModelMoniker, Model> = {
  "chatgpt-4o-latest": ChatOpenAI,
  "claude-3-5-haiku-latest": ChatAnthropic,
  "claude-3-5-sonnet-latest": ChatAnthropic,
  "claude-3-opus-latest": ChatAnthropic,
  "deepseek-chat": ChatDeepSeek,
  "deepseek-reasoner": ChatDeepSeek,
  "gemini-1.5-flash": ChatGoogleGenerativeAI,
  "gemini-1.5-flash-8b": ChatGoogleGenerativeAI,
  "gemini-1.5-pro": ChatGoogleGenerativeAI,
  "gemini-2.0-flash-exp": ChatGoogleGenerativeAI,
  "gpt-4o": ChatOpenAI,
  "gpt-4o-mini": ChatOpenAI,
  "o1": ChatOpenAI,
  "o1-mini": ChatOpenAI,
  "o1-preview": ChatOpenAI,
  "o3-mini": ChatOpenAI,
};
