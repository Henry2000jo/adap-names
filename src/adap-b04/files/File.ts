import { InvalidStateException } from "../common/InvalidStateException";
import { Node } from "./Node";
import { Directory } from "./Directory";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        this.assertIsInState(FileState.CLOSED);

        // do something
    }

    public close(): void {
        this.assertIsInState(FileState.OPEN);

        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

    
    /* Assertion methods for preconditions */

    protected assertIsInState(state: FileState) {
        if (state != this.doGetFileState()) {
            throw new InvalidStateException("invalid file state");
        }
    }

}