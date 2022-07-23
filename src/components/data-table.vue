<template>
    <div data-cy="cy-po-data__table">
        <div class="-w--100">
            <div class="chi-grid -bg--grey-25 -mx--0" id="thead">
                <div
                    v-for="column in columns"
                    :data-cy="column.columnHeading"
                    data-ut="dataTable-header-row-col"
                    :key="column.columnHeading"
                    :class="[
                        column.columnType === 'checkbox' || column.columnType === 'radio' ? '' : 'chi-col',
                        'header-row-col',
                        column.columnCss,
                    ]"
                    @click="sortColumnClick(column, $event)"
                >
                    <div class="-d--flex -align-items--center -h--100 -text--md -text--bold">
                        <div
                            v-if="
                                column.columnType === COLUMN_TYPE.LABEL &&
                                    defaultTableConfig.enableSorting &&
                                    column.isSortable
                            "
                            class="-d--flex"
                        >
                            <div class="header-title">{{ column.columnHeading }}</div>
                            <div>
                                <i
                                    v-if="column.propertyName == sortColumnName"
                                    data-cy="cy-sort-column__icon"
                                    :class="'sort-icon -mr--1 -align-self--center -ml--2 data-row-h ' + [sortColumnCss]"
                                ></i>
                            </div>
                        </div>
                        <div
                            v-if="
                                column.columnType === COLUMN_TYPE.LINK &&
                                    defaultTableConfig.enableSorting &&
                                    column.isSortable
                            "
                            class="-d--flex"
                        >
                            <div class="header-title">{{ column.columnHeading }}</div>
                            <div>
                                <i
                                    v-if="column.propertyName == sortColumnName"
                                    data-cy="cy-sort-column__icon"
                                    :class="'sort-icon -mr--1 -align-self--center -ml--2 data-row-h ' + [sortColumnCss]"
                                ></i>
                            </div>
                        </div>

                        <div
                            v-if="
                                column.columnType === COLUMN_TYPE.LABEL &&
                                    (!defaultTableConfig.enableSorting || !column.isSortable)
                            "
                        >
                            {{ column.columnHeading }}
                        </div>
                        <div
                            v-if="
                                column.columnType === COLUMN_TYPE.Link &&
                                    (!defaultTableConfig.enableSorting || !column.isSortable)
                            "
                        >
                            {{ column.columnHeading }}
                        </div>

                        <div v-if="column.columnType === COLUMN_TYPE.ICONS" class="-d--flex">
                            {{ column.columnHeading }}
                        </div>
                        <div v-if="column.columnType === COLUMN_TYPE.CHECKBOX" id="checkboxHolder">
                            <div
                                v-if="column.showCheckBoxInHeader && column.columnType === COLUMN_TYPE.CHECKBOX"
                                :id="checkbox_header_if"
                                :style="column.columnHeaderStyle"
                            >
                                <input
                                    type="checkbox"
                                    data-ut="dataTable-checkbox-input"
                                    :id="column.headerId"
                                    :style="column.elementStyle"
                                    :checked="headerCheckboxSelected"
                                    v-model="headerCheckboxSelected"
                                    @change="checkAllEvent($event, column)"
                                />
                            </div>
                            <div v-else id="checkbox_header_else" :style="column.columnHeaderStyle"></div>
                        </div>
                        <div
                            v-if="
                                column.columnType === COLUMN_TYPE.SELECT || column.columnType === COLUMN_TYPE.DROPDOWN
                            "
                        >
                            {{ column.columnHeading }}
                        </div>
                        <div
                            v-if="column.columnType === COLUMN_TYPE.TOGGLEBUTTON"
                            class="header-row-fw"
                            :style="column.columnHeaderStyle"
                        >
                            {{ column.columnHeading }}
                        </div>
                        <div v-if="column.columnType === COLUMN_TYPE.CHECKBOXES_DROPDOWN">
                            {{ column.columnHeading }}
                        </div>
                        <div v-if="column.columnType === COLUMN_TYPE.RADIO" :style="column.columnHeaderStyle">
                            {{ column.columnHeading }}
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="data.length">
                <div
                    v-for="(tableRow, index) in tableRowData"
                    :data-cy="'cy-table__row-' + index"
                    data-cy2="cy-all-table__rows"
                    :key="index"
                    :id="index"
                    :class="[
                        'data-row-bg',
                        '-text--md',
                        { 'table-row-1': index % 2 === 1, '-bg--white': index % 2 === 0 },
                        defaultTableConfig.enableRowClick ? 'data-row-h' : '',
                        tableRow.showChild && tableRow.child.length > 0 ? 'subrow-border' : '',
                        tableRow.expandedDetailsSection ? 'dynamic-content-bgColor subrow-border' : '',
                    ]"
                >
                    <div :id="index" class="chi-grid -mx--0 table-row-content" data-ut="dataTable-row-content">
                        <div
                            v-for="col in columns"
                            :key="col.columnHeading"
                            :class="[
                                col.columnType === COLUMN_TYPE.CHECKBOX || col.columnType === COLUMN_TYPE.RADIO
                                    ? ''
                                    : 'chi-col',
                                col.columnCss,
                            ]"
                        >
                            <div
                                v-if="col.columnType === COLUMN_TYPE.CHECKBOX"
                                :class="[col.colContentCss]"
                                :key="selectedRowCount"
                            >
                                <input
                                    v-if="col.enableChkboxForAllRows"
                                    type="checkbox"
                                    data-ut="dataTable-checkbox-input"
                                    :style="col.elementStyle"
                                    v-model="tableRow[col.propertyName]"
                                    :value="index"
                                    @change="rowSelectedEvent(tableRow, index, $event, col.propertyName)"
                                />
                                <input
                                    v-else
                                    type="checkbox"
                                    data-ut="dataTable-checkbox-input"
                                    :style="col.elementStyle"
                                    v-model="tableRow[col.propertyName]"
                                    :value="index"
                                    :disabled="!tableRow[col.enableCheckbox]"
                                    @change="rowSelectedEvent(tableRow, index, $event, col.propertyName)"
                                />
                            </div>

                            <div
                                v-if="col.columnType === COLUMN_TYPE.ICONS"
                                :class="[col.columnCss, col.textAlign ? col.textAlign : '']"
                            >
                                <span v-for="icon in col.icons" :key="icon.name">
                                    <span v-if="tableRow[icon.iconShow]" class="-mr--1">
                                        <i
                                            v-if="tableRow[icon.iconEnable]"
                                            :class="[
                                                'icons-mr',
                                                'chi-icon',
                                                'data-row-h',
                                                tableRow[icon['iconRuntimeCss']] != undefined
                                                    ? tableRow[icon['iconRuntimeCss']]
                                                    : icon.cssClassName,
                                            ]"
                                            :title="tableRow[icon.iconShow] ? icon.name : ''"
                                            :style="icon.iconStyle"
                                            @click="iconClick(tableRow, index, icon, $event)"
                                        ></i>
                                        <i
                                            v-if="!tableRow[icon.iconEnable]"
                                            :class="[
                                                'chi-icon',
                                                tableRow[icon['iconRuntimeCss']] != undefined
                                                    ? tableRow[icon['iconRuntimeCss']]
                                                    : icon.cssClassName,
                                                tableRow[icon.iconEnable] ? 'icons-mr-en' : 'icons-mr-disabled',
                                            ]"
                                            :title="tableRow[icon.iconEnable] ? icon.name : ''"
                                        ></i>
                                    </span>
                                </span>
                            </div>

                            <div
                                v-if="col.columnType === COLUMN_TYPE.SELECT || col.columnType === COLUMN_TYPE.DROPDOWN"
                            >
                                <div class="chi-form__item">
                                    <select
                                        class="chi-input -md"
                                        @change="selectOptionValueChange(tableRow, index, $event.target.value)"
                                        v-model="tableRow[col.selectModelKey]"
                                        v-if="tableRow[col.propertyName] && tableRow[col.propertyName].length"
                                    >
                                        <option
                                            v-for="(option, index) in tableRow[col.propertyName]"
                                            :key="index"
                                            :value="option"
                                        >
                                            {{ option }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div v-if="col.columnType === COLUMN_TYPE.TOGGLEBUTTON">
                                <fieldset>
                                    <div
                                        :class="[
                                            'chi-picker-group',
                                            '-fluid',
                                            tableRow[col.enableDisableToggle] != undefined &&
                                            tableRow[col.enableDisableToggle]
                                                ? 'enable-component'
                                                : 'disable-component',
                                        ]"
                                    >
                                        <span v-for="toggleBtn in col.toggleButtonConfig" :key="toggleBtn.id">
                                            <input
                                                v-if="tableRow[toggleBtn.buttonShow]"
                                                class="chi-picker__input"
                                                type="radio"
                                                :name="toggleBtn.id + tableRow[toggleBtn.uniqueId]"
                                                :id="toggleBtn.id + tableRow[toggleBtn.uniqueId]"
                                                @click="toggleButtonEvent(tableRow, toggleBtn.buttonSelected, index)"
                                                :checked="tableRow.toggleButtons[toggleBtn.buttonSelected]"
                                            />
                                            <label
                                                v-if="tableRow[toggleBtn.buttonShow]"
                                                :for="toggleBtn.id + tableRow[toggleBtn.uniqueId]"
                                            >
                                                <span>{{ toggleBtn.name }}</span>
                                            </label>
                                        </span>
                                    </div>
                                </fieldset>
                            </div>

                            <div v-if="col.columnType === COLUMN_TYPE.CHECKBOXES_DROPDOWN">
                                <button
                                    :id="TABLE_CONSTANTS.DROPDOWN_CHECKBOX_BUTTON_ID_PREFIX + index"
                                    class="chi-button chi-dropdown__trigger"
                                    :data-target="'#' + TABLE_CONSTANTS.DROPDOWN_CHECKBOX_TARGET_ID_PREFIX + index"
                                >
                                    {{ col.checkboxesDropDownBtnLabel }}
                                </button>
                                <div
                                    class="chi-dropdown__menu item-position"
                                    :id="TABLE_CONSTANTS.DROPDOWN_CHECKBOX_TARGET_ID_PREFIX + index"
                                >
                                    <div
                                        class="chi-dropdown__menu-item"
                                        v-for="(item, localIndex) in tableRow[col.propertyName]"
                                        :key="localIndex"
                                    >
                                        <div class="chi-checkbox">
                                            <input
                                                class="chi-checkbox__input"
                                                type="checkbox"
                                                v-model="item.isSelected"
                                                @change="checkBoxDropdownItemValueChange(tableRow)"
                                                :id="
                                                    TABLE_CONSTANTS.DROPDOWN_CHECKBOX_INPUT_LABEL_ID_PREFIX +
                                                        index +
                                                        localIndex
                                                "
                                            />

                                            <label
                                                class="chi-checkbox__label"
                                                :for="
                                                    TABLE_CONSTANTS.DROPDOWN_CHECKBOX_INPUT_LABEL_ID_PREFIX +
                                                        index +
                                                        localIndex
                                                "
                                                >{{ item.label }}</label
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- display radio -->
                            <div v-if="col.columnType === COLUMN_TYPE.RADIO" :class="[col.colContentCss]">
                                <div class="chi-form__item">
                                    <div>
                                        <input
                                            type="radio"
                                            name="radio"
                                            :checked="tableRow[col.propertyName]"
                                            :style="col.elementStyle"
                                            @change="radioInputChange(tableRow, index, $event, col.propertyName)"
                                        />
                                    </div>
                                </div>
                            </div>
                            <!-- display data -->
                            <div
                                @click="rowClick(tableRow, index, $event)"
                                v-if="col.columnType === COLUMN_TYPE.LABEL && !col.showDetailsPopup"
                                :class="[col.colContentCss, col.defaultColumn ? 'default-column' : '']"
                                :data-ut="col.defaultColumn ? 'default-column' : ''"
                                :title="defaultTableConfig.rowToolTipMessage"
                            >
                                {{ tableRow[col.propertyName] }}
                            </div>
                            <div
                                @click="subRowLinkClick(tableRow, index, $event)"
                                v-if="col.columnType === COLUMN_TYPE.LINK && !col.showDetailsPopup"
                                :class="[col.colContentCss, col.defaultColumn ? 'default-column' : '']"
                                :data-ut="col.defaultColumn ? 'default-column' : ''"
                                :title="defaultTableConfig.rowToolTipMessage"
                            >
                                {{ tableRow[col.propertyName] }}
                            </div>

                            <div
                                @click="rowClick(tableRow, index, $event)"
                                v-if="col.columnType === COLUMN_TYPE.LABEL && col.showDetailsPopup"
                                :class="[col.colContentCss, col.defaultColumn ? 'default-column' : '']"
                                :data-ut="col.defaultColumn ? 'default-column' : ''"
                                :title="defaultTableConfig.rowToolTipMessage"
                                @mouseover="showDetailsInfoPopup(tableRow[col.propertyName], tableRow)"
                                @mouseleave="hideDetailsInfoPopup()"
                            >
                                {{ tableRow[col.propertyName] }}
                                <span
                                    class="-position--relative"
                                    v-if="showDetailInfoPopup && activeCellValue == tableRow[col.propertyName]"
                                >
                                    <!-- <DynamicPopover
                                        @dynamic_popover_event="displayDynamicInfoPopup"
                                        :popoverHeaderTitle="popoverTitle"
                                    ></DynamicPopover> -->
                                </span>
                            </div>
                        </div>
                    </div>

                    <div v-if="showRowDetailes(tableRow, selectedIcon)" class="-py--1 -my--1 dynamic-content-bgColor">
                        <!-- <dynamic-content @dynamic_content_event="displayDynamicContent"></dynamic-content> -->
                    </div>
                    <div v-if="tableRow.showChild" data-cy="table-row-subdetails-${index}">
                        <!-- <SubRows
                            :columns="columns"
                            :tableRowData="tableRow.child"
                            :expandAll="expandAll"
                            :searchEvent="searchEvent"
                            @subRowClick="subRowClick"
                            @subRowLinkClick="subRowLinkClick"
                        /> -->
                    </div>
                </div>
            </div>
            <div v-if="!data.length">
                <h4 class="-text--h4 -text--center" data-cy="cy-no-records__message">{{ noRecordsErrorMessage }}</h4>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit, Ref } from 'vue-property-decorator';
