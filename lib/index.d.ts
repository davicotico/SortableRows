/**
 * Draggable and sortable table rows. The output is an array of objects with a position attribute on each object.
 * @author David Tomas Ticona Saravia
 * @version 1.1.2
 * @license MIT
 */
declare class SortableRows {
    protected table: HTMLTableElement;
    protected tbody: HTMLTableSectionElement;
    protected currRow: HTMLTableRowElement | null;
    protected dragElem: HTMLTableRowElement | null;
    protected startX: number;
    protected startY: number;
    protected moveX: number;
    protected moveY: number;
    protected isDragged: boolean;
    constructor(id: string);
    protected init(): void;
    protected onStartDragging(event: MouseEvent | TouchEvent): void;
    protected onMove(event: MouseEvent | TouchEvent): void;
    protected onEndDragging(event: MouseEvent | TouchEvent): void;
    protected bindEvents(): void;
    protected swapRow(row: HTMLTableRowElement, index: number): void;
    protected moveRow(x: number, y: number): void;
    protected addDraggableRow(target: HTMLTableRowElement): void;
    protected getRows(): NodeListOf<HTMLTableRowElement>;
    protected getTargetRow(target: HTMLTableRowElement): HTMLTableRowElement | null | undefined;
    protected getCoords(event: MouseEvent | TouchEvent): {
        x: number;
        y: number;
    };
    protected getStyle(target: Element, styleName: string): string;
    protected isIntersecting(min0: number, max0: number, min1: number, max1: number): boolean;
    getData(): {
        position: number;
    }[];
}
export { SortableRows };
//# sourceMappingURL=index.d.ts.map