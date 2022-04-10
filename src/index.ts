/**
 * Draggable and sortable table rows. The output is an array of objects with a position attribute on each object.
 * @author David Tomas Ticona Saravia
 * @version 1.1.1
 * @license MIT
 */
class SortableRows {
  protected table: HTMLTableElement;
  protected tbody: HTMLTableSectionElement;
  protected currRow: HTMLTableRowElement | null = null;
  protected dragElem: HTMLTableRowElement | null = null;
  protected startX = 0;
  protected startY = 0;
  protected moveX = 0;
  protected moveY = 0;
  protected isDragged = false;

  constructor(id: string) {
    this.table = document.getElementById(id) as HTMLTableElement;
    this.tbody = this.table.querySelector("tbody") as HTMLTableSectionElement;
    if (this.table == null) {
      throw `You called the SortableRows constructor with "${id}" ID, but there is no such element in the document.`;
    }
    if (this.table.tagName.toLowerCase() != "table") {
      throw "The selected element is not a <table>.";
    }
    this.table.classList.add("draggable-table");
    this.init();
  }

  protected init(): void {
    this.bindEvents();
  }
  
  protected onStartDragging(event: MouseEvent | TouchEvent): void{
    if (event instanceof MouseEvent) {
      if (event.button != 0) return;
    }
    let target = this.getTargetRow(event.target as HTMLTableRowElement);
    if (target) {
      this.currRow = target;
      this.addDraggableRow(target);
      this.currRow.classList.add("is-dragging");
      let coords = this.getCoords(event);
      this.startX = coords.x;
      this.startY = coords.y;
      this.isDragged = true;
    }
  }

  protected onMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragged) return;
    let coords = this.getCoords(event);
    this.moveX = coords.x - this.startX;
    this.moveY = coords.y - this.startY;
    this.moveRow(this.moveX, this.moveY);
  }
 
  protected onEndDragging(event: MouseEvent | TouchEvent): void {
    if (!this.isDragged) return;
    this.currRow?.classList.remove("is-dragging");
    this.table.removeChild(this.dragElem as Node);
    this.dragElem = null;
    this.isDragged = false;
  }

  protected bindEvents(): void {
    this.table.addEventListener("touchstart", (e) => this.onStartDragging(e));
    this.table.addEventListener("touchmove", (e) => this.onMove(e));
    this.table.addEventListener("touchend", (e) => this.onEndDragging(e));
    this.table.addEventListener("mousedown", (e) => this.onStartDragging(e));
    this.table.addEventListener("mousemove", (e) => this.onMove(e));
    this.table.addEventListener("mouseup", (e) => this.onEndDragging(e));
  }

  protected swapRow(row: HTMLTableRowElement, index: number): void {
    let currIndex = Array.from(this.tbody.children).indexOf(this.currRow as Element),
      row1 = currIndex > index ? this.currRow : row,
      row2 = currIndex > index ? row : this.currRow;
    this.tbody.insertBefore(row1 as Node, row2);
  }

  protected moveRow(x: number, y: number): void {
    var dragElem: HTMLTableRowElement = this.dragElem as HTMLTableRowElement;
    dragElem.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";

    let dPos = dragElem.getBoundingClientRect(),
      currStartY = dPos.y,
      currEndY = currStartY + dPos.height,
      rows = this.getRows();

    for (var i = 0; i < rows.length; i++) {
      let rowElem = rows[i];
      let rowSize = rowElem.getBoundingClientRect(),
        rowStartY = rowSize.y,
        rowEndY = rowStartY + rowSize.height;

      if (
        this.currRow !== rowElem &&
        this.isIntersecting(currStartY, currEndY, rowStartY, rowEndY)
      ) {
        if (Math.abs(currStartY - rowStartY) < rowSize.height / 2)
          this.swapRow(rowElem, i);
      }
    }
  }

  protected addDraggableRow(target: HTMLTableRowElement): void {
    this.dragElem = target.cloneNode(true) as HTMLTableRowElement;
    this.dragElem.classList.add("draggable-table-tr");
    this.dragElem.style.height = this.getStyle(target, "height");
    this.dragElem.style.background = this.getStyle(target, "background-color");
    for (var i = 0; i < target.children.length; i++) {
      let oldTD = target.children[i];
      let newTD = this.dragElem.children[i] as HTMLElement;
      newTD.style.width = this.getStyle(oldTD, "width");
      newTD.style.height = this.getStyle(oldTD, "height");
      newTD.style.padding = this.getStyle(oldTD, "padding");
      newTD.style.margin = this.getStyle(oldTD, "margin");
    }
    this.table.appendChild(this.dragElem);
    let tPos = target.getBoundingClientRect(),
      dPos = this.dragElem.getBoundingClientRect();
    this.dragElem.style.bottom = dPos.y - tPos.y - tPos.height + "px";
    this.dragElem.style.left = "-1px";
    this.table.dispatchEvent(
      new MouseEvent("mousemove", {
        view: window,
        cancelable: true,
        bubbles: true,
      })
    );
  }

  protected getRows(): NodeListOf<HTMLTableRowElement> {
    return this.table.querySelectorAll("tbody tr");
  }

  protected getTargetRow(target: HTMLTableRowElement): HTMLTableRowElement | null | undefined {
    let elemName = target.tagName.toLowerCase();
    if (elemName == "tr") return target;
    if (elemName == "td") return target.closest("tr");
  }

  protected getCoords(event: MouseEvent | TouchEvent): { x: number; y: number; } {
    let x = 0, y = 0;
    if (event instanceof MouseEvent) {
      x = event.clientX;
      y = event.clientY;
    } else {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    }
    return { x, y };
  }

  protected getStyle(target: Element, styleName: string): string {
    let compStyle = getComputedStyle(target);
    return compStyle.getPropertyValue(styleName);
  }
  
  protected isIntersecting(min0: number, max0: number, min1: number, max1: number): boolean {
    return (
      Math.max(min0, max0) >= Math.min(min1, max1) &&
      Math.min(min0, max0) <= Math.max(min1, max1)
    );
  }

  public getData(): { position: number; }[] {
    var output = [];
    var table = this.table;
    for (let ib = 0; ib < table.tBodies.length; ib++) {
      let tbody = table.tBodies[ib];
      for (let i = 0; i < tbody.rows.length; i++) {
        let filaDataset = tbody.rows.item(i)?.dataset;
        output.push({ position: i, ...filaDataset });
      }
    }
    return output;
  }
}

export { SortableRows };