import Sorter from '@/components/Sorter';
import { findKey, find } from 'lodash';

type DataItem = any;
type IDataColumn = any;
type DefaultTableConfig = any;
enum Sorted  {
    Asc= 'Asc',
    Desc = "Desc"
}
enum TABLE_CONSTANTS{
    DROPDOWN_CHECKBOX_BUTTON_ID_PREFIX = 'prefix',
    ICON_PLUS = "+",
    ICON_MINUS = "-",
    ICON_SORT_DOWN = 'v',
    ICON_SORT_UP = '^',
    DROPDOWN_CHECKBOX_INPUT_LABEL_ID_PREFIX = "asc"
}
@Component({
    components: {
        // DynamicContent: () =>
        //     import(
        //         /* webpackChunkName: "common-dynamic-content" */ '@/components/DataTable/_components/DynamicContent.vue'
        //     ),
        // SubRows: () =>
        //     import(/* webpackChunkName: "common-sub-rows" */ '@/components/DataTable/_components/SubRows.vue'),
        // DynamicPopover: () =>
        //     import(
        //         /* webpackChunkName: "common-dynamic-content" */ '@/components/DataTable/_components/DynamicPopover.vue'
        //     ),
    },
})
export default class DataTable extends Vue {
    @Prop({ required: true }) columns!: IDataColumn[];
    @Prop({ required: true }) data!: DataItem[];
    @Prop({ required: true }) currentPageNo!: number;
    @Prop({ required: true }) defaultTableConfig!: DefaultTableConfig;
    @Prop({ required: false }) pageLength!: number;
    @Prop({ required: false }) subRowsData!: DataItem[];
    @Prop({ required: false }) pageSectionName!: string;
    @Prop({ required: false }) showInfoPopup!: boolean;
    @Prop({ required: false }) popoverTitle!: string;
    @Prop({ required: false }) expandAll!: boolean;
    @Prop({ required: false }) searchEvent!: any;

