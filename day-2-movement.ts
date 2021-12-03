// deno run --allow-read=.,.cache day-1-sonar-sweep.ts [input-file]

const path = Deno.args[0] ?? "input";
const input = await Deno.readTextFile(path);
console.log(getPosition(input));

function getPosition(input: string) {
  let [horizontal, depth] = [0, 0];
  let aim = 0;

  input
    .split("\n")
    .map((line) => line.split(" "))
    .forEach(([direction, magnitude]) => {
      const units = parseInt(magnitude);

      if (direction === "up") aim -= units;
      if (direction === "down") aim += units;

      if (direction === "forward") {
        horizontal += units;
        depth += aim * units;
      }
    });

  return horizontal * depth;
}
