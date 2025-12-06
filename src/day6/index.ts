//https://adventofcode.com/2025/day/4

import { describe, expect, test } from "bun:test";

class MathMachine {
	grandTotal = 0;
	constructor(input: string) {
		const parsed = input
			.trim()
			.replace(/ +/g, " ")
			.split("\n")
			.map((l) => l.trim().split(" "));

		//@ts-ignore lovely function from the engine. :P
		const transpose = <T extends string[][]>(m: T): T => m[0].map((_, y) => m.map((row) => row[y]));

		const formulas = transpose(parsed);
		for (const formula of formulas) {
			const operation = formula.pop();
			const nums = formula.map(Number);
			let res = nums.shift()!;
			for (const num of nums) {
				if (operation === "*") {
					res *= num;
				} else {
					res += num;
				}
			}

			this.grandTotal += res;
		}
	}
}

describe("Part 1", () => {
	test("Example Elven Math Homework", async () => {
		const { default: example } = await import("./example.txt");
		const Calculatinator = new MathMachine(example);

		expect(Calculatinator.grandTotal).toEqual(4277556);
	});

	test("Elven Math Homework", async () => {
		const { default: input } = await import("./input.txt");
		const Calculatinator = new MathMachine(input);

		console.log(`The calculatinator calculates : ${Calculatinator.grandTotal} .`);
	});
});