    private rows: DataItem[] = [];
    private dataCP: DataItem[] = [];
    private rowsByPage: DataItem[][] = [];
    private noRecordsErrorMessage: string = '';
    private sortColumnName: string = '';
    private sortColumnCss: string = '';
    private headerCheckboxSelected: boolean = false;
    private selectedRowCount: number = 0;
    private rowCheckBoxModel: string = '';
    private selectedRowObject: any = {};
    private iconClicked: any = {};
    private mouseOverRowObject: any = {};
    private get selectedIcon(): any {
        return this.iconClicked;
    }

    private defaultConfig: any = {
        noRecordsErrorMsg: 'No users found.',
        rowToolTipMessage: '',
    };

    private prevSelectedRow!: number;
    private headerCheckboxPageInfo: any = [];

    private currentRowClickedData!: any;
    private currentRowClickedIndex = -1;

    private TABLE_CONSTANTS: any = TABLE_CONSTANTS;
    private COLUMN_TYPE: any = {} ;
    private showDetailInfoPopup: boolean = false;
    private activeCellValue: any = '';

    created() {
        this.noDataItemErrorMessage();
        this.setDefaultSortingOption();
    }
    mounted() {
        this.copyTable();
        this.checkSearchEvent();
        if (this.defaultTableConfig.enableSorting) {
            this.initializeSorting();
        }
        this.initializeCheckBoxDropDownColumn();
    }
    @Watch('searchEvent')
    private checkSearchEvent() {
        console.log(this.searchEvent);
        this.data.map(d => (d.showChild = false));
        if (this.searchEvent != null && this.searchEvent.searchValue != '') {
            console.log('expand all child');
            let icon = {
                name: 'Expand',
                cssClassName: 'icon-plus',
                eventName: 'ICON_SUB_ROWS',
                iconId: '',
                iconShow: 'subRow',
                iconEnable: 'subRow',
            };

            this.data.forEach((d: any, index: number) => {
                d.undefined = 'icon-plus';
                this.iconClick(d, index, icon, null);
            });
        }
    }
    private setDefaultSortingOption() {
        if (!this.defaultTableConfig.hasOwnProperty('enableSorting')) this.defaultTableConfig.enableSorting = true;
    }

