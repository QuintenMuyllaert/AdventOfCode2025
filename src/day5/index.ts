//https://adventofcode.com/2025/day/5

import { describe, expect, test } from "bun:test";

class SpoilerAlertP1 {
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

class SpoilerAlertP2 {
	fresh = 0;

	ranges: number[][] = [];

	constructor(input: string) {
		const lines = input.trim().split("\n");

		let smallest = +Infinity;
		let biggest = -Infinity;

		const addingFnRanges = (line: string) => {
			const [min, max] = line.split("-").map(Number) as [number, number];
			if (min < smallest) smallest = min;
			if (max > biggest) biggest = max;
			this.ranges.push([min, max, max - min + 1]);
		};

		for (const line of lines) {
			if (line.trim() === "") break;

			addingFnRanges(line);
		}

		this.ranges.sort((a, b) => a[0]! - b[0]!);

		const newRanges: [number, number, number][] = [];
		let [currentMin, currentMax] = this.ranges[0]! as [number, number];

		for (const range of this.ranges!) {
			const [min, max] = range! as [number, number];
			if (min <= currentMax) {
				currentMax = Math.max(currentMax, max);
			} else {
				newRanges.push([currentMin, currentMax, currentMax - currentMin + 1]);
				currentMin = min;
				currentMax = max;
			}
		}

		newRanges.push([currentMin, currentMax, currentMax - currentMin + 1]);

		for (let i = 0; i < newRanges.length; i++) {
			const [_curMin, _curMax, curDist] = newRanges[i]! as [number, number, number];

			this.fresh += curDist;
		}
	}
}

describe("Part 1", () => {
	test("Example Ingredients Database", async () => {
		const { default: example } = await import("./example.txt");
		const spoilers = new SpoilerAlertP1(example);

		expect(spoilers.fresh).toEqual(3);
	});
	test("Ingredients Database", async () => {
		const { default: input } = await import("./input.txt");
		const spoilers = new SpoilerAlertP1(input);

		console.log(`There are ${spoilers.fresh} fresh ingredients.`);
	});
});

describe("Part 2", () => {
	test("Example Ingredients Database", async () => {
		const { default: example } = await import("./example.txt");
		const spoilers = new SpoilerAlertP2(example);

		expect(spoilers.fresh).toEqual(14);
	});
	test("Example Ingredients Database", async () => {
		const { default: example } = await import("./example2.txt");
		const spoilers = new SpoilerAlertP2(example);

		expect(spoilers.fresh).toEqual(21);
	});
	test("Progz Input - Because I'm doubting my own input.txt", async () => {
		const { default: input } = await import("./input-progz.txt");
		const spoilers = new SpoilerAlertP2(input);

		console.log(`There are ${spoilers.fresh} fresh ingredient ID's.`);
		expect(spoilers.fresh).toEqual(350684792662845);
	});
	test("Ingredients Database", async () => {
		const { default: input } = await import("./input.txt");
		const spoilers = new SpoilerAlertP2(input);

		console.log(`There are ${spoilers.fresh} fresh ingredient ID's.`);
	});
});
