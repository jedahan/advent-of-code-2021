// deno run --allow-read=input day-3-sonar-sweep.ts

const path = Deno.args[0] ?? "input";
const input = (await Deno.readTextFile(path)).split('\n');
console.log(lifeSupportRating(input));

function lifeSupportRating(input: string[]) {
  const oxygenRating = rating(input, true)
  const scrubberRating = rating(input, false)
  return oxygenRating * scrubberRating
}

function rating(input: string[], invert: boolean) {
  let rating: string[] = []

  while(input.length > 1) {
    const digitSum = input
      .map((line) => line[rating.length] === '0' ? -1 : 1)
      .reduce((prev, curr) => prev + curr, 0)
    
    const digit = invert 
      ? (digitSum >= 0 ? '0' : '1') // if most common is 1, take 0
      : (digitSum >= 0 ? '1' : '0') // if most common is 1, take 1
    
    rating.push(digit)

    input = input.filter((line) => line[rating.length-1] === digit)
  }

  const ratingValue = parseInt(input[0], 2)
  return ratingValue
}