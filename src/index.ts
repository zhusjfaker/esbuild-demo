export default async function abc(num: number): Promise<number> {
  const a = await import("./child");
  const bbc = a.default;
  return 2 + num + bbc(num);
}

async function test() {
  console.log(abc(456));
}

test();
