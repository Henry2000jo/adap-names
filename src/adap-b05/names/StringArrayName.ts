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

        this.assertIsNotNullOrUndefined(other);
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

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);

        const savedComponents = this.components.slice();

        if (i === this.getNoComponents()) {
            this.append(c);
        } else {
            this.components[i] = c;
        }

        this.assertSuccessfulSetComponent(i, c, savedComponents);
    }

    public insert(i: number, c: string) {
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);

        const savedComponents = this.components.slice();

        if (i === this.getNoComponents()) {
            this.append(c);
        } else {
            this.components.splice(i, 0, c);
        }

        this.assertSuccessfulInsert(i, c, savedComponents);
    }

    public append(c: string) {
        this.assertIsValidComponent(c);

        const savedComponents = this.components.slice();

        this.components.push(c);

        this.assertSuccessfulAppend(c, savedComponents);
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);

        const savedComponents = this.components.slice();

        this.components.splice(i, 1);

        this.assertSuccessfulRemove(i, savedComponents);
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
        
    protected restoreComponentsAndFail(savedComponents: string[], msg: string): void {
        this.components = savedComponents;
        throw new MethodFailedException(msg);
    }

    protected assertSuccessfulSetComponent(i: number, c: string, savedComponents: string[]): void {
        try {
            if (this.getComponent(i) !== c) {
                this.restoreComponentsAndFail(savedComponents, "setComponent failed");
            }
        } catch (e) {
            this.restoreComponentsAndFail(savedComponents, "setComponent failed");
        }
        for (let j = 0; j < savedComponents.length; j++) {
            if (j === i) {
                continue;
            }
            try {
                if (this.getComponent(j) !== savedComponents[j]) {
                    this.restoreComponentsAndFail(savedComponents, "setComponent failed");
                }
            } catch (e) {
                this.restoreComponentsAndFail(savedComponents, "setComponent failed");
            }
        }
    }

    protected assertSuccessfulInsert(i: number, c: string, savedComponents: string[]): void {
        if (this.getNoComponents() !== savedComponents.length + 1) {
            this.restoreComponentsAndFail(savedComponents, "insert failed");
        }
        for (let j = 0; j < i; j++) {
            if (this.getComponent(j) !== savedComponents[j]) {
                this.restoreComponentsAndFail(savedComponents, "insert failed");
            }
        }
        if (this.getComponent(i) !== c) {
            this.restoreComponentsAndFail(savedComponents, "insert failed");
        }
        for (let j = i; j < savedComponents.length; j++) {
            if (this.getComponent(j + 1) !== savedComponents[j]) {
                this.restoreComponentsAndFail(savedComponents, "insert failed");
            }
        }
    }

    protected assertSuccessfulAppend(c: string, savedComponents: string[]): void {
        if (this.getNoComponents() !== savedComponents.length + 1) {
            this.restoreComponentsAndFail(savedComponents, "append failed");
        }
        for (let j = 0; j < savedComponents.length; j++) {
            if (this.getComponent(j) !== savedComponents[j]) {
                this.restoreComponentsAndFail(savedComponents, "append failed");
            }
        }
        if (this.getComponent(this.getNoComponents() - 1) !== c) {
            this.restoreComponentsAndFail(savedComponents, "append failed");
        }
    }

    protected assertSuccessfulRemove(i: number, savedComponents: string[]): void {
        if (this.getNoComponents() !== savedComponents.length - 1) {
            this.restoreComponentsAndFail(savedComponents, "remove failed");
        }
        for (let j = 0; j < i; j++) {
            if (this.getComponent(j) !== savedComponents[j]) {
                this.restoreComponentsAndFail(savedComponents, "remove failed");
            }
        }
        for (let j = i; j < savedComponents.length - 1; j++) {
            if (this.getComponent(j) !== savedComponents[j + 1]) {
                this.restoreComponentsAndFail(savedComponents, "remove failed");
            }
        }
    }

}