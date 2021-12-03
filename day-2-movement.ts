// deno run --allow-read=.,.cache day-1-sonar-sweep.ts [input-file]

const path = Deno.args[0] ?? "input";
const input = await Deno.readTextFile(path);
console.log(getPosition(input));

function getPosition(input: string) {
  let [horizontal, depth] = [0, 0];

  input
    .split("\n")
    .map((line) => line.split(" "))
    .forEach(([direction, magnitude]) => {
      if (direction === "forward") horizontal += parseInt(magnitude);
      if (direction === "up") depth -= parseInt(magnitude);
      if (direction === "down") depth += parseInt(magnitude);
    });

  return horizontal * depth;
}