    private copyTable() {
        this.dataCP = [...this.data];
        this.rows = this.data.slice(0, this.pageLength);
    }
    private initializeCheckBoxDropDownColumn() {
        if (this.isTableHasCheckBoxColumn().length) {
            for (let i = 0; i < this.rows.length; i++) {
                this.registerCheckBoxDropDownListner('AA' + i);
            }
        }
    }

    private isTableHasCheckBoxColumn() {
        return this.columns.filter(column => column.columnType === 'checkboxes-dropdown');
    }

    private registerCheckBoxDropDownListner(id: string) {
        (window as any).chi.dropdown(document.getElementById(id));
    }

    private checkBoxDropdownItemValueChange(event: any) {
        this.$emit('checkboxes_dropdown_change', event);
    }

    get tableRowData() {
        this.rows = this.data.slice(0, this.pageLength);
        this.updateHeaderCheckbox();
        return this.rows;
    }

    @Watch('data')
    private dataItemLengthChanged() {
        this.noDataItemErrorMessage();
        this.headerCheckboxSelected = false;
    }

    @Watch('currentPageNo')
    private navigatedToDiffPage(newValue: number, oldValue: number) {
        this.headerCheckboxSelected = this.headerCheckboxPageInfo.indexOf(newValue) > -1 ? true : false;
    }

