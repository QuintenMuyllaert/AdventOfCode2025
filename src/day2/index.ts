//https://adventofcode.com/2025/day/2

import { describe, expect, test } from "bun:test";

class IDMachine {
	constructor() {}

	sumOfInvalids = 0;

	protected range2values(range: string) {
		const [start, end] = range.split("-").map(Number);
		if (start === undefined || end === undefined) throw "Invalid Range";
		const len = end - start + 1;
		return new Array(len).fill(0).map((_e, i) => start + i);
	}

	isValidID(_val: number): boolean {
		return true;
	}

	getInvalidIds(range: string) {
		const resp: number[] = [];
		const values = this.range2values(range);
		for (const value of values) {
			if (this.isValidID(value)) continue;

			this.sumOfInvalids += value;
			resp.push(value);
		}

		return resp;
	}
}

class IDMachineP1 extends IDMachine {
	override isValidID(val: number) {
		const str = val.toString();
		const len = str.length;
		if (len % 2) return true;
		const halfLen = len / 2;
		const p1 = str.substring(0, halfLen);
		const p2 = str.substring(halfLen);
		return p1 !== p2;
	}
}

class IDMachineP2 extends IDMachine {
	override isValidID(val: number) {
		const str = val.toString();
		const len = str.length;
		const halfLen = len / 2;
		for (let i = 1; i <= halfLen; i++) {
			const matchPart = str.substring(0, i);
			const regx = new RegExp(matchPart, "g");

			const isInvalid =
				str
					.matchAll(regx)
					.toArray()
					.map((e) => e[0])
					.join("") === str;

			if (isInvalid) return false;
		}

		return true;
	}
}
class IDMachineP2_Opt extends IDMachine {
	override isValidID(val: number) {
		const str = val.toString();
		const regx = new RegExp(/^(\d+)\1+$/gm);
		const isInvalid = regx.exec(str)?.[0] === str;

		if (isInvalid) return false;
		return true;
	}
}

describe("Part 1", () => {
	test("Example input matches", async () => {
		const checker = new IDMachineP1();
		const { default: example } = await import("./example.txt");
		const ranges = example.trim().split(",");
		for (const range of ranges) {
			console.info(checker.getInvalidIds(range));
		}

		expect(checker.sumOfInvalids).toEqual(1227775554);
	});

	test("Test on real input", async () => {
		const checker = new IDMachineP1();
		const { default: example } = await import("./input.txt");
		const ranges = example.trim().split(",");
		for (const range of ranges) {
			console.info(checker.getInvalidIds(range));
		}

		console.log(`Sum of all invalid id's : ${checker.sumOfInvalids}`);
	});
});

describe("Part 2", () => {
	test("Example input matches", async () => {
		const checker = new IDMachineP2();
		const { default: example } = await import("./example.txt");
		const ranges = example.trim().split(",");
		for (const range of ranges) {
			console.info(checker.getInvalidIds(range));
		}
		expect(checker.sumOfInvalids).toEqual(4174379265);
	});

	test("Test on real input", async () => {
		const checker = new IDMachineP2();
		const { default: example } = await import("./input.txt");
		const ranges = example.trim().split(",");
		for (const range of ranges) {
			console.info(checker.getInvalidIds(range));
		}
		console.log(`Sum of all invalid id's : ${checker.sumOfInvalids}`);
	});
});

describe("Part 2 Optimised", () => {
	test("Example input matches", async () => {
		const checker = new IDMachineP2_Opt();
		const { default: example } = await import("./example.txt");
		const ranges = example.trim().split(",");
		for (const range of ranges) {
			console.info(checker.getInvalidIds(range));
		}
		expect(checker.sumOfInvalids).toEqual(4174379265);
	});

	test("Test on real input", async () => {
		const checker = new IDMachineP2_Opt();
		const { default: example } = await import("./input.txt");
		const ranges = example.trim().split(",");
		for (const range of ranges) {
			console.info(checker.getInvalidIds(range));
		}
		console.log(`Sum of all invalid id's : ${checker.sumOfInvalids}`);
	});
});
