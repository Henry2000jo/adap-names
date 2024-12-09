import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;


    protected assertClassInvariants(): void {
        this.assertHasValidDelimiter();
        this.assertHasValidComponents();
    }


    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // Precondition
        this.assertIsValidDelimiter(delimiter);

        // Body
        this.delimiter = delimiter;

        // Postcondition
        this.assertSuccessfulConstruction(delimiter);
    }


    public clone(): Name {
        // Precondition
        this.assertClassInvariants();
        
        // Body
        const savedName = this.getDeepCopy();
        const clone = Object.create(Object.getPrototypeOf(this));
        const result = Object.assign(clone, this);

        // Postcondition & Class Invariant
        this.assertSuccessfulClone(result);
        this.assertClassInvariants();
        result.assertClassInvariants();
        this.assertStateDidNotChange(savedName);
        return result;
    }

    public asString(delimiter: string = this.delimiter): string {
        // Precondition
        this.assertIsValidDelimiter(delimiter);

        // Body
        let nameString: string = '';
        for (let i = 0; i < this.getNoComponents(); i++) {
            let component: string = this.getComponent(i);
            nameString += this.getUnmaskedComponent(component);
            if (i < this.getNoComponents() - 1) {
                nameString += delimiter;
            }
        }
        return nameString;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let nameString: string = '';
        for (let i = 0; i < this.getNoComponents(); i++) {
            let component: string = this.getComponent(i);
            nameString += component;
            if (i < this.getNoComponents() - 1) {
                nameString += this.getDelimiterCharacter();
            }
        }
        return JSON.stringify({ delimiter: this.getDelimiterCharacter(), name: nameString });
    }

    public isEqual(other: Name): boolean {
        // Precondition
        this.assertIsNotUndefined(other);

        // Body
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        // Postcondition
        this.assertHashCodeIsEqual(other);
        return true;
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    public concat(other: Name): Name {
        // Precondition
        this.assertIsNotUndefined(other);
        // Kein Fehler bei unterschiedlichen Delimiter-Zeichen -> this Delimiter wird verwendet

        // Body
        const savedName = this.getDeepCopy();
        let newName = this.getDeepCopy();
        for (let i = 0; i < other.getNoComponents(); i++) {
            newName = newName.append(other.getComponent(i));
        }

        // Postcondition & Class Invariant
        this.assertSuccessfulConcat(newName, other);
        this.assertClassInvariants();
        if (newName instanceof AbstractName) {
            newName.assertClassInvariants();
        }
        if (other instanceof AbstractName) {
            other.assertClassInvariants();
        }
        if (savedName instanceof AbstractName) {
            this.assertStateDidNotChange(savedName);
        }
        return newName;
    }


    /* Helper methods */
    
    protected abstract getDeepCopy(): Name;

    protected getUnmaskedComponent(c: string): string {
        let prevIsEscapeCharacter: boolean = false;
        let unmasked: string = '';
        for (let i = 0; i < c.length; i++) {
            let current = c.charAt(i);
            if (prevIsEscapeCharacter) {
                if (current === ESCAPE_CHARACTER) {
                    unmasked += ESCAPE_CHARACTER;
                } else if (current === this.getDelimiterCharacter()) {
                    unmasked += this.getDelimiterCharacter();
                } else {
                    unmasked += current;
                }
                prevIsEscapeCharacter = false;
            } else {
                if (current === ESCAPE_CHARACTER) {
                    prevIsEscapeCharacter = true;
                } else {
                    unmasked += current;
                }
            }
        }
        return unmasked;
    }


    /* Assertion methods general */

    protected assertIsNotUndefined(other: Object, useStateException: boolean = false): void {
        if (useStateException) {
            InvalidStateException.assertIsNotUndefined(other, "null or undefined argument");
        } else {
            IllegalArgumentException.assertIsNotUndefined(other, "null or undefined argument");    
        } 
    }

    protected assertIsSingleCharacter(s: string, useStateException: boolean = false): void {
        const condition: boolean = s.length === 1;
        if (useStateException) {
            InvalidStateException.assert(condition, "not single character argument");
        } else {
            IllegalArgumentException.assert(condition, "not single character argument");
        }
    }

    protected assertIsNotEscapeCharacter(s: string, useStateException: boolean = false): void {
        const condition: boolean = s !== ESCAPE_CHARACTER;
        if (useStateException) {
            InvalidStateException.assert(condition, "escape character argument");
        } else {
            IllegalArgumentException.assert(condition, "escape character argument");
        }
    }

    protected assertIsValidDelimiter(s: string, useStateException: boolean = false): void {
        this.assertIsNotUndefined(s, useStateException);
        this.assertIsSingleCharacter(s, useStateException);
        this.assertIsNotEscapeCharacter(s, useStateException);
    }

    protected assertIsProperlyMasked(s: string, useStateException: boolean = false): void {
        let escapeCharacterRead: boolean = false;
        for (let i = 0; i < s.length; i++) {
            if (s.charAt(i) === ESCAPE_CHARACTER) {
                if (escapeCharacterRead) {
                    escapeCharacterRead = false;
                } else {
                    escapeCharacterRead = true;
                }
            } else if (s.charAt(i) === this.getDelimiterCharacter()) {
                if (useStateException) {
                    InvalidStateException.assert(escapeCharacterRead, "unmasked delimiter character");
                } else {
                    IllegalArgumentException.assert(escapeCharacterRead, "unmasked delimiter character");
                }
                escapeCharacterRead = false;
            } else {
                escapeCharacterRead = false;
            }
        }
    }
    
    protected assertIsValidComponent(c: string, useStateException: boolean = false): void {
        this.assertIsNotUndefined(c, useStateException);
        this.assertIsProperlyMasked(c, useStateException);
    }

    protected assertIndexInBounds(i: number, includeUpperBound: boolean = false, useStateException: boolean = false): void {
        const condition: boolean = i >= 0 && (includeUpperBound ? i <= this.getNoComponents() : i < this.getNoComponents());
        if (useStateException) {
            InvalidStateException.assert(condition, "index out of bounds");
        } else {
            IllegalArgumentException.assert(condition, "index out of bounds");
        }
    }

    protected assertIsValidIndex(i: number, includeUpperBound: boolean = false, useStateException: boolean = false): void {
        this.assertIsNotUndefined(i, useStateException);
        this.assertIndexInBounds(i, includeUpperBound, useStateException);
    }


    /* Assertion methods for class invariants */

    protected assertStateDidNotChange(savedName: Name): void {
        InvalidStateException.assert(this.getDelimiterCharacter() === savedName.getDelimiterCharacter(), "state changed");
        InvalidStateException.assert(this.getNoComponents() === savedName.getNoComponents(), "state changed");
        for (let i = 0; i < this.getNoComponents(); i++) {
            InvalidStateException.assert(this.getComponent(i) === savedName.getComponent(i), "state changed");
        }
    }

    protected assertHasValidDelimiter(): void {
        this.assertIsValidDelimiter(this.getDelimiterCharacter(), true);
    }

    protected assertHasValidComponents(): void {
        for (let i = 0; i < this.getNoComponents(); i++) {
            this.assertIsValidComponent(this.getComponent(i), true);
        }
    }    


    /* Assertion methods for postconditions */

    protected assertSuccessfulConstruction(delimiter: string): void {
        MethodFailedException.assert(this.getDelimiterCharacter() === delimiter, "construction not successful");
    }

    protected assertSuccessfulClone(clone: Name): void {
        MethodFailedException.assertIsNotUndefined(clone, "clone not successful");
        MethodFailedException.assert(clone !== this, "clone not successful");
        MethodFailedException.assert(clone.isEqual(this), "clone not successful");
    }

    protected assertHashCodeIsEqual(other: Name): void {
        MethodFailedException.assert(this.getHashCode() === other.getHashCode(), "hash codes not equal");
    }

    protected assertSuccessfulConcat(newName: Name, other: Name): void {
        const thisNoComponents = this.getNoComponents();
        const otherNoComponents = other.getNoComponents();
        if (thisNoComponents + otherNoComponents !== newName.getNoComponents()) {
            throw new MethodFailedException("concat not successful");
        }
        for (let i = 0; i < thisNoComponents; i++) {
            if (this.getComponent(i) !== newName.getComponent(i)) {
                throw new MethodFailedException("concat not successful");
            }
        }
        for (let i = 0; i < otherNoComponents; i++) {
            if (other.getComponent(i) !== newName.getComponent(thisNoComponents + i)) {
                throw new MethodFailedException("concat not successful");
            }
        }
    }


    /* Assertion methods for postconditions for subclasses */

    protected assertSuccessfulSetComponent(oldName: AbstractName, i: number, c: string): void {
        if (i === oldName.getNoComponents()) {
            if (oldName.getNoComponents() + 1 !== this.getNoComponents()) {
                throw new MethodFailedException("setComponent failed");
            }
        } else {
            if (oldName.getNoComponents() !== this.getNoComponents()) {
                throw new MethodFailedException("setComponent failed");
            }
        }
        if (this.getComponent(i) !== c) {
            throw new MethodFailedException("setComponent failed");
        }
        for (let j = 0; j < oldName.getNoComponents(); j++) {
            if (j === i) {
                continue;
            }
            if (oldName.getComponent(j) !== this.getComponent(j)) {
                throw new MethodFailedException("setComponent failed");
            }
        }
    }

    protected assertSuccessfulInsert(oldName: AbstractName, i: number, c: string): void {
        if (oldName.getNoComponents() + 1 !== this.getNoComponents()) {
            throw new MethodFailedException("insert failed");
        }
        for (let j = 0; j < i; j++) {
            if (oldName.getComponent(j) !== this.getComponent(j)) {
                throw new MethodFailedException("insert failed");
            }
        }
        if (this.getComponent(i) !== c) {
            throw new MethodFailedException("insert failed");
        }
        for (let j = i; j < oldName.getNoComponents(); j++) {
            if (oldName.getComponent(j) !== this.getComponent(j + 1)) {
                throw new MethodFailedException("insert failed");
            }
        }
    }

    protected assertSuccessfulAppend(oldName: AbstractName, c: string): void {
        if (oldName.getNoComponents() + 1 !== this.getNoComponents()) {
            throw new MethodFailedException("append failed");
        }
        for (let j = 0; j < oldName.getNoComponents(); j++) {
            if (oldName.getComponent(j) !== this.getComponent(j)) {
                throw new MethodFailedException("append failed");
            }
        }
        if (this.getComponent(this.getNoComponents() - 1) !== c) {
            throw new MethodFailedException("append failed");
        }
    }

    protected assertSuccessfulRemove(oldName: AbstractName, i: number): void {
        if (oldName.getNoComponents() - 1 !== this.getNoComponents()) {
            throw new MethodFailedException("remove failed");
        }
        for (let j = 0; j < i; j++) {
            if (oldName.getComponent(j) !== this.getComponent(j)) {
                throw new MethodFailedException("remove failed");
            }
        }
        for (let j = i + 1; j < oldName.getNoComponents(); j++) {
            if (oldName.getComponent(j) !== this.getComponent(j - 1)) {
                throw new MethodFailedException("remove failed");
            }
        }
    }

}