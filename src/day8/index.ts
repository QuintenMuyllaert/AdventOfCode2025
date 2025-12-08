//https://adventofcode.com/2025/day/8

import { describe, expect, test, beforeEach } from "bun:test";

beforeEach(() => {
	Box.list = [];
	Box.checks = new Set();
});

class Box {
	static list: Box[] = [];

	x: number = 0;
	y: number = 0;
	z: number = 0;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;

		Box.list.push(this);
		this.network.add(this);
	}

	distance(that: Box) {
		return Math.sqrt(Math.pow(this.x - that.x, 2) + Math.pow(this.y - that.y, 2) + Math.pow(this.z - that.z, 2));
	}

	distances: number[] = [];

	network: Set<Box> = new Set();

	static calculateAllDistances() {
		for (let i = 0; i < Box.list.length; i++) {
			for (let j = 0; j < Box.list.length; j++) {
				const box1 = Box.list[i]!;
				const box2 = Box.list[j]!;

				const dist = box1.distance(box2);
				box1.distances.push(dist);
			}
		}
	}

	static checks: Set<string> = new Set();

	static find2closestBoxesOutOfNetwork() {
		let closest = {
			dist: Infinity,
			a: undefined,
			b: undefined,
		} as {
			dist: number;
			a?: Box;
			b?: Box;
		};

		for (const box of Box.list) {
			for (let i = 0; i < box.distances.length; i++) {
				const dist = box.distances[i]!;
				if (dist === 0) continue;
				if (dist > closest.dist) continue;

				const otherBox = Box.list[i]!;
				if (box.network.has(otherBox)) {
					continue;
				}

				closest.dist = dist;
				closest.a = box;
				closest.b = otherBox;
			}
		}

		return closest;
	}

	add2Network(that: Box) {
		const merged = new Set<Box>([...this.network, ...that.network]);
		for (const box of merged) {
			box.network = merged;
		}
	}

	str() {
		return `${this.x},${this.y},${this.z}`;
	}
}

class PlayGround {
	network = 0;
	boxes: Box[] = [];
	constructor(input: string) {
		const lines = input.trim().split("\n");
		const poss = lines.map((l) => l.split(",").map(Number));
		for (const pos of poss) {
			const [x, y, z] = pos as [number, number, number];
			this.boxes.push(new Box(x, y, z));
		}

		Box.calculateAllDistances();
	}

	maxMult = 0;

	buildNetworks(connections: number) {
		const pairs: { a: Box; b: Box; dist: number }[] = [];
		for (let i = 0; i < this.boxes.length; i++) {
			for (let j = i + 1; j < this.boxes.length; j++) {
				const box1 = this.boxes[i]!;
				const box2 = this.boxes[j]!;
				pairs.push({
					a: box1,
					b: box2,
					dist: box1.distance(box2),
				});
			}
		}

		pairs.sort((a, b) => a.dist - b.dist);

		const limit = Math.min(connections, pairs.length);
		for (let i = 0; i < limit; i++) {
			const pair = pairs[i]!;

			if (!pair.a.network.has(pair.b)) {
				pair.a.add2Network(pair.b);
			}
		}
	}

	getCircuitCount() {
		let sum = 0;
		let countedBoxes: Box[] = [];
		for (const box of this.boxes) {
			if (countedBoxes.includes(box)) continue;
			if (box.network.size < 1) continue;

			sum++;

			countedBoxes = [...countedBoxes, ...box.network];
		}

		return sum;
	}

	getMult() {
		const sizes = new Set<Set<Box>>();
		this.boxes.forEach((b) => sizes.add(b.network));
		const sorted = Array.from(sizes)
			.map((s) => s.size)
			.sort((a, b) => b - a);

		const [a, b, c] = sorted as [number, number, number];
		return (a || 0) * (b || 0) * (c || 0);
	}
}

describe("Part 1", () => {
	test("Example Boxes - The rules", async () => {
		const { default: example } = await import("./example.txt");
		new PlayGround(example);

		const firstPair = Box.find2closestBoxesOutOfNetwork();
		expect([firstPair.a?.str(), firstPair.b?.str()]).toContainValue("162,817,812");
		expect([firstPair.a?.str(), firstPair.b?.str()]).toContainValue("425,690,689");

		firstPair.a?.add2Network(firstPair.b!);

		expect(Box.list.filter((b) => b.network.size === 2).length).toEqual(2);
		expect(Box.list.filter((b) => b.network.size === 1).length).toEqual(18);

		const secondPair = Box.find2closestBoxesOutOfNetwork();
		expect([secondPair.a?.str(), secondPair.b?.str()]).toContainValue("162,817,812");
		expect([secondPair.a?.str(), secondPair.b?.str()]).toContainValue("431,825,988");

		secondPair.a?.add2Network(secondPair.b!);

		expect(Box.list.filter((b) => b.network.size === 3).length).toEqual(3);
		expect(Box.list.filter((b) => b.network.size === 1).length).toEqual(17);

		const thirdPair = Box.find2closestBoxesOutOfNetwork();
		expect([thirdPair.a?.str(), thirdPair.b?.str()]).toContainValue("906,360,560");
		expect([thirdPair.a?.str(), thirdPair.b?.str()]).toContainValue("805,96,715");

		thirdPair.a?.add2Network(thirdPair.b!);

		expect(Box.list.filter((b) => b.network.size === 3).length).toEqual(3);
		expect(Box.list.filter((b) => b.network.size === 2).length).toEqual(2);
		expect(Box.list.filter((b) => b.network.size === 1).length).toEqual(15);
	});

	test("Example Boxes", async () => {
		const { default: example } = await import("./example.txt");
		const playGround = new PlayGround(example);
		playGround.buildNetworks(10);

		expect(playGround.getCircuitCount()).toEqual(11);

		expect(Box.list.filter((b) => b.network.size === 5).length).toEqual(5);
		expect(Box.list.filter((b) => b.network.size === 4).length).toEqual(4);
		expect(Box.list.filter((b) => b.network.size === 2).length).toEqual(4);
		expect(Box.list.filter((b) => b.network.size === 1).length).toEqual(7);

		expect(playGround.getMult()).toEqual(40);
	});

	test("Let's Connect them real boxes!", async () => {
		const { default: input } = await import("./input.txt");
		const playGround = new PlayGround(input);
		playGround.buildNetworks(1000);

		console.log(playGround.getMult());
	});
});
