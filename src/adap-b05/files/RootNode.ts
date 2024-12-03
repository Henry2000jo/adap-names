import { InvalidStateException } from "../common/InvalidStateException";
import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { SEPARATOR } from "./Node";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        // null operation
    }

    protected assertValidName(s: string): void {
        this.assertIsNotNullOrUndefined(s);
        this.assertDoesNotContainSeparator(s);
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertValidNameClass(bn);
    }

    /* Assertion methods for class invariants */

    protected assertIsNotNullOrUndefinedClass(other: Object): void {
        InvalidStateException.assertIsNotNullOrUndefined(other, "null or undefined argument");     
    }

    protected assertDoesNotContainSeparatorClass(s: string): void {
        InvalidStateException.assert(!s.includes(SEPARATOR), "separator character in argument");
    }

    protected assertValidNameClass(s: string): void {
        this.assertIsNotNullOrUndefinedClass(s);
        this.assertDoesNotContainSeparatorClass(s);
    }

}