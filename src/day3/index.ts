//https://adventofcode.com/2025/day/3

import { describe, expect, test } from "bun:test";

class JoltageMachine {
	constructor() {}

	sum = 0;

	getMaxJoltage(bank: string) {
		const numbers = bank.split("").map(Number);
		let firstBiggest = -Infinity;
		let secondBiggest = -Infinity;
		while (numbers.length) {
			const num = numbers.shift()!;
			if (numbers.length && num > firstBiggest) {
				firstBiggest = num;
				secondBiggest = -1;
			} else if (num > secondBiggest) {
				secondBiggest = num;
			}
		}
		const maxJoltage = firstBiggest * 10 + secondBiggest;

		this.sum += maxJoltage;
		return maxJoltage;
	}
}

describe("Part 1", () => {
	test("Example Joltages", async () => {
		const { default: example } = await import("./example.txt");
		const banks = example.trim().split("\n");
		const machine = new JoltageMachine();
		for (const bank of banks) {
			console.info(machine.getMaxJoltage(bank));
		}

		expect(machine.sum).toEqual(357);
	});

	test("Real Joltages", async () => {
		const { default: input } = await import("./input.txt");
		const banks = input.trim().split("\n");
		const machine = new JoltageMachine();
		for (const bank of banks) {
			console.info(machine.getMaxJoltage(bank));
		}

		console.log(`We got ${machine.sum} Jolts!`);
	});
});
