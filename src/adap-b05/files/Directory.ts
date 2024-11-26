import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        this.assertIsNotNullOrUndefined(cn);

        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        this.assertIsNotNullOrUndefined(cn);

        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {
        const result: Set<Node> = super.findNodes(bn);

        for (const node of this.childNodes) {
            const foundNodes: Set<Node> = node.findNodes(bn);
            foundNodes.forEach((n) => result.add(n));
        }

        return result;
    }

}