import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;


    protected assertClassInvariants(): void {
        this.assertHasValidDelimiter();
        this.assertHasValidComponents();
    }


    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertIsValidDelimiter(delimiter);

        this.delimiter = delimiter;

        this.assertSuccessfulConstruction(delimiter);
    }


    public clone(): Name {
        this.assertClassInvariants();
        
        const clone = Object.create(Object.getPrototypeOf(this));
        const result = Object.assign(clone, this);

        this.assertSuccessfulClone(result);
        return result;
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertIsValidDelimiter(delimiter);

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
        this.assertIsNotNullOrUndefined(other);

        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }
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
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        this.assertIsNotNullOrUndefined(other);

        const savedLength: number = this.getNoComponents();

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }

        this.assertSuccessfulConcat(other, savedLength);
    }


    /* Helper methods */

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

    protected assertIsNotNullOrUndefined(other: Object, useStateException: boolean = false): void {
        if (useStateException) {
            InvalidStateException.assertNotNullOrUndefined(other, "null or undefined argument");
        } else {
            IllegalArgumentException.assertIsNotNullOrUndefined(other, "null or undefined argument");    
        } 
    }

    protected assertIsSingleCharacter(s: string, useStateException: boolean = false): void {
        const condition: boolean = s.length === 1;
        if (useStateException) {
            InvalidStateException.assertCondition(condition, "not single character argument");
        } else {
            IllegalArgumentException.assertCondition(condition, "not single character argument");
        }
    }

    protected assertIsNotEscapeCharacter(s: string, useStateException: boolean = false): void {
        const condition: boolean = s !== ESCAPE_CHARACTER;
        if (useStateException) {
            InvalidStateException.assertCondition(condition, "escape character argument");
        } else {
            IllegalArgumentException.assertCondition(condition, "escape character argument");
        }
    }

    protected assertIsValidDelimiter(s: string, useStateException: boolean = false): void {
        this.assertIsNotNullOrUndefined(s, useStateException);
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
                    InvalidStateException.assertCondition(escapeCharacterRead, "unmasked delimiter character");
                } else {
                    IllegalArgumentException.assertCondition(escapeCharacterRead, "unmasked delimiter character");
                }
                escapeCharacterRead = false;
            } else {
                escapeCharacterRead = false;
            }
        }
    }
    
    protected assertIsValidComponent(c: string, useStateException: boolean = false): void {
        this.assertIsNotNullOrUndefined(c, useStateException);
        this.assertIsProperlyMasked(c, useStateException);
    }

    protected assertIndexInBounds(i: number, includeUpperBound: boolean = false, useStateException: boolean = false): void {
        const condition: boolean = i >= 0 && (includeUpperBound ? i <= this.getNoComponents() : i < this.getNoComponents());
        if (useStateException) {
            InvalidStateException.assertCondition(condition, "index out of bounds");
        } else {
            IllegalArgumentException.assertCondition(condition, "index out of bounds");
        }
    }

    protected assertIsValidIndex(i: number, includeUpperBound: boolean = false, useStateException: boolean = false): void {
        this.assertIsNotNullOrUndefined(i, useStateException);
        this.assertIndexInBounds(i, includeUpperBound, useStateException);
    }


    /* Assertion methods for class invariants */

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
        MethodFailureException.assertCondition(this.getDelimiterCharacter() === delimiter, "construction not successful");
    }

    protected assertSuccessfulClone(clone: Name): void {
        MethodFailureException.assertNotNullOrUndefined(clone, "clone not successful");
        MethodFailureException.assertCondition(clone !== this, "clone not successful");
        MethodFailureException.assertCondition(clone.isEqual(this), "clone not successful");
    }

    protected assertHashCodeIsEqual(other: Name): void {
        MethodFailureException.assertCondition(this.getHashCode() === other.getHashCode(), "hash codes not equal");
    }

    protected assertSuccessfulConcat(other: Name, savedLength: number): void {
        let successful: boolean = true;
        if (this.getNoComponents() !== savedLength + other.getNoComponents()) {
            successful = false;
        }
        if (successful) {
            for (let i = 0; i < other.getNoComponents(); i++) {
                if (this.getComponent(savedLength + i) !== other.getComponent(i)) {
                    successful = false;
                    break;
                }
            }
        }
        if (!successful) {
            for (let i = this.getNoComponents() - 1; i >= savedLength; i--) {
                this.remove(i);
            }
            throw new MethodFailureException("concat not successful");
        }
    }

}