import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        if (typeof delimiter !== 'undefined') {
            this.delimiter = delimiter;
        }
        this.name = other;
        if (this.name === '') {
            this.noComponents = 0;
            return;
        }
        const escapedDelimiter = this.delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<!\\\\)${escapedDelimiter}`);
        this.noComponents = this.name.split(regex).length;
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
        return this.name;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        if (x < 0 || x >= this.noComponents) {
            throw new Error('Index out of bounds');
        }
        const components = this.getComponents();
        return components[x];
    }

    public setComponent(n: number, c: string): void {
        if (n < 0 || n > this.noComponents) {
            throw new Error('Index out of bounds');
        }
        if (n === this.noComponents) {
            this.append(c);
        } else {
            const components = this.getComponents();
            components[n] = c;
            this.name = components.join(this.delimiter);
        }
    }

    public insert(n: number, c: string): void {
        if (n < 0 || n > this.noComponents) {
            throw new Error('Index out of bounds');
        }
        if (n === this.noComponents) {
            this.append(c);
        } else {
            const components = this.getComponents();
            components.splice(n, 0, c);
            this.name = components.join(this.delimiter);
            this.noComponents++;
        }
    }

    public append(c: string): void {
        this.name += this.delimiter + c;
        this.noComponents++;
    }

    public remove(n: number): void {
        if (n < 0 || n >= this.noComponents) {
            throw new Error('Index out of bounds');
        }
        const components = this.getComponents();
        components.splice(n, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    private getComponents() {
        const escapedDelimiter = this.delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex =  new RegExp(`(?<!\\${ESCAPE_CHARACTER})${escapedDelimiter}`);
        return this.name.split(regex);
    }

}