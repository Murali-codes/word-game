
import { expect,  } from 'chai';


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
            if (column.sortDataType == 'date') {
                value1 = Date.parse(row1[propertyName]);
                value2 = Date.parse(row2[propertyName]);
            } else {
                value1 =
                    row1[propertyName] != undefined && row1[propertyName] != null
                        ? row1[propertyName].toLowerCase()
                        : '';
                value2 =
                    row2[propertyName] != undefined && row2[propertyName] != null
                        ? row2[propertyName].toLowerCase()
                        : '';
            }
            if (!value1 && !value2) {
                return 0;
            }
            console.log(value1, value2)
            if (!value1) {
                return -1 * direction;
            }
            if (!value2) {
                return 1 * direction;
            }

            return (value1 < value2 ? -1 : value1 == value2 ? 0 : 1) * direction;
        };
        console.log(column.sortDirection, "value");
        switch (column.sortDirection) {
            case 'Asc':
                return tableData.sort((row1: DataItem, row2: DataItem) =>
                 compare(row1, row2, column.propertyName, 1));
            case 'Desc':
                return tableData.sort((row1: DataItem, row2: DataItem) => 
                  compare(row1, row2, column.propertyName, -1));
            default:
                return tableData;
        }
    };
}

describe('ASC tests', () =>{
    it(' return 0 ', () =>{
        const tableData = [null, null];
        const v = Sorter.sort(tableData, {sortDirection: 'Asc', propertyName: 'abc'});
        expect(v).to.eql(tableData);
    });
    it(' return 1', () =>{
        const tableData = [{some:2}, null];
        const v = Sorter.sort(tableData, {sortDirection: 'Asc', propertyName: 'abc'});
        expect(v).to.eql([null, {some:2}]);
    });
    it(' return -1', () =>{
        const tableData = [null, {some:2}];
        const v = Sorter.sort(tableData, {sortDirection: 'Asc', propertyName: 'abc'});
        expect(v).to.eql(tableData);
    });
    const commonDescription = "value of key given as propertName is";
    const testData = [{
        column: {sortDataType: 'date', propertyName:'date', sortDirection: 'Asc'},
        failValues : [{value:null, msg: 'null'}],
        message: ' sortDataType is date ',
        passValue: new Date()
    }, {
        column : { propertyName:'someKey', sortDirection: 'Asc'},
        failValues : [{value:null, msg: 'null'}, {value:undefined, msg: 'undefined'}],
        message: ' sortDataType is not date ',
        passValue: "abc"
    }]
    testData.forEach(testInfo => {
        describe(testInfo.message, () => {
            testInfo.failValues.forEach(fail =>{
                describe(`${commonDescription} ${fail.msg}`, () =>{
                    const testCases = [
                        {
                            message : `in both rows`,
                            tableData: [{someKey: fail.value}, {someKey: fail.value}],
                            expect: 'same'
                        },
                        {
                            message : " in row2",
                            tableData: [{someKey:fail.value}, {someKey: testInfo.passValue}],
                            expect: 'same'
                        },
                        {
                            message : " in row1",
                            tableData: [{someKey:fail.value}, {someKey:testInfo.passValue}],
                            expect: 'reverse'
                        },
        
                    ];
                    testCases.forEach(test =>{
                        it(test.message, () =>{
                            const result = test.expect === 'reverse'? test.tableData.reverse() : test.tableData;
                            expect(Sorter.sort(test.tableData, testInfo.column)).to.eql(result)
                        })
                    })
                })
            })
        })
    })
})