/*
 * # minimal permissions, put the input file in .cache
 *
 * deno run --allow-read=.,.cache day-1-sonar-sweep.ts
 *
 * # if you want the solution to be downloaded for you
 *
 * SESSION=<session cookie from browser> \
 *   deno run \
 *     --allow-read=. \
 *     --allow-write=.cache/ \
 *     --allow-net=adventofcode.com \
 *     --allow-env=SESSION \
 *     day-1-sonar-sweep.ts
 */

import { assert } from "https://deno.land/std/testing/asserts.ts";
import { Md5 } from "https://deno.land/std/hash/md5.ts";

const day = await getDay();
const input = await getInput(day);
console.log(await countIncreasing(input));

async function getDay() {
  const module = Deno.mainModule;
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
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      "Cache-Control": "max-age=0",
    },
    "referrer": "https://adventofcode.com/2021/day/1",
    "method": "GET",
    "mode": "cors",
  });

  assert(response.status === 200);
  const text = await response.text();
  Deno.writeTextFile(cachePath, text).catch();
  return text;
}

async function getInput(day: number) {
  return getText(`https://adventofcode.com/2021/day/${day}/input`);
}

async function countIncreasing(input: string) {
  let lastnumber: number | null = null;
  let increasing = 0;

  input
    .split("\n")
    .map((number) => parseInt(number))
    .map((number, index, array) => {
      if (index < 2) return null;
      if (index > array.length - 2) return null;
      return number + array[index - 1] + array[index - 2];
    })
    .forEach((number) => {
      if (lastnumber && number && number > lastnumber) increasing++;
      lastnumber = number;
    });

  return increasing;
}