    private columnClicked(column: IDataColumn): void {}

    private noDataItemErrorMessage() {
        this.noRecordsErrorMessage =
            this.defaultTableConfig && this.defaultTableConfig.noRecordsErrorMsg
                ? this.defaultTableConfig.noRecordsErrorMsg
                : this.defaultConfig.noRecordsErrorMsg;
    }

    private iconClick(dataRow: any, index: any, icon: any, event: any) {
        console.log(icon);
        this.currentRowClickedData = dataRow;
        this.currentRowClickedIndex = index;
        this.iconClicked = icon;
        if (icon.eventName != undefined && icon.eventName == 'ICON_SHOW_DETAILS') {
            this.showRowDetails(dataRow, index, icon, event);
        } else if (icon.eventName == 'ICON_SUB_ROWS') {
            this.data.map((d: any, i: number) => {
                if (i == index) {
                    d.showChild = !d.showChild;
                    dataRow.showChild = !dataRow.showChild;
                    console.log(d, dataRow);
                    this.subRowIconsClick(dataRow, index, icon, event);
                }
            });

            //        } else {
            this.$emit('icon_click', { data: dataRow, index: index, icon: icon, event: event });
        }
    }

    @Watch('expandAll')
    onExpandAllChanged(value: string, oldValue: string) {
        // Do stuff with the watcher here.
        console.log(value, oldValue, 'check');
        let icon = {
            name: 'Expand',
            cssClassName: 'icon-minus',
            eventName: 'ICON_SUB_ROWS',
            iconId: '',
            iconShow: 'subRow',
            iconEnable: 'subRow',
        };
        if (value) {
            this.data.forEach((d: any, index: number) => {
                // this.iconClick(d, index, icon, null);
            });
        }
    }
    private showRowDetailes(tableRow: any, selectedIcon: any): boolean {
        return (
            tableRow != undefined &&
            tableRow[selectedIcon.iconModelAttribute] != undefined &&
            tableRow[selectedIcon.iconModelAttribute] &&
            selectedIcon.eventName == 'ICON_SHOW_DETAILS'
        );
    }

