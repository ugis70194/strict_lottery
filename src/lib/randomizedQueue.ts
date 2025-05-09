import { v7 as uuidv7 } from 'uuid';

export class RandomizedQueue<T> {
  public items: T[] = [];

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const randomIndex = Math.floor(Math.random() * this.items.length);
    const item = this.items[randomIndex];
    this.items[randomIndex] = this.items[this.items.length - 1];
    this.items.pop();
    return item;
  }

  sample(): T | undefined {
    if (this.isEmpty()) return undefined;
    const randomIndex = Math.floor(Math.random() * this.items.length);
    return this.items[randomIndex];
  }
}

const charset = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890";
function generateSerialNumber(): string {
  let randStr = "";
  for(let j = 0; j < 16; j++) {
    randStr += charset[Math.floor(Math.random() * 16)];
  }
  return randStr;
}

function generateSerialNumbers(N: number, espaceSerialNumbers: string[]): Set<string> {
  const ret = new Set<string>();

  while(ret.size <= N) {
    const serial = generateSerialNumber();
    if(espaceSerialNumbers.includes(serial)) continue;
    ret.add(serial);
  }
  return ret;
}

type entry = {
  serialCode: string,
  users: string[];
}
// (シリアル, 参加者ID[])
export function generateSampleDate(
  applicants: number,
  tatezumi: number,
  renban: number,
  maxRenban: number
): [
  RandomizedQueue<entry>, 
  entry[]
]{
  let applications = new RandomizedQueue<entry>();
  let yourEntrys: entry[] = [];
  let yourIDs: string[] = [];
  for(let i = 0; i < renban; i++) {
    yourIDs.push(uuidv7());
  }
  for(let i = 0; i < tatezumi; i++) {
    const application = {
      serialCode: generateSerialNumber(),
      users: yourIDs
    };
    yourEntrys.push(application);
    applications.enqueue(application);
  }

  const serialSets = generateSerialNumbers(applicants-tatezumi, yourEntrys.map((entry) => entry.serialCode));
  const serials = Array.from(serialSets);
  for(let i = 0; i < serials.length;) {
    const tumi = Math.max(1, Math.min(Math.floor(Math.random() * 10), serials.length - i));
    const ren = Math.max(1, Math.floor(Math.random() * maxRenban));
    let applicantIDs: string[] = [];
    for(let j = 0; j < ren; j++) {
      applicantIDs.push(uuidv7());
    }
    
    for(let j = i; j < Math.min(i+tumi, serials.length); j++) {
      applications.enqueue({
        serialCode: serials[j],
        users: applicantIDs
      });
    }
    i += tumi;
  }

  return [applications, yourEntrys];
}
