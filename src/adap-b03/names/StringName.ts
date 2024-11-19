import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other;
        if (this.name === '') {
            this.noComponents = 0;
            return;
        }
        const escapedDelimiter = this.getDelimiterCharacter().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<!\\${ESCAPE_CHARACTER})${escapedDelimiter}`);
        this.noComponents = this.name.split(regex).length;
    }

    getNoComponents(): number {
        return this.noComponents;
    }

    getComponent(i: number): string {
        if (i < 0 || i >= this.noComponents) {
            throw new Error('Index out of bounds');
        }
        const components = this.getComponents();
        return components[i];
    }
    setComponent(i: number, c: string) {
        if (i < 0 || i > this.noComponents) {
            throw new Error('Index out of bounds');
        }
        if (i === this.noComponents) {
            this.append(c);
        } else {
            const components = this.getComponents();
            components[i] = c;
            this.name = components.join(this.getDelimiterCharacter());
        }
    }

    insert(i: number, c: string) {
        if (i < 0 || i > this.noComponents) {
            throw new Error('Index out of bounds');
        }
        if (i === this.noComponents) {
            this.append(c);
        } else {
            const components = this.getComponents();
            components.splice(i, 0, c);
            this.name = components.join(this.getDelimiterCharacter());
            this.noComponents++;
        }
    }
    append(c: string) {
        this.name += this.getDelimiterCharacter() + c;
        this.noComponents++;
    }
    remove(i: number) {
        if (i < 0 || i >= this.noComponents) {
            throw new Error('Index out of bounds');
        }
        const components = this.getComponents();
        components.splice(i, 1);
        this.name = components.join(this.getDelimiterCharacter());
        this.noComponents--;
    }

    private getComponents() {
        const escapedDelimiter = this.getDelimiterCharacter().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex =  new RegExp(`(?<!\\${ESCAPE_CHARACTER})${escapedDelimiter}`);
        return this.name.split(regex);
    }

}