//https://adventofcode.com/2025/day/7

import { describe, expect, test } from "bun:test";
type TChar = "." | "S" | "^" | "|" | "=";

class TachyonManifold {
	splits: number = 0;

	grid: TChar[][];

	beamz = new Set<string>();

	constructor(input: string) {
		this.grid = input.split("\n").map((l) => l.trim().split("")) as TChar[][];

		for (let x = 0; x < this.grid[0]!.length; x++) {
			if (this.getCharAt(x, 0) === "S") {
				console.info(`Beam start found at ${x}`);
				this.down(x, 0);
				break;
			}
		}

		console.info(this.grid.map((l) => l.join("")).join("\n"));
	}

	setCharAt(x: number, y: number, char: TChar) {
		if (this.grid?.[y]?.[x]) this.grid[y][x] = char;
	}

	getCharAt(x: number, y: number) {
		return this.grid?.[y]?.[x] ?? "=";
	}

	down(x: number, y: number) {
		if (this.beamz.has(`${x}-${y}`)) return; //check if a beam is already beaming in the spot.
		this.beamz.add(`${x}-${y}`);

		const char = this.getCharAt(x, y);

		if (char === "^") {
			//we split
			this.splits++;
			this.down(x - 1, y);
			this.down(x + 1, y);
		} else if (char === "=") {
			//we reached ground.
			return;
		} else {
			//we go down
			this.setCharAt(x, y, "|");
			this.down(x, y + 1);
		}
	}
}

describe("Part 1", () => {
	test("Example Split some beamz", async () => {
		const { default: example } = await import("./example.txt");
		const manifold = new TachyonManifold(example);

		expect(manifold.splits).toEqual(21);
	});

	test("Split the big beamz", async () => {
		const { default: input } = await import("./input.txt");
		const manifold = new TachyonManifold(input);

		console.log(`We split the beam ${manifold.splits} times.`);
	});
});
