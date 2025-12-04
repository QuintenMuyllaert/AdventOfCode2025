//https://adventofcode.com/2025/day/3

import { describe, expect, test } from "bun:test";

class JoltageMachineP1 {
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

class JoltageMachineP2 {
	constructor() {}

	sum = 0;

	getMaxJoltage(bank: string, maxBatteries: number) {
		const numbers = bank.split("").map(Number);

		const biggest: number[] = new Array(maxBatteries).fill(-Infinity);

		while (numbers.length) {
			const num = numbers.shift()!;
			for (let i = Math.max(0, maxBatteries - numbers.length - 1); i < maxBatteries; i++) {
				if (num > biggest[i]!) {
					biggest[i] = num;
					for (let j = i + 1; j < maxBatteries; j++) {
						biggest[j] = -Infinity;
					}
					break;
				}
			}
		}

		let maxJoltage = 0;

		for (let num of biggest) {
			maxJoltage = maxJoltage * 10 + num;
		}

		this.sum += maxJoltage;
		return maxJoltage;
	}
}

describe("Part 1", () => {
	test("Example Joltages", async () => {
		const { default: example } = await import("./example.txt");
		const banks = example.trim().split("\n");
		const machine = new JoltageMachineP1();
		for (const bank of banks) {
			console.info(machine.getMaxJoltage(bank));
		}

		expect(machine.sum).toEqual(357);
	});

	test("Real Joltages", async () => {
		const { default: input } = await import("./input.txt");
		const banks = input.trim().split("\n");
		const machine = new JoltageMachineP1();
		for (const bank of banks) {
			console.info(machine.getMaxJoltage(bank));
		}

		console.log(`We got ${machine.sum} Jolts!`);
	});
});

describe("Part 2", () => {
	test("Example Joltages", async () => {
		const { default: example } = await import("./example.txt");
		const banks = example.trim().split("\n");
		const machine = new JoltageMachineP2();
		for (const bank of banks) {
			console.info(machine.getMaxJoltage(bank, 12));
		}

		expect(machine.sum).toEqual(3121910778619);
	});

	test("Real Joltages", async () => {
		const { default: input } = await import("./input.txt");
		const banks = input.trim().split("\n");
		const machine = new JoltageMachineP2();
		for (const bank of banks) {
			console.info(machine.getMaxJoltage(bank, 12));
		}

		console.log(`We got ${machine.sum} Jolts!`);
	});
});
