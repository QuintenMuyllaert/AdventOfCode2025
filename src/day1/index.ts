import { expect, test } from "bun:test";

class Dial {
	private dialMin = 0;
	private dialMax = 99;
	private dialCur = 0;
	public password = 0;

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
		}
		while (newDial > this.dialMax) {
			newDial -= range;
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

const main = async () => {
	const dial = new Dial(50);
	const { default: example } = await import("./input.txt");
	const ops = example.trim().split("\n");
	for (const op of ops) {
		dial.rotate(op);
	}

	console.log(`The password is ${dial.password}`);
};

test("Dial in the input and grab the password!", main);
