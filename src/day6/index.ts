//https://adventofcode.com/2025/day/4

import { describe, expect, test } from "bun:test";

class MathMachineP1 {
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

class MathMachineP2 {
	grandTotal = 0;
	constructor(input: string) {
		input = input.trim();

		const matrix = input.split("\n").map((l) => l.split(""));
		const operationLine = matrix.pop()!;

		//@ts-ignore lovely function from the engine. :P
		const transpose = <T extends string[][]>(m: T): T => m[0].map((_, y) => m.map((row) => row[y]));

		let numsStr: string[][][] = [];
		let tempNums: string[] = [];

		let i = 0;
		while (matrix.find((l) => l.length)) {
			const char = operationLine[i] ?? " ";
			if (char === " ") {
				tempNums = tempNums.map((n, i) => (n += matrix[i]?.shift() ?? " "));
			} else {
				if (tempNums.length) {
					numsStr.push(transpose(tempNums.map((n) => n.split(""))).slice(0, -1));
				}
				tempNums = matrix.map((l) => l.shift()!);
			}

			i++;
		}
		numsStr.push(transpose(tempNums.map((n) => n.split("")))); //*MIJN~ VIER~ IS~ HIER~!* (if you know, you know.)

		const operations = operationLine.join("").replace(/ +/g, " ").split(" ");

		for (let i = 0; i < operations.length; i++) {
			const operation = operations[i];
			const nums = numsStr.shift()!.map((e) => parseInt(e.join("")));

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
		const Calculatinator = new MathMachineP1(example);

		expect(Calculatinator.grandTotal).toEqual(4277556);
	});

	test("Elven Math Homework", async () => {
		const { default: input } = await import("./input.txt");
		const Calculatinator = new MathMachineP1(input);

		console.log(`The calculatinator calculates : ${Calculatinator.grandTotal} .`);
	});
});

describe("Part 2", () => {
	test("Example Crab Math Homework", async () => {
		const { default: example } = await import("./example.txt");
		const Calculatinator = new MathMachineP2(example);

		expect(Calculatinator.grandTotal).toEqual(3263827);
	});

	test("Crab Math Homework", async () => {
		const { default: input } = await import("./input.txt");
		const Calculatinator = new MathMachineP2(input);

		console.log(`The calculatinator calculates : ${Calculatinator.grandTotal} .`);
	});
});
