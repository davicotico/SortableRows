var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * Draggable and sortable table rows. The output is an array of objects with a position attribute on each object.
 * @author David Tomas Ticona Saravia
 * @version 1.1.2
 * @license MIT
 */
var SortableRows = /** @class */ (function () {
    function SortableRows(id) {
        this.currRow = null;
        this.dragElem = null;
        this.startX = 0;
        this.startY = 0;
        this.moveX = 0;
        this.moveY = 0;
        this.isDragged = false;
        this.table = document.getElementById(id);
        if (this.table == null) {
            throw "You called the SortableRows constructor with \"" + id + "\" ID, but there is no such element in the document.";
        }
        this.tbody = this.table.querySelector("tbody");
        if (this.table.tagName.toLowerCase() != "table") {
            throw "The selected element is not a <table>.";
        }
        this.table.classList.add("draggable-table");
        this.init();
    }
    SortableRows.prototype.init = function () {
        this.bindEvents();
    };
    SortableRows.prototype.onStartDragging = function (event) {
        if (event instanceof MouseEvent) {
            if (event.button != 0)
                return;
        }
        var target = this.getTargetRow(event.target);
        if (target) {
            this.currRow = target;
            this.addDraggableRow(target);
            this.currRow.classList.add("is-dragging");
            var coords = this.getCoords(event);
            this.startX = coords.x;
            this.startY = coords.y;
            this.isDragged = true;
        }
    };
    SortableRows.prototype.onMove = function (event) {
        if (!this.isDragged)
            return;
        var coords = this.getCoords(event);
        this.moveX = coords.x - this.startX;
        this.moveY = coords.y - this.startY;
        this.moveRow(this.moveX, this.moveY);
    };
    SortableRows.prototype.onEndDragging = function (event) {
        var _a;
        if (!this.isDragged)
            return;
        (_a = this.currRow) === null || _a === void 0 ? void 0 : _a.classList.remove("is-dragging");
        this.table.removeChild(this.dragElem);
        this.dragElem = null;
        this.isDragged = false;
    };
    SortableRows.prototype.bindEvents = function () {
        var _this = this;
        this.table.addEventListener("touchstart", function (e) { return _this.onStartDragging(e); });
        this.table.addEventListener("touchmove", function (e) { return _this.onMove(e); });
        this.table.addEventListener("touchend", function (e) { return _this.onEndDragging(e); });
        this.table.addEventListener("mousedown", function (e) { return _this.onStartDragging(e); });
        this.table.addEventListener("mousemove", function (e) { return _this.onMove(e); });
        this.table.addEventListener("mouseup", function (e) { return _this.onEndDragging(e); });
    };
    SortableRows.prototype.swapRow = function (row, index) {
        var currIndex = Array.from(this.tbody.children).indexOf(this.currRow), row1 = currIndex > index ? this.currRow : row, row2 = currIndex > index ? row : this.currRow;
        this.tbody.insertBefore(row1, row2);
    };
    SortableRows.prototype.moveRow = function (x, y) {
        var dragElem = this.dragElem;
        dragElem.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
        var dPos = dragElem.getBoundingClientRect(), currStartY = dPos.y, currEndY = currStartY + dPos.height, rows = this.getRows();
        for (var i = 0; i < rows.length; i++) {
            var rowElem = rows[i];
            var rowSize = rowElem.getBoundingClientRect(), rowStartY = rowSize.y, rowEndY = rowStartY + rowSize.height;
            if (this.currRow !== rowElem &&
                this.isIntersecting(currStartY, currEndY, rowStartY, rowEndY)) {
                if (Math.abs(currStartY - rowStartY) < rowSize.height / 2)
                    this.swapRow(rowElem, i);
            }
        }
    };
    SortableRows.prototype.addDraggableRow = function (target) {
        this.dragElem = target.cloneNode(true);
        this.dragElem.classList.add("draggable-table-tr");
        this.dragElem.style.height = this.getStyle(target, "height");
        this.dragElem.style.background = this.getStyle(target, "background-color");
        for (var i = 0; i < target.children.length; i++) {
            var oldTD = target.children[i];
            var newTD = this.dragElem.children[i];
            newTD.style.width = this.getStyle(oldTD, "width");
            newTD.style.height = this.getStyle(oldTD, "height");
            newTD.style.padding = this.getStyle(oldTD, "padding");
            newTD.style.margin = this.getStyle(oldTD, "margin");
        }
        this.table.appendChild(this.dragElem);
        var tPos = target.getBoundingClientRect(), dPos = this.dragElem.getBoundingClientRect();
        this.dragElem.style.bottom = dPos.y - tPos.y - tPos.height + "px";
        this.dragElem.style.left = "-1px";
        this.table.dispatchEvent(new MouseEvent("mousemove", {
            view: window,
            cancelable: true,
            bubbles: true,
        }));
    };
    SortableRows.prototype.getRows = function () {
        return this.table.querySelectorAll("tbody tr");
    };
    SortableRows.prototype.getTargetRow = function (target) {
        var elemName = target.tagName.toLowerCase();
        if (elemName == "tr")
            return target;
        if (elemName == "td")
            return target.closest("tr");
    };
    SortableRows.prototype.getCoords = function (event) {
        var x = 0, y = 0;
        if (event instanceof MouseEvent) {
            x = event.clientX;
            y = event.clientY;
        }
        else {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        }
        return { x: x, y: y };
    };
    SortableRows.prototype.getStyle = function (target, styleName) {
        var compStyle = getComputedStyle(target);
        return compStyle.getPropertyValue(styleName);
    };
    SortableRows.prototype.isIntersecting = function (min0, max0, min1, max1) {
        return (Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1));
    };
    SortableRows.prototype.getData = function () {
        var _a;
        var output = [];
        var table = this.table;
        for (var ib = 0; ib < table.tBodies.length; ib++) {
            var tbody = table.tBodies[ib];
            for (var i = 0; i < tbody.rows.length; i++) {
                var filaDataset = (_a = tbody.rows.item(i)) === null || _a === void 0 ? void 0 : _a.dataset;
                output.push(__assign({ position: i }, filaDataset));
            }
        }
        return output;
    };
    return SortableRows;
}());
export { SortableRows };
//# sourceMappingURL=index.js.map