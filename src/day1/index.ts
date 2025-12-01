import { describe, expect, test } from "bun:test";

class Dial {
	private dialMin = 0;
	private dialMax = 99;
	private dialCur = 0;
	public password = 0;
	public password2 = 0;

	constructor(initial: number) {
		console.info(`The dial starts by pointing at ${initial}`);
		this.dialCur = initial;
	}

	rotate(operation: string) {
		const arr = operation.split("");
		const [dir, ...numStrArr] = arr;
		const num = parseInt(numStrArr.join(""));

		const dirMul = dir === "R" ? 1 : -1;

		const range = 1 + this.dialMax - this.dialMin;

		let newDial = this.dialCur + dirMul * num;
		while (newDial < this.dialMin) {
			newDial += range;
			this.password2++;
		}
		while (newDial > this.dialMax) {
			newDial -= range;
			this.password2++;
		}

		this.dialCur = newDial;

		if (this.dialCur === 0) {
			this.password++;
		}

		console.info(`The is rotated ${operation} to point at ${this.dialCur}`);
	}

	readDial() {
		return this.dialCur;
	}
}

describe("Part 1", () => {
	test("Dial turns", () => {
		const dial = new Dial(11);
		dial.rotate("R8");
		expect(dial.readDial()).toEqual(19);

		dial.rotate("L19");
		expect(dial.readDial()).toEqual(0);
	});

	test("Dial turns & Underflows", () => {
		const dial = new Dial(5);
		dial.rotate("L10");
		expect(dial.readDial()).toEqual(95);
		dial.rotate("R5");
		expect(dial.readDial()).toEqual(0);
	});

	test("Dial ends correctly in example", async () => {
		const dial = new Dial(50);
		const { default: example } = await import("./example.txt");
		const ops = example.trim().split("\n");
		for (const op of ops) {
			dial.rotate(op);
		}

		expect(dial.readDial()).toEqual(32);

		expect(dial.password).toEqual(3);
	});

	test("Dial in the input and grab the password!", async () => {
		const dial = new Dial(50);
		const { default: example } = await import("./input.txt");
		const ops = example.trim().split("\n");
		for (const op of ops) {
			dial.rotate(op);
		}

		console.log(`The password is ${dial.password}`);
	});
});

describe("Part 2", () => {
	test("Dial ends correctly in example", async () => {
		const dial = new Dial(50);
		const { default: example } = await import("./example.txt");
		const ops = example.trim().split("\n");
		for (const op of ops) {
			dial.rotate(op);
		}

		expect(dial.readDial()).toEqual(32);

		expect(dial.password2).toEqual(6);
	});

	test("Dial turns R1000", async () => {
		const dial = new Dial(50);
		dial.rotate("R1000");

		expect(dial.readDial()).toEqual(50);

		expect(dial.password2).toEqual(10);
	});

	test("Dial in the input and grab the password!", async () => {
		const dial = new Dial(50);
		const { default: example } = await import("./input.txt");
		const ops = example.trim().split("\n");
		for (const op of ops) {
			dial.rotate(op);
		}

		console.log(`The password is ${dial.password2}`);
	});
});
