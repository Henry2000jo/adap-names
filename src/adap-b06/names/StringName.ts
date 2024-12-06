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

        // Precondition
        this.assertIsNotUndefined(other);
        const components = this.getComponents(other);
        for (let i = 0; i < components.length; i++) {
            this.assertIsValidComponent(components[i]);
        }

        // Body
        this.name = other;
        this.noComponents = components.length;
        
        // Postcondition
        this.assertSuccessfulConstruction2(other);
        this.assertClassInvariants();
    }


    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        // Precondition
        this.assertIsValidIndex(i);
        
        // Body
        const components = this.getComponents();
        return components[i];
    }

    public setComponent(i: number, c: string): StringName {
        // Precondition
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);

        // Body
        const newName = this.getDeepCopy();
        if (i === newName.noComponents) {
            newName.name += newName.getDelimiterCharacter() + c;
            newName.noComponents++;
        } else {
            const components = newName.getComponents();
            components[i] = c;
            newName.name = components.join(newName.getDelimiterCharacter());
        }

        // Postcondition
        newName.assertSuccessfulSetComponent(this, i, c);
        this.assertClassInvariants();
        newName.assertClassInvariants();
        return newName;

    }

    public insert(i: number, c: string): StringName {
        // Precondition
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);

        // Body
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

        // Postcondition
        newName.assertSuccessfulInsert(this, i, c);
        this.assertClassInvariants();
        newName.assertClassInvariants();
        return newName;
    }

    public append(c: string): StringName {
        // Precondition
        this.assertIsValidComponent(c);

        // Body
        const newName = this.getDeepCopy();
        newName.name += newName.getDelimiterCharacter() + c;
        newName.noComponents++;

        // Postcondition
        newName.assertSuccessfulAppend(this, c);
        this.assertClassInvariants();
        newName.assertClassInvariants();
        return newName;
    }

    public remove(i: number): StringName {
        // Precondition
        this.assertIsValidIndex(i);
        
        // Body
        const newName = this.getDeepCopy();
        const components = newName.getComponents();
        components.splice(i, 1);
        newName.name = components.join(newName.getDelimiterCharacter());
        newName.noComponents--;

        // Postcondition
        newName.assertSuccessfulRemove(this, i);
        this.assertClassInvariants();
        newName.assertClassInvariants();
        return newName;
    }


    /* Helper methods */

    protected getDeepCopy(): StringName {
        return new StringName(this.name, this.getDelimiterCharacter());
    }

    private getComponents(name: String = this.name): string[] {
        if (name === '') {
            return [''];
        }
        let components: string[] = [''];
        let prevIsEscapeCharacter = false;
        for (let i = 0; i < name.length; i++) {
            const current = name.charAt(i);
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
        const components = this.getComponents();
        InvalidStateException.assert(this.noComponents === components.length, "invalid number of components");
    }


    /* Assertion methods for postconditions */

    protected assertSuccessfulConstruction2(other: string): void {
        if (this.name !== other) {
            throw new MethodFailedException("construction failed");
        }
    }

}