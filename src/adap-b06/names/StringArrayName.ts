import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];


    protected assertClassInvariants(): void {
        super.assertClassInvariants();
        this.assertHasValidComponentsInArray();
    }


    constructor(other: string[], delimiter?: string) {
        super(delimiter);

        // Precondition
        this.assertIsNotUndefined(other);
        for (let i = 0; i < other.length; i++) {
            this.assertIsValidComponent(other[i]);
        }

        // Body
        for (let i = 0; i < other.length; i++) {
            this.components.push(other[i]);
        }
        
        // Postcondition
        this.assertSuccessfulConstruction2(other);
        this.assertClassInvariants();
    }


    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        // Precondition
        this.assertIsValidIndex(i);

        // Body
        return this.components[i];
    }

    public setComponent(i: number, c: string): StringArrayName {
        // Precondition
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);

        // Body
        const newName = this.getDeepCopy();
        if (i === newName.getNoComponents()) {
            newName.components.push(c);
        } else {
            newName.components[i] = c;
        }

        // Postcondition
        newName.assertSuccessfulSetComponent(this, i, c);
        this.assertClassInvariants();
        newName.assertClassInvariants();
        return newName;
    }

    public insert(i: number, c: string): StringArrayName {
        // Precondition
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);

        // Body
        const newName = this.getDeepCopy();
        if (i === newName.getNoComponents()) {
            newName.components.push(c);
        } else {
            newName.components.splice(i, 0, c);
        }

        // Postcondition
        newName.assertSuccessfulInsert(this, i, c);
        this.assertClassInvariants();
        newName.assertClassInvariants();
        return newName;
    }

    public append(c: string): StringArrayName {
        // Precondition
        this.assertIsValidComponent(c);

        // Body
        const newName = this.getDeepCopy();
        newName.components.push(c);

        // Postcondition
        newName.assertSuccessfulAppend(this, c);
        this.assertClassInvariants();
        newName.assertClassInvariants();
        return newName;
    }

    public remove(i: number): StringArrayName {
        // Precondition
        this.assertIsValidIndex(i);

        // Body
        const newName = this.getDeepCopy();
        newName.components.splice(i, 1);

        // Postcondition
        newName.assertSuccessfulRemove(this, i);
        this.assertClassInvariants();
        newName.assertClassInvariants();
        return newName;
    }


    /* Helper methods */

    protected getDeepCopy(): StringArrayName {
        return new StringArrayName(this.components, this.getDelimiterCharacter());
    }


    /* Assertion methods for class invariants */

    protected assertHasValidComponentsInArray(): void {
        InvalidStateException.assert(this.components.length === this.getNoComponents(), "invalid number of components");
        for (let i = 0; i < this.components.length; i++) {
            InvalidStateException.assert(this.components[i] === this.getComponent(i), "invalid component at index " + i);
        }
    }


    /* Assertion methods for postconditions */

    protected assertSuccessfulConstruction2(other: string[]): void {
        MethodFailedException.assert(this.getNoComponents() === other.length, "construction failed");
        for (let i = 0; i < other.length; i++) {
            MethodFailedException.assert(this.getComponent(i) === other[i], "construction failed");
        }
    }

}