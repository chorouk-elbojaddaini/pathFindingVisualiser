import { Square } from "./squareModele";

export class Board{
    constructor(public width:number,public height:number,public currentNode:Square,public enteredNode:Square,public mouseDown:boolean,public mouseEnter:boolean,public mouseUp:boolean,public mouseLeave:boolean,public isSelectedNodeStart:boolean ,public isSelectedNodeEnd:boolean,public isWallDrawing:boolean,public path:Square[],public isSelectedNodePerson:boolean){}
}