import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other;
        if (this.name === '') {
            this.length = 0;
            return;
        }
        const escapedDelimiter = this.getDelimiterCharacter().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<!\\${ESCAPE_CHARACTER})${escapedDelimiter}`);
        this.length = this.name.split(regex).length;
    }

    getNoComponents(): number {
        return this.length;
    }

    getComponent(i: number): string {
        if (i < 0 || i >= this.length) {
            throw new Error('Index out of bounds');
        }
        const components = this.getComponents();
        return components[i];
    }
    setComponent(i: number, c: string) {
        if (i < 0 || i > this.length) {
            throw new Error('Index out of bounds');
        }
        if (i === this.length) {
            this.append(c);
        } else {
            const components = this.getComponents();
            components[i] = c;
            this.name = components.join(this.getDelimiterCharacter());
        }
    }

    insert(i: number, c: string) {
        if (i < 0 || i > this.length) {
            throw new Error('Index out of bounds');
        }
        if (i === this.length) {
            this.append(c);
        } else {
            const components = this.getComponents();
            components.splice(i, 0, c);
            this.name = components.join(this.getDelimiterCharacter());
            this.length++;
        }
    }
    append(c: string) {
        this.name += this.getDelimiterCharacter() + c;
        this.length++;
    }
    remove(i: number) {
        if (i < 0 || i >= this.length) {
            throw new Error('Index out of bounds');
        }
        const components = this.getComponents();
        components.splice(i, 1);
        this.name = components.join(this.getDelimiterCharacter());
        this.length--;
    }

    private getComponents() {
        const escapedDelimiter = this.getDelimiterCharacter().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex =  new RegExp(`(?<!\\${ESCAPE_CHARACTER})${escapedDelimiter}`);
        return this.name.split(regex);
    }

}