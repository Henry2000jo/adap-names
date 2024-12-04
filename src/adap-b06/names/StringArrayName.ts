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

        this.assertIsNotUndefined(other);
        for (let i = 0; i < other.length; i++) {
            this.assertIsValidComponent(other[i]);
        }

        for (let i = 0; i < other.length; i++) {
            this.components.push(other[i]);
        }
        
        this.assertSuccessfulConstruction2(other);
    }


    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);

        return this.components[i];
    }

    public setComponent(i: number, c: string): StringArrayName {
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);

        const newName = this.getDeepCopy();
        if (i === newName.getNoComponents()) {
            newName.components.push(c);
        } else {
            newName.components[i] = c;
        }

        this.assertSuccessfulSetComponent(newName, i, c);
        return newName;
    }

    public insert(i: number, c: string): StringArrayName {
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);

        const newName = this.getDeepCopy();
        if (i === newName.getNoComponents()) {
            newName.components.push(c);
        } else {
            newName.components.splice(i, 0, c);
        }

        this.assertSuccessfulInsert(newName, i, c);
        return newName;
    }

    public append(c: string): StringArrayName {
        this.assertIsValidComponent(c);

        const newName = this.getDeepCopy();
        newName.components.push(c);

        this.assertSuccessfulAppend(newName, c);
        return newName;
    }

    public remove(i: number): StringArrayName {
        this.assertIsValidIndex(i);

        const newName = this.getDeepCopy();
        newName.components.splice(i, 1);

        this.assertSuccessfulRemove(newName, i);
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