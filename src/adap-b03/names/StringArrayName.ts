import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        for (let i = 0; i < other.length; i++) {
            this.components.push(other[i]);
        }
    }

    getNoComponents(): number {
        return this.components.length;
    }

    getComponent(i: number): string {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new Error('Index out of bounds');
        }
        return this.components[i];
    }
    setComponent(i: number, c: string) {
        if (i < 0 || i > this.getNoComponents()) {
            throw new Error('Index out of bounds');
        }
        if (i === this.getNoComponents()) {
            this.append(c);
        } else {
            this.components[i] = c;
        }
    }

    insert(i: number, c: string) {
        if (i < 0 || i > this.getNoComponents()) {
            throw new Error('Index out of bounds');
        }
        if (i === this.getNoComponents()) {
            this.append(c);
        } else {
            this.components.splice(i, 0, c);
        }
    }
    append(c: string) {
        this.components.push(c);
    }
    remove(i: number) {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new Error('Index out of bounds');
        }
        this.components.splice(i, 1);
    }
}