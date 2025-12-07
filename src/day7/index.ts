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

		// console.info(this.grid.map((l) => l.join("")).join("\n"));
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

class QuantumTachyonManifold {
	splits: number = 0;
	timelines: number = 1;

	grid: TChar[][];

	beamz: Record<string, number> = {};

	constructor(input: string) {
		this.grid = input.split("\n").map((l) => l.trim().split("")) as TChar[][];

		for (let x = 0; x < this.grid[0]!.length; x++) {
			if (this.getCharAt(x, 0) === "S") {
				console.info(`Beam start found at ${x}`);
				this.down(x, 0, 1);
				break;
			}
		}

		// console.info(this.grid.map((l) => l.join("")).join("\n"));

		this.go();
	}

	setCharAt(x: number, y: number, char: TChar) {
		if (this.grid?.[y]?.[x]) this.grid[y][x] = char;
	}

	getCharAt(x: number, y: number) {
		return this.grid?.[y]?.[x] ?? "=";
	}

	depth = 0;
	proms: Array<{ fn: Function; x: number; y: number; str: number }> = [];

	async down(x: number, y: number, str: number) {
		if (!str) return;

		const prom = new Promise<number>((res) => {
			this.proms.push({
				fn: res,
				x,
				y,
				str,
			});
		});

		const key = `${x}-${y}`;
		if (!this.beamz[key]) this.beamz[key] = str;
		else {
			this.beamz[key] += str;
			this.splits++;
		}

		const char = this.getCharAt(x, y);

		if (char === "^") {
			//we split
			this.timelines++;
			this.down(x - 1, y, str);
			this.down(x + 1, y, str);
		} else if (char === "=") {
			//we reached ground.
			return;
		} else {
			//we go down
			this.setCharAt(x, y, "|");
			const val = await prom;
			this.down(x, y + 1, val);
		}
	}

	async go() {
		const proms = this.proms.filter((p) => p.y === this.depth);
		this.proms = this.proms.filter((p) => p.y !== this.depth);

		let uniqueXY: Record<string, number> = {};
		for (const prom of proms) {
			const key = `${prom.x}-${prom.y}`;
			if (uniqueXY[key]) uniqueXY[key] += prom.str;
			else uniqueXY[key] = prom.str;
		}

		for (const prom of proms) {
			const keys = Object.keys(uniqueXY);
			const key = `${prom.x}-${prom.y}`;
			if (keys.includes(key)) {
				prom.fn(uniqueXY[key]);
				delete uniqueXY[key];
			}
		}

		this.depth++;

		setTimeout(() => {
			if (this.proms.length) {
				this.go();
			} else {
				let sum = 0;
				for (const prom of proms) {
					sum += prom.str;
				}

				this.resolveBeams(sum);
			}
		});
	}

	resolveBeams: Function = (a: number) => {};
	calculateTimelines = new Promise((res) => {
		this.resolveBeams = res;
	});
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

describe("Part 2", () => {
	test("Example Split some beamz", async () => {
		const { default: example } = await import("./example.txt");
		const manifold = new QuantumTachyonManifold(example);

		expect(await manifold.calculateTimelines).toEqual(40);
	});

	test("Split the big beamz", async () => {
		const { default: input } = await import("./input.txt");
		const manifold = new QuantumTachyonManifold(input);

		console.log(`We made ${await manifold.calculateTimelines} timelines, good job.`);
	});
});
