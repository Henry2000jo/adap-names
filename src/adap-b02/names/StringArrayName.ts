import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringArrayName implements Name {

    protected components: string[] = [];
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        if (typeof delimiter !== 'undefined') {
            this.delimiter = delimiter;
        }
        for (let i = 0; i < other.length; i++) {
            this.components.push(other[i]);
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        let nameString: string = '';
        for (let i = 0; i < this.getNoComponents(); i++) {
            let component: string = this.getComponent(i);
            component = component.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter);
            nameString += component;
            if (i < this.getNoComponents() - 1) {
                nameString += delimiter;
            }
        }
        return nameString;
    }

    public asDataString(): string {
        return this.components.join(this.delimiter);
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new Error('Index out of bounds');
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i > this.getNoComponents()) {
            throw new Error('Index out of bounds');
        }
        if (i === this.getNoComponents()) {
            this.append(c);
        } else {
            this.components[i] = c;
        }
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.getNoComponents()) {
            throw new Error('Index out of bounds');
        }
        if (i === this.getNoComponents()) {
            this.append(c);
        } else {
            this.components.splice(i, 0, c);
        }
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new Error('Index out of bounds');
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}