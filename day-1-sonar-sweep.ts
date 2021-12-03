// deno run --allow-read=input day-1-sonar-sweep.ts

const path = Deno.args[0] ?? "input";
const input = await Deno.readTextFile(path);
console.log(countIncreasing(input));

function countIncreasing(input: string) {
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