    private showSubRowDetailes(tableRow: any, selectedIcon: any, index: number): boolean {
        tableRow.showChild = true;
        return (
            tableRow != undefined &&
            tableRow[selectedIcon.iconShow] != undefined &&
            tableRow[selectedIcon.iconShow] &&
            selectedIcon.eventName == 'ICON_SUB_ROWS' &&
            index == this.currentRowClickedIndex &&
            tableRow.showSubRows
        );
    }

    private showRowDetails(dataRow: any, index: any, icon: any, event: any) {
        if (dataRow.index == undefined) {
            dataRow.index = index;
        }
        if (this.prevSelectedRow != undefined && this.prevSelectedRow != index) {
            for (let row of this.data) {
                if (row[icon.iconModelAttribute]) {
                    row[icon.iconModelAttribute] = false;
                    row.expandedDetailsSection = false;
                    row[icon.iconRuntimeCss] = TABLE_CONSTANTS.ICON_PLUS;
                    break;
                }
            }
        }
        dataRow[icon.iconModelAttribute] = dataRow[icon.iconModelAttribute] ? false : true;
        if (!dataRow[icon.iconModelAttribute]) {
            dataRow[icon.iconRuntimeCss] = TABLE_CONSTANTS.ICON_PLUS;
            dataRow.expandedDetailsSection = false;
        } else {
            dataRow[icon.iconRuntimeCss] = TABLE_CONSTANTS.ICON_MINUS;
            dataRow.expandedDetailsSection = true;
        }
        Vue.set(this.tableRowData, index, dataRow);
        this.prevSelectedRow = index;
        this.selectedRowObject = dataRow;
    }

    private subRowIconsClick(dataRow: any, index: any, icon: any, event: any) {
        if (this.prevSelectedRow != undefined && this.prevSelectedRow != index) {
            for (let row of this.data) {
                if (row[icon.iconRuntimeCss] && row[icon.iconRuntimeCss] == TABLE_CONSTANTS.ICON_MINUS) {
                    row[icon.iconRuntimeCss] = TABLE_CONSTANTS.ICON_PLUS;
                    dataRow.showSubRows = false;
                    dataRow.showchild = false;
                    break;
                }
            }
        }
        if (!dataRow[icon.iconRuntimeCss]) {
            dataRow[icon.iconRuntimeCss] = TABLE_CONSTANTS.ICON_MINUS;
            dataRow.showChild = true;
        } else {
            dataRow[icon.iconRuntimeCss] =
                dataRow[icon.iconRuntimeCss] == TABLE_CONSTANTS.ICON_PLUS
                    ? TABLE_CONSTANTS.ICON_MINUS
                    : TABLE_CONSTANTS.ICON_PLUS;
            dataRow.showChild = dataRow[icon.iconRuntimeCss] == TABLE_CONSTANTS.ICON_MINUS ? true : false;
        }
        console.log(dataRow);
        Vue.set(this.tableRowData, index, dataRow);
        this.prevSelectedRow = index;
        this.selectedRowObject = dataRow;
        this.$emit('icon_click', { data: dataRow, index: index, icon: icon, event: event });
    }

