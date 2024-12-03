import { Exception } from "../common/Exception";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export const SEPARATOR: string = "/";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertValidName(bn);
        this.assertIsNotNullOrUndefined(pn);

        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.add(this);
    }

    public move(to: Directory): void {
        this.assertIsNotNullOrUndefined(to);

        this.parentNode.remove(this);
        to.add(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertValidName(bn);

        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        this.assertValidName(bn);

        try {
            this.assertClassInvariants();
        } catch (e) {
            ServiceFailureException.assert(false, undefined, e as Exception);
        } 

        const result: Set<Node> = new Set<Node>();
        if (this.getBaseName() == bn) {
            result.add(this);
        }

        try {
            this.assertClassInvariants();
        } catch (e) {
            ServiceFailureException.assert(false, undefined, e as Exception);
        } 
        return result;
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertValidNameClass(bn);
    }



    /* Assertion methods for preconditions */

    protected assertIsNotNullOrUndefined(other: Object): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(other, "null or undefined argument");     
    }

    protected assertIsNotEmpty(s: string): void {
        IllegalArgumentException.assert(s.length > 0, "empty string argument");
    }

    protected assertDoesNotContainSeparator(s: string): void {
        IllegalArgumentException.assert(!s.includes(SEPARATOR), "separator character in argument");
    }

    protected assertValidName(s: string): void {
        this.assertIsNotNullOrUndefined(s);
        this.assertIsNotEmpty(s);
        this.assertDoesNotContainSeparator(s);
    }

    /* Assertion methods for class invariants */

    protected assertIsNotNullOrUndefinedClass(other: Object): void {
        InvalidStateException.assertIsNotNullOrUndefined(other, "null or undefined argument");     
    }

    protected assertIsNotEmptyClass(s: string): void {
        InvalidStateException.assert(s.length > 0, "empty string argument");
    }

    protected assertDoesNotContainSeparatorClass(s: string): void {
        InvalidStateException.assert(!s.includes(SEPARATOR), "separator character in argument");
    }

    protected assertValidNameClass(s: string): void {
        this.assertIsNotNullOrUndefinedClass(s);
        this.assertIsNotEmptyClass(s);
        this.assertDoesNotContainSeparatorClass(s);
    }

}
