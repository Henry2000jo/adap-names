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

        this.assertIsNotNullOrUndefined(other);
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

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);

        const savedName = this.name;
        const savedLength = this.getNoComponents();

        if (i === this.noComponents) {
            this.append(c);
        } else {
            const components = this.getComponents();
            components[i] = c;
            this.name = components.join(this.getDelimiterCharacter());
        }

        this.assertSuccessfulSetComponent(i, c, savedName, savedLength);
    }

    public insert(i: number, c: string) {
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);

        const savedName = this.name;
        const savedLength = this.getNoComponents();

        if (i === this.noComponents) {
            this.append(c);
        } else {
            const components = this.getComponents();
            components.splice(i, 0, c);
            this.name = components.join(this.getDelimiterCharacter());
            this.noComponents++;
        }

        this.assertSuccessfulInsert(i, c, savedName, savedLength);
    }

    public append(c: string) {
        this.assertIsValidComponent(c);

        const savedName = this.name;
        const savedLength = this.getNoComponents();

        this.name += this.getDelimiterCharacter() + c;
        this.noComponents++;

        this.assertSuccessfulAppend(c, savedName, savedLength);
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);

        const savedName = this.name;
        const savedLength = this.getNoComponents();
        
        const components = this.getComponents();
        components.splice(i, 1);
        this.name = components.join(this.getDelimiterCharacter());
        this.noComponents--;

        this.assertSuccessfulRemove(i, savedName, savedLength);
    }


    /* Helper methods */

    private getComponents(): string[] {
        if (this.name === '') {
            return [];
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
        InvalidStateException.assertCondition(this.noComponents === newName.getNoComponents(), "invalid number of components");
    }


    /* Assertion methods for postconditions */

    protected assertSuccessfulConstruction2(other: string): void {
        if (this.name !== other) {
            throw new MethodFailedException("construction failed");
        }
    }

    protected restoreNameAndFail(savedName: string, savedLength: number, msg: string): void {
        this.name = savedName;
        this.noComponents = savedLength;
        throw new MethodFailedException(msg);
    }

    protected assertSuccessfulSetComponent(i: number, c: string, savedName: string, savedLength: number): void {
        try {
            if (this.getComponent(i) !== c) {
                this.restoreNameAndFail(savedName, savedLength, "setComponent failed");
            }
        } catch (e) {
            this.restoreNameAndFail(savedName, savedLength, "setComponent failed");
        }
        for (let j = 0; j < this.getNoComponents(); j++) {
            if (j === i) {
                continue;
            }
            try {
                if (this.getComponent(j) !== new StringName(savedName, this.getDelimiterCharacter()).getComponent(j)) {
                    this.restoreNameAndFail(savedName, savedLength, "setComponent failed");
                }
            } catch (e) {
                this.restoreNameAndFail(savedName, savedLength, "setComponent failed");
            }
        }
    }

    protected assertSuccessfulInsert(i: number, c: string, savedName: string, savedLength: number): void {
        if (this.getNoComponents() !== savedLength + 1) {
            this.restoreNameAndFail(savedName, savedLength, "insert failed");
        }
        for (let j = 0; j < i; j++) {
            if (this.getComponent(j) !== new StringName(savedName, this.getDelimiterCharacter()).getComponent(j)) {
                this.restoreNameAndFail(savedName, savedLength, "insert failed");
            }
        }
        if (this.getComponent(i) !== c) {
            this.restoreNameAndFail(savedName, savedLength, "insert failed");
        }
        for (let j = i; j < savedLength; j++) {
            if (this.getComponent(j + 1) !== new StringName(savedName, this.getDelimiterCharacter()).getComponent(j)) {
                this.restoreNameAndFail(savedName, savedLength, "insert failed");
            }
        }
    }

    protected assertSuccessfulAppend(c: string, savedName: string, savedLength: number): void {
        if (this.getNoComponents() !== savedLength + 1) {
            this.restoreNameAndFail(savedName, savedLength, "append failed");
        }
        for (let j = 0; j < savedLength; j++) {
            if (this.getComponent(j) !== new StringName(savedName, this.getDelimiterCharacter()).getComponent(j)) {
                this.restoreNameAndFail(savedName, savedLength, "append failed");
            }
        }
        if (this.getComponent(this.getNoComponents() - 1) !== c) {
            this.restoreNameAndFail(savedName, savedLength, "append failed");
        }
    }

    protected assertSuccessfulRemove(i: number, savedName: string, savedLength: number): void {
        if (this.getNoComponents() !== savedLength - 1) {
            this.restoreNameAndFail(savedName, savedLength, "remove failed");
        }
        for (let j = 0; j < i; j++) {
            if (this.getComponent(j) !== new StringName(savedName, this.getDelimiterCharacter()).getComponent(j)) {
                this.restoreNameAndFail(savedName, savedLength, "remove failed");
            }
        }
        for (let j = i; j < savedLength - 1; j++) {
            if (this.getComponent(j) !== new StringName(savedName, this.getDelimiterCharacter()).getComponent(j + 1)) {
                this.restoreNameAndFail(savedName, savedLength, "remove failed");
            }
        }
    }

}