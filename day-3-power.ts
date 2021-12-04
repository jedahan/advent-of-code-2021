// deno run --allow-read=input day-3-power.ts

const path = Deno.args[0] ?? "input";
const input = (await Deno.readTextFile(path)).split("\n");
console.log(lifeSupportRating(input));

function lifeSupportRating(input: string[]) {
  const oxygenRating = rating(input, true);
  const scrubberRating = rating(input, false);
  return oxygenRating * scrubberRating;
}

function rating(input: string[], mostCommon: boolean) {
  let index = 0;

  while (input.length > 1) {
    const digitSum = input
      .map((line) => line[index] === "0" ? -1 : 1)
      .reduce((prev, curr) => prev + curr, 0);

    const digit = mostCommon
      ? (digitSum >= 0 ? "0" : "1")
      : (digitSum >= 0 ? "1" : "0");

    input = input.filter((line) => line[index] === digit);

    index++;
  }

  return parseInt(input[0], 2);
}
