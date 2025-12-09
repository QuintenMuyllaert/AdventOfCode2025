//https://adventofcode.com/2025/day/9

import { describe, expect, test } from "bun:test";

class AbsoluteCinema {
	area = 0;
	constructor(input: string) {
		const Points = input
			.trim()
			.split("\n")
			.map((l) => l.split(",").map(Number))
			.map((p, i) => {
				return {
					index: i,
					x: p[0]!,
					y: p[1]!,
					// squares: {} as Record<number, number>,
				};
			});

		let biggestArea = -Infinity;
		for (const point1 of Points) {
			for (const point2 of Points) {
				const area = Math.abs(point2.x - point1.x + 1) * Math.abs(point2.y - point1.y + 1);
				// point1.squares[point2.index] = area;
				// point2.squares[point1.index] = area;

				if (area > biggestArea) {
					biggestArea = area;
				}
			}
		}

		this.area = biggestArea;
	}
}

describe("Part 1", () => {
	test("Example Cinema", async () => {
		const { default: example } = await import("./example.txt");
		const cinema = new AbsoluteCinema(example);
		expect(cinema.area).toBe(50);
	});
	test("Real Cinema", async () => {
		const { default: input } = await import("./input.txt");
		const cinema = new AbsoluteCinema(input);
		console.log("Biggest rect in the cinema", cinema.area);
	});
});
