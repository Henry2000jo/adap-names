import { IllegalArgumentException } from "../common/IllegalArgumentException";
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
        this.parentNode = pn;
    }

    public move(to: Directory): void {
        this.assertIsNotNullOrUndefined(to);

        this.parentNode.remove(this);
        to.add(this);
        // fehlt hier nicht noch ein this.parentNode = to; ?
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

    public getParentNode(): Node {
        return this.parentNode;
    }


    /* Assertion methods for preconditions */

    protected assertIsNotNullOrUndefined(other: Object): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(other, "null or undefined argument");     
    }

    protected assertIsNotEmpty(s: string): void {
        IllegalArgumentException.assertCondition(s.length > 0, "empty string argument");
    }

    protected assertDoesNotContainSeparator(s: string): void {
        IllegalArgumentException.assertCondition(s.includes(SEPARATOR), "separator character in argument");
    }

    protected assertValidName(s: string): void {
        this.assertIsNotEmpty(s);
        this.assertDoesNotContainSeparator(s);
    }

}
