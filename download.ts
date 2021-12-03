import { assert } from "https://deno.land/std/testing/asserts.ts";
import { Md5 } from "https://deno.land/std/hash/md5.ts";

export async function getDay() {
  const module = Deno.args[0];
  console.log(Deno.args);
  if (!module.startsWith("file://")) throw new Error("Please run as a script");
  const dayPattern = /day-(\d+)-/;
  const day = dayPattern.exec(module)?.[1];
  if (day === undefined) throw new Error("Cannot find the day from filename");
  return parseInt(day);
}

async function getText(url: string) {
  const cachePath = [".cache", new Md5().update(url).toString()].join("/");
  try {
    const file = await Deno.readTextFile(cachePath);
    return file;
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }

  const SESSION = Deno.env.get("SESSION");
  if (!SESSION) {
    throw new Error(
      `Please set SESSION cookie or download input to ${cachePath}`,
    );
  }
  const response = await fetch(url, {
    "credentials": "include",
    "headers": {
      "Cookie": `session=${SESSION}`,
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      "Cache-Control": "max-age=0",
    },
    "referrer": url.replace("/input", ""),
    "method": "GET",
    "mode": "cors",
  });

  assert(response.status === 200);
  const text = await response.text();
  Deno.writeTextFile(cachePath, text).catch();
  return text;
}

export async function getInput(day: number) {
  return getText(`https://adventofcode.com/2021/day/${day}/input`);
}
