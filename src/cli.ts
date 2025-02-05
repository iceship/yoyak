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
import { Command } from "@cliffy/command";
import metadata from "../deno.json" with { type: "json" };
import { scrape } from "./scrape.ts";

const scrapeCommand = new Command()
  .arguments("<url:string>")
  .description("Scrape a web page and return the content in Markdown format.")
  .action(async (_options: never, url: string) => {
    const result = await scrape(url);
    if (result == null) {
      console.error("Failed to scrape the web page.");
      Deno.exit(1);
    }
    console.log(result);
  });

const command = new Command()
  .name("yoyak")
  .version(metadata.version)
  .meta("License", "GPL-3.0")
  .description("An LLM-powered CLI tool for summarizing web pages.")
  .command("scrape", scrapeCommand);

if (import.meta.main) {
  await command.parse(Deno.args);
}
