import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;


    protected assertClassInvariants(): void {
        super.assertClassInvariants();
        this.assertHasValidNoComponents();
    }


    constructor(other: string, delimiter?: string) {
        super(delimiter);

        this.assertIsNotUndefined(other);

        this.name = other;
        const components = this.getComponents();

        for (let i = 0; i < components.length; i++) {
            this.assertIsValidComponent(components[i]);
        }

        this.noComponents = components.length;
        
        this.assertSuccessfulConstruction2(other);
    }


    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        
        const components = this.getComponents();
        return components[i];
    }

    public setComponent(i: number, c: string): StringName {
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);

        const newName = this.getDeepCopy();
        if (i === newName.noComponents) {
            newName.name += newName.getDelimiterCharacter() + c;
            newName.noComponents++;
        } else {
            const components = newName.getComponents();
            components[i] = c;
            newName.name = components.join(newName.getDelimiterCharacter());
        }

        this.assertSuccessfulSetComponent(newName, i, c);
        return newName;

    }

    public insert(i: number, c: string): StringName {
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);

        const newName = this.getDeepCopy();
        if (i === newName.noComponents) {
            newName.name += newName.getDelimiterCharacter() + c;
            newName.noComponents++;
        } else {
            const components = newName.getComponents();
            components.splice(i, 0, c);
            newName.name = components.join(newName.getDelimiterCharacter());
            newName.noComponents++;
        }

        this.assertSuccessfulInsert(newName, i, c);
        return newName;
    }

    public append(c: string): StringName {
        this.assertIsValidComponent(c);

        const newName = this.getDeepCopy();
        newName.name += newName.getDelimiterCharacter() + c;
        newName.noComponents++;
        return newName;

        // this.assertSuccessfulAppend(c, savedName, savedLength);
    }

    public remove(i: number): StringName {
        this.assertIsValidIndex(i);
        
        const newName = this.getDeepCopy();
        const components = newName.getComponents();
        components.splice(i, 1);
        newName.name = components.join(newName.getDelimiterCharacter());
        newName.noComponents--;
        return newName;

        // this.assertSuccessfulRemove(i, savedName, savedLength);
    }


    /* Helper methods */

    protected getDeepCopy(): StringName {
        return new StringName(this.name, this.getDelimiterCharacter());
    }

    private getComponents(): string[] {
        if (this.name === '') {
            return [''];
        }
        let components: string[] = [''];
        let prevIsEscapeCharacter = false;
        for (let i = 0; i < this.name.length; i++) {
            const current = this.name.charAt(i);
            if (prevIsEscapeCharacter) {
                components[components.length - 1] += current;
                prevIsEscapeCharacter = false;
            } else {
                if (current === ESCAPE_CHARACTER) {
                    components[components.length - 1] += current;
                    prevIsEscapeCharacter = true;
                } else if (current === this.getDelimiterCharacter()) {
                    components.push('');
                } else {
                    components[components.length - 1] += current;
                }
            }
        }
        return components;
    }


    /* Assertion methods for class invariants */

    protected assertHasValidNoComponents(): void {
        const newName = new StringName(this.name, this.getDelimiterCharacter());
        InvalidStateException.assert(this.noComponents === newName.getNoComponents(), "invalid number of components");
    }


    /* Assertion methods for postconditions */

    protected assertSuccessfulConstruction2(other: string): void {
        if (this.name !== other) {
            throw new MethodFailedException("construction failed");
        }
    }

}