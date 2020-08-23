import bbc from './child';

export default async function abc(num: number): Promise<number> {
  return 2 + num + bbc(num);
}

function test() {
  console.log(abc(456));
}

test();