    @Emit('form_element_change')
    private inputElementValueChange(data: any) {}

    private inputValueChange(data: any, index: any, inputElement: any) {
        this.inputElementValueChange({ data: data, index: index, element: inputElement });
    }

    private rowClick(dataItem: any, index: any, event: any) {
        if (event.target.type == 'checkbox') {
            event.stopPropagation();
        } else {
            this.$emit('row_click', { dataItem: dataItem, index: index });
        }
    }

    private column_click(column: IDataColumn) {}

    private checkAllEvent($event: any, column: any) {
        if ($event.target.checked) {
            this.headerCheckboxSelected = true;
        } else {
            this.headerCheckboxSelected = false;
        }
        this.rowCheckBoxModel = column.propertyName;
        if (this.tableRowData != undefined && this.tableRowData.length > 0) {
            for (let dataItem of this.tableRowData) {
                if (dataItem[column.enableCheckbox] || column.enableChkboxForAllRows) {
                    dataItem[column.propertyName] = $event.target.checked;
                }
            }
            this.selectedRowCount = this.headerCheckboxSelected ? this.tableRowData.length : 0;
        }
        this.persistHeaderCheckboxInfo(this.currentPageNo, $event.target.checked);
        this.$emit('all_rows_checked_event', {
            allRowsSelected: this.headerCheckboxSelected,
            currentPageNo: this.currentPageNo,
            rowsSelected: this.tableRowData,
        });
    }

    private rowSelectedEvent(dataRow: any, index: number, $event: any, rowCheckBoxModelName: string) {
        this.rowCheckBoxModel = rowCheckBoxModelName;
        dataRow[rowCheckBoxModelName] = $event.target.checked;
        if (this.headerCheckboxSelected && !$event.target.checked) {
            this.headerCheckboxSelected = false;
        }
        if ($event.target.checked) {
            this.selectedRowCount++;
        } else {
            if (this.selectedRowCount > 0) this.selectedRowCount--;
        }

        if (this.selectedRowCount == this.tableRowData.length) {
            this.headerCheckboxSelected = true;
            this.persistHeaderCheckboxInfo(this.currentPageNo, true);
        } else {
            this.headerCheckboxSelected = false;
            this.persistHeaderCheckboxInfo(this.currentPageNo, false);
        }
        this.$emit('row_checked_event', { dataRow: dataRow });
        $event.stopPropagation();
    }

    private displayDynamicContent($event: any) {
        this.$emit('show_detail_content', {
            dynamicRefTarget: $event.target,
            selectedRow: this.selectedRowObject,
        });
    }

    private initializeSorting() {
        this.sortColumnName = this.defaultTableConfig.defaultSortColumn;
        this.sortColumnCss = TABLE_CONSTANTS.ICON_SORT_UP;
    }

    private sortColumnClick(sortColumn: any, event: any) {
        let details: any = {};
        if (!sortColumn.isSortable) {
            return;
        }
        details.propertyName = sortColumn.propertyName;
        details.sortDataType = sortColumn.sortDataType;
        if (sortColumn.sortDirection) {
            sortColumn.sortDirection = sortColumn.sortDirection === Sorted.Asc ? Sorted.Desc : Sorted.Asc;
            details.sortDirection = sortColumn.sortDirection;
        } else {
            sortColumn.sortDirection = Sorted.Asc;
            details.sortDirection = Sorted.Asc;
        }
        this.sortTableData(details);
        event.stopPropagation();
    }

    private sortTableData(details: any) {
        let sortEvent: any;
        this.sortColumnName = details.propertyName;
        this.sortColumnCss =
            details.sortDirection == Sorted.Asc ? TABLE_CONSTANTS.ICON_SORT_UP : TABLE_CONSTANTS.ICON_SORT_DOWN;

        if (!this.defaultTableConfig.serviceCallOnSort) {
            this.dataCP = Sorter.sort(this.dataCP, details);
            console.log(this.dataCP);
            this.$emit('sortEvent', { sortDetails: details, sortedData: this.dataCP });
        } else {
            this.$emit('sortEvent', { sortDetails: details, sortedData: [] });
        }

        if (this.selectedRowCount > 0 || this.headerCheckboxPageInfo.length > 0) {
            this.headerCheckboxPageInfo = [];
            this.headerCheckboxSelected = false;
            this.clearCheckboxSelections(this.dataCP);
        }
        this.prevSelectedRow = -1;
    }

