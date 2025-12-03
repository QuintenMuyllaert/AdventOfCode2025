//https://adventofcode.com/2025/day/2

import { cpus } from "os";

let numThreads = 1;

function createBunWorker(fn: () => void) {
	const blob = new Blob([`(${fn})();`], { type: "application/javascript" });
	const url = URL.createObjectURL(blob);
	return new Worker(url, { type: "module" });
}

console.info = () => {};

const workerFn = () => {
	// @ts-ignore
	onmessage = (e: { data: { ranges: any } }) => {
		class IDMachine {
			constructor() {}

			sumOfInvalids = 0;

			protected range2values(range: string) {
				const [start, end] = range.split("-").map(Number);
				if (start === undefined || end === undefined) throw "Invalid Range";
				const len = end - start + 1;
				return new Array(len).fill(0).map((_e, i) => start + i);
			}

			isValidID(val: number) {
				const str = val.toString();
				const regx = new RegExp(/^(\d+)\1+$/gm);
				const isInvalid = regx.exec(str)?.[0] === str;

				if (isInvalid) return false;
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

		const machine = new IDMachine();
		for (const range of e.data.ranges) {
			machine.getInvalidIds(range);
		}
		postMessage(machine.sumOfInvalids);
	};
};

for (let i = 1; i <= cpus().length; i++) {
	numThreads = i;
	console.log("Spawning", numThreads, "Bun workers");
	console.time("Multithreading");
	const { default: input } = await import("./input.txt");
	const ranges = input.trim().split(",");

	const proms: Promise<number>[] = [];
	for (let i = 0; i < numThreads; i++) {
		const worker = createBunWorker(workerFn);
		const prom = new Promise<number>((resolve) => {
			worker.onmessage = (e: MessageEvent<number>) => {
				resolve(e.data);
			};
		});
		const chunkSize = Math.ceil(ranges.length / numThreads);
		worker.postMessage({ ranges: ranges.slice(i * chunkSize, (i + 1) * chunkSize) });
		proms.push(prom);
	}
	const res = await Promise.all(proms);
	const sum = res.reduce((a, b) => a + b, 0);
	console.log(sum);
	console.timeEnd("Multithreading");
}
