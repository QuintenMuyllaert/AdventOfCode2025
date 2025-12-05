//https://adventofcode.com/2025/day/5

import { describe, expect, test } from "bun:test";

class SpoilerAlert {
	fresh = 0;

	ranges: number[][] = [];
	ids: number[] = [];

	constructor(input: string) {
		const lines = input.trim().split("\n");

		const addingFnRanges = (line: string) => {
			this.ranges.push(line.split("-").map(Number));
		};
		const addingFnIds = (line: string) => {
			this.ids.push(parseInt(line));
		};

		let addingFn = addingFnRanges;

		for (const line of lines) {
			if (line.trim() === "") {
				addingFn = addingFnIds;
				continue;
			}

			addingFn(line);
		}

		for (const id of this.ids) {
			const item = this.ranges.find(([min, max]) => min! <= id && id <= max!);
			if (item) this.fresh++;
		}
	}
}

describe("Part 1", () => {
	test("Example Ingredients Database", async () => {
		const { default: example } = await import("./example.txt");
		const spoilers = new SpoilerAlert(example);

		expect(spoilers.fresh).toEqual(3);
	});
	test("Example Ingredients Database", async () => {
		const { default: input } = await import("./input.txt");
		const spoilers = new SpoilerAlert(input);

		console.log(`There are ${spoilers.fresh} fresh ingredients.`);
	});
});