    private persistHeaderCheckboxInfo(currentPage: number, headerCheckboxChecked: boolean) {
        var indexOfPageNo = this.headerCheckboxPageInfo.indexOf(currentPage);
        if (headerCheckboxChecked && indexOfPageNo < 0) {
            this.headerCheckboxPageInfo.push(currentPage);
        } else {
            if (indexOfPageNo > -1) {
                this.headerCheckboxPageInfo.splice(indexOfPageNo, 1);
            }
        }
    }

    private clearCheckboxSelections(sortedData: any) {
        for (let row of sortedData) {
            row[this.rowCheckBoxModel] = false;
        }
        return sortedData;
    }

    @Emit('select_option_value_change')
    private selectOptionValueChange(tableRow: any, index: number, selectOptionValue: string) {
        let selectEventDta = { tableRowData: tableRow, rowIndex: index, selectedOptionValue: selectOptionValue };
        return selectEventDta;
    }

    @Emit('subRowClick')
    private subRowClick(event: any) {
        let primaryandSubRowData = {
            primaryRowData: this.currentRowClickedData,
            primaryRowIndex: this.currentRowClickedIndex,
            subRowData: event.subRowData,
            subrowIndex: event.index,
        };
        return primaryandSubRowData;
    }
    @Emit('subRowLinkClick')
    private subRowLinkClick(event: any) {
        let primaryandSubRowData = {
            primaryRowData: this.currentRowClickedData,
            primaryRowIndex: this.currentRowClickedIndex,
            subRowData: event.subRowData,
            subrowIndex: event.index,
        };
        return primaryandSubRowData;
    }

    private toggleButtonEvent(tableRow: any, buttonSelected: string, index: number) {
        if (Object.keys(tableRow.toggleButtons).length > 1) {
            for (let toggleBtnSelected of Object.keys(tableRow.toggleButtons)) {
                if (toggleBtnSelected != buttonSelected) {
                    tableRow.toggleButtons[toggleBtnSelected] = false;
                } else {
                    tableRow.toggleButtons[toggleBtnSelected] = !tableRow.toggleButtons[toggleBtnSelected];
                }
            }
        } else {
            tableRow.toggleButtons[buttonSelected] = !tableRow.toggleButtons[buttonSelected];
        }
        Vue.set(this.tableRowData, index, tableRow);
        this.updateHeaderChkBoxWhenToggleBtnUpdated(tableRow.toggleButtons);
        this.$emit('toggle_button_checked', { updatedRow: tableRow });
    }

    private updateHeaderCheckbox() {
        let resultColumn: any = find(this.columns, function(column) {
            if (column.showCheckBoxInHeader) {
                return true;
            }
        });
        if (resultColumn != undefined && resultColumn != '') {
            let rowsChecked = 0;
            for (let i = 0; i < this.rows.length; i++) {
                let tableRow = this.data[i];
                if (tableRow[resultColumn.propertyName]) {
                    rowsChecked++;
                }
            }
            this.headerCheckboxSelected = rowsChecked > 0 && rowsChecked == this.rows.length;
        }
    }

    private updateHeaderChkBoxWhenToggleBtnUpdated(toggleButtonsObject: any) {
        this.headerCheckboxSelected = !!findKey(toggleButtonsObject);
    }
    private radioInputChange(tableRow: any, index: any, event: any, propertyName: string) {
        tableRow[propertyName] = true;
        this.$emit('radio_change', { dataItem: tableRow, index: index, event: event });
    }

    private showDetailsInfoPopup(activeCell: any, mouseOverRowObject: any) {
        this.activeCellValue = activeCell;
        this.mouseOverRowObject = mouseOverRowObject;
        this.showDetailInfoPopup = this.showInfoPopup;
    }

    private hideDetailsInfoPopup($event: any) {
        this.showDetailInfoPopup = false;
    }

    private displayDynamicInfoPopup($event: any) {
        this.$emit('show_detail_popup_content', {
            dynamicRefTarget: $event.target,
            selectedRow: this.mouseOverRowObject,
        });
    }
}
</script>

