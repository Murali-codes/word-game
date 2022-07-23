enum E{
        Not = 'Not',
    Asc = 'Asc',
    Desc = 'Desc',
}
/* eslint-disable  */
export type DataItem = any;
export default class Sorter {
static sort = (tableData: DataItem, column: any) => {
const compare = (row1: DataItem, row2: DataItem, propertyName: string, direction: number): number => {
if (!row1 && !row2) {
    return 0;
}
if (!row1) {
    return -1 * direction;
}
if (!row2) {
    return 1 * direction;
}

let value1: any;
let value2: any;

if (column.sortDataType === 'date') {
    value1 = Date.parse(row1[propertyName]);
    value2 = Date.parse(row2[propertyName]);
} else {
    value1 = row1[propertyName] != undefined && row1[propertyName] != null
    ? row1[propertyName].toLowerCase()
    : '';
    value2 = row2[propertyName] != undefined && row2[propertyName] != null
    ? row2[propertyName].toLowerCase()
    : '';
}

if (!value1 && !value2) {
    return 0;
}
if (!value1) {
    return -1 * direction;
}
if (!value2) {
    return 1 * direction;
}

return (value1 < value2 ? -1 : value1 === value2 ? 0 : 1) * direction;
};
console.log(column.sortDirection);
switch (column.sortDirection) {
case E.Asc:
    return tableData.sort();
case E.Desc:
    return tableData.sort((row1: DataItem, row2: DataItem) => compare(row1, row2, column.propertyName, -1));
default:
    return tableData;
}
};
}
