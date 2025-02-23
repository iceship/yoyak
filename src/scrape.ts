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
import { getLogger } from "@logtape/logtape";
import { Readability } from "@paoramen/cheer-reader";
import { detect } from "chardet";
import { load } from "cheerio";
import iconv from "iconv-lite";
import { Buffer } from "node:buffer";
import TurndownService from "turndown";
import metadata from "../deno.json" with { type: "json" };

const logger = getLogger(["yoyak", "scrape"]);

const DEFAULT_USER_AGENT =
  `Yoyak/${metadata.version} (Deno/${Deno.version.deno})`;

/**
 * Options for the {@link scrape} function.
 */
export interface ScrapeOptions {
  /**
   * The `User-Agent` header to send in the HTTP request.
   */
  readonly userAgent?: string;
}

const turndownService = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

/**
 * Scrapes the given web page URL and returns the content in Markdown format.
 * @param url The web page URL to scrape.
 * @returns The content of the web page in Markdown format.
 */
export async function scrape(
  url: string | URL,
  options: ScrapeOptions = {},
): Promise<string | undefined> {
  const userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
  const response = await fetch(url, {
    headers: { "User-Agent": userAgent },
  });
  if (response.status >= 400) {
    logger.debug("Failed to fetch the web page: {response}", { response });
    return undefined;
  }
  const contentType = response.headers.get("Content-Type");
  const body = new Uint8Array(await response.arrayBuffer());
  const charset = contentType?.match(/charset=([^;]+)/)?.[1] ?? detect(body);
  const content = charset == null || charset.match(/^\s*utf-?8\s*$/i)
    ? new TextDecoder().decode(body)
    : iconv.decode(Buffer.from(body), charset);
  const $ = load(content);
  const result = new Readability($).parse();
  if (result.content == null) {
    logger.debug("Failed to extract content from the web page.");
    return undefined;
  }
  let md: string = turndownService.turndown(result.content);
  if (!md.match(/^\s*#\s/)) {
    md = `# ${result.title}\n\n${md}`;
  }
  return md;
}
