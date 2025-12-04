//https://adventofcode.com/2025/day/3

import { describe, expect, test } from "bun:test";

class ForkliftCertified {
	constructor() {}

	accesibleRolls = 0;

	matrix = [
		[-1, -1],
		[-1, 0],
		[-1, 1],

		[0, -1],
		// [0, 0], //We don't care about the center itself.
		[0, 1],

		[1, -1],
		[1, 0],
		[1, 1],
	];

	earnCertification(bank: string) {
		const warehouse = bank.split("\n").map((e) => e.split(""));
		for (let x = 0; x < warehouse.length; x++) {
			for (let y = 0; y < warehouse[x]!.length; y++) {
				if (warehouse?.[x]?.[y] !== "@") continue;
				let rolls = 0;
				for (const [i, j] of this.matrix) {
					if (warehouse?.[x + i]?.[y + j] === "@") rolls++;
					if (rolls > 3) {
						break;
					}
				}
				if (rolls < 4) {
					this.accesibleRolls++;
				}
			}
		}

		return this.accesibleRolls;
	}
}

describe("Part 1", () => {
	test("Example Forklift Certification", async () => {
		const { default: example } = await import("./example.txt");
		const banks = example.trim();
		const forklift = new ForkliftCertified();
		console.info(forklift.earnCertification(banks));

		expect(forklift.accesibleRolls).toEqual(13);
	});

	test("Example Forklift Certification", async () => {
		const { default: input } = await import("./input.txt");
		const banks = input.trim();
		const forklift = new ForkliftCertified();
		console.info(forklift.earnCertification(banks));

		console.log(`Our certified experts on forklift behavior say : ${forklift.accesibleRolls} rolls.`);
	});
});
