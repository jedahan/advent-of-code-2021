// deno run --allow-read=input day-3-sonar-sweep.ts

const path = Deno.args[0] ?? "input";
const input = await Deno.readTextFile(path);
console.log(powerConsumption(input));

function powerConsumption(input: string) {
  let sums: number[] = []

  input
    .split("\n")
    .map(binary => binary.split('').map(binstring => binstring==='0' ? -1 : 1))
    .forEach(binstring => binstring.forEach((value, index) => {
      if (index >= sums.length) return sums.push(value)
      sums[index] += value
    }))

  const gamma = parseInt(sums.map((sum) => sum > 0 ? '1' : '0').join(''), 2)
  const epsilon = parseInt(sums.map((sum) => sum < 0 ? '1' : '0').join(''), 2)

  return gamma * epsilon
}
