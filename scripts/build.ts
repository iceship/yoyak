// build.ts: The build script is a Deno script that compiles the Yoyak CLI for
//           multiple platforms and creates an archive file for each platform.
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
import $ from "@david/dax";
import { copy, ensureDir } from "@std/fs";
import { dirname, join } from "@std/path";

interface Target {
  triple: string;
  moniker: string;
  binName: string;
  archive: "tar.bz2" | "zip";
}

const targets: Target[] = [
  {
    triple: "x86_64-unknown-linux-gnu",
    moniker: "linux-x86_64",
    binName: "yoyak",
    archive: "tar.bz2",
  },
  {
    triple: "aarch64-unknown-linux-gnu",
    moniker: "linux-aarch64",
    binName: "yoyak",
    archive: "tar.bz2",
  },
  {
    triple: "x86_64-apple-darwin",
    moniker: "macos-x86_64",
    binName: "yoyak",
    archive: "tar.bz2",
  },
  {
    triple: "aarch64-apple-darwin",
    moniker: "macos-aarch64",
    binName: "yoyak",
    archive: "tar.bz2",
  },
  {
    triple: "x86_64-pc-windows-msvc",
    moniker: "windows-x86_64",
    binName: "yoyak.exe",
    archive: "zip",
  },
];

if (!await $.commandExists("tar")) {
  $.logError("tar is not installed.");
  Deno.exit(1);
} else if (!await $.commandExists("bzip2")) {
  $.logError("bzip2 is not installed.");
  Deno.exit(1);
} else if (!await $.commandExists("7z")) {
  $.logError("7z is not installed.");
  Deno.exit(1);
}

const ROOT = dirname(import.meta.dirname!);
const DIST = join(ROOT, "dist");
const EXTRA_FILES = ["CHANGES.md", "LICENSE", "README.md"];

await ensureDir(DIST);

const promises = targets.map(async ({ triple, moniker, binName, archive }) => {
  const tempDir = await Deno.makeTempDir();
  const tempFile = join(tempDir, binName);
  await $`deno compile
    --target ${triple}
    --output ${tempFile}
    --allow-net
    --allow-env
    ${join(ROOT, "src", "cli.ts")}`;
  for (const file of EXTRA_FILES) {
    await copy(join(ROOT, file), join(tempDir, file));
  }
  const archiveFile = join(DIST, `yoyak-${moniker}.${archive}`);
  if (archive === "tar.bz2") {
    await $`chmod +x ${tempFile}`;
    await $`tar cvfj ${archiveFile} ${binName} ${EXTRA_FILES}`.cwd(tempDir);
  } else {
    await $`7z a ${archiveFile} ${binName} ${EXTRA_FILES}`
      .cwd(tempDir);
  }
  return archiveFile;
});

async function* streamInOrder<T>(promises: Promise<T>[]): AsyncIterable<T> {
  const pending = promises.map((p, index) =>
    p.then((value) => ({ value, index }))
  );

  const remaining = [...pending];

  while (remaining.length > 0) {
    const winner = await Promise.race(remaining);
    remaining.splice(
      remaining.findIndex((p) => p === pending[winner.index]),
      1,
    );
    yield winner.value;
  }
}

for await (const archiveFile of streamInOrder(promises)) {
  console.log(`Created ${archiveFile}`);
}

// cSpell: ignore msvc cvfj
