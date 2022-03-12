# SortableRows
Draggable and sortable table rows. The output is an array of objects with a position attribute on each object.

# >> [DEMO](https://davidticona.com/demos/sortablerows) <<

## Install
```
npm install sortablerows
```

## How to use
### HTML Table
Use the table with an id attribute
```
<table id="myTable">
</table>
```
Use the data attribute for each row
```
<tbody>
  <tr data-company-id="1" data-company-name="Huawei">
    <td>1</td>
    <td>Huawei</td>
  </tr>
  <tr data-company-id="2" data-company-name="Xiaomi">
    <td>2</td>
    <td>Xiaomi</td>
  </tr>
  <tr data-company-id="3" data-company-name="TikTok">
    <td>3</td>
    <td>TikTok</td>
  </tr>
  <tr data-company-id="4" data-company-name="Yandex">
    <td>4</td>
    <td>Yandex</td>
  </tr>
</tbody>
```
### Javascript
Import the class, import the CSS file and instantiate the class
```
import { SortableRows } from "sortablerows";
import "sortablerows/dist/sortablerows.css";
var myTable = new SortableRows("myTable");
```
Get the sorted items by calling `getData()`
```
document.getElementById("btnOutput").addEventListener("click", () => {
  let output = myTable.getData();
  console.log(output);
});
```
### Changelog
#### v1.1.0 
* Added minified version dist/sortablerows.min.js
#### v1.0.0 
* First release