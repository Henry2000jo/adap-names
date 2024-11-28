import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

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

        const result: Set<Node> = new Set<Node>();
        if (this.getBaseName() == bn) {
            result.add(this);
        }
        return result;
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
    }

    protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
        const condition: boolean = (bn != "");
        AssertionDispatcher.dispatch(et, condition, "invalid base name");
    }


    /* Assertion methods for preconditions */

    protected assertIsNotNullOrUndefined(other: Object): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(other, "null or undefined argument");     
    }

    protected assertIsNotEmpty(s: string): void {
        IllegalArgumentException.assertCondition(s.length > 0, "empty string argument");
    }

    protected assertDoesNotContainSeparator(s: string): void {
        IllegalArgumentException.assertCondition(!s.includes(SEPARATOR), "separator character in argument");
    }

    protected assertValidName(s: string): void {
        this.assertIsNotNullOrUndefined(s);
        //this.assertIsNotEmpty(s);
        this.assertDoesNotContainSeparator(s);
    }

}
