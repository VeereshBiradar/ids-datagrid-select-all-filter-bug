/// <reference types="ids-enterprise-typings" />

import { Component, ViewChild, ViewContainerRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SohoDataGridComponent, SohoComponentsModule, SohoModalDialogService } from 'ids-enterprise-ng';
import { CommonModule } from '@angular/common';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { JOB_MOCK_DATA } from './mock-data';

@Component({
    selector: 'app-datagrid-demo',
    standalone: true,
    imports: [SohoComponentsModule, CommonModule],
    templateUrl: './datagrid-demo.component.html',
    styleUrls: ['./datagrid-demo.component.css']
})
export class DatagridDemoComponent implements AfterViewInit {
    @ViewChild(SohoDataGridComponent, { static: false }) dataGrid!: SohoDataGridComponent;

    isBusy = false;
    selectionCount = 0;
    visibleCount = 0;
    totalCount = 0;
    filterExpression: any[] = [];
    datagridOptions!: SohoDataGridOptions;
    placeholder?: ViewContainerRef;

    private mockData: any[] = JOB_MOCK_DATA;

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly modalService: SohoModalDialogService
    ) { }

    ngAfterViewInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.isBusy = true;
        setTimeout(() => {
            this.totalCount = this.mockData.length;
            this.visibleCount = this.mockData.length;
            this.getGridOptions();
            this.isBusy = false;
            this.cdr.detectChanges();
        }, 300);
    }

    private getGridOptions(): void {
        this.datagridOptions = {
            columns: this.getColumns(),
            selectable: 'mixed',
            clickToSelect: false,
            paging: true,
            pagesize: 10,
            rowHeight: 'medium',
            isList: true,
            dataset: JSON.parse(JSON.stringify(this.mockData)),
            toolbar: { collapsibleFilter: true, results: true, keywordFilter: true, actions: true, rowHeight: true }
        };
    }

    onFilterClick(): void {
        const dialogRef = this.modalService
            .modal<FilterPanelComponent>(FilterPanelComponent, this.placeholder, {
                maxWidth: 650,
            })
            .title('Filter')
            .buttons([
                {
                    text: 'Cancel',
                    click: () => {
                        dialogRef.close();
                    },
                },
                {
                    text: 'Apply',
                    click: () => {
                        const filterForm = dialogRef.componentDialog!.filterValueWithType;
                        this.filterExpression = Object.keys(filterForm)
                            .filter((key) => filterForm[key].value !== '')
                            .map((key) => {
                                return {
                                    columnId: key,
                                    filterOperator: filterForm[key].operator,
                                    operator: filterForm[key].operator,
                                    value: filterForm[key].value,
                                };
                            });
                        this.dataGrid.applyFilter(this.filterExpression);
                        this.updateVisibleCount();
                        dialogRef.close();
                    },
                    isDefault: true,
                },
            ])
            .open()
            .apply((child) => {
                child.gridColumns = this.dataGrid.gridOptions.columns || [];
            });
    }

    onClearAllFilters(): void {
        if (this.dataGrid) {
            this.filterExpression = [];
            this.dataGrid.applyFilter(this.filterExpression);
            this.visibleCount = this.totalCount;
            this.cdr.detectChanges();
        }
    }

    refresh(): void {
        this.isBusy = true;
        this.onClearAllFilters();
        if (this.dataGrid) {
            this.dataGrid.unSelectAllRows();
        }
        this.selectionCount = 0;

        setTimeout(() => {
            this.visibleCount = this.totalCount;
            if (this.dataGrid) {
                this.dataGrid.updateDataset(JSON.parse(JSON.stringify(this.mockData)));
            }
            this.isBusy = false;
            this.cdr.detectChanges();
        }, 300);
    }

    onClearSelection(): void {
        if (this.dataGrid) {
            this.dataGrid.unSelectAllRows();
        }
        this.selectionCount = 0;
        this.cdr.detectChanges();
    }

    onSelect(event: any): void {
        this.selectionCount = event?.length || 0;
        this.cdr.detectChanges();
    }

    private updateVisibleCount(): void {
        // Count visible rows after filter
        if (this.filterExpression.length === 0) {
            this.visibleCount = this.totalCount;
        } else {
            let filtered = [...this.mockData];
            for (const f of this.filterExpression) {
                filtered = filtered.filter(row => {
                    const val = (row[f.columnId] || '').toString().toLowerCase();
                    const search = f.value.toLowerCase();
                    if (f.operator === 'equals') return val === search;
                    if (f.operator === 'does-not-equal') return val !== search;
                    return val.includes(search); // contains
                });
            }
            this.visibleCount = filtered.length;
        }
        this.cdr.detectChanges();
    }

    protected getColumns(): SohoDataGridColumn[] {
        return [
            {
                id: 'selectionCheckbox',
                resizable: false,
                sortable: false,
                formatter: Soho.Formatters.SelectionCheckbox,
                align: 'center'
            },
            {
                id: 'job_name',
                field: 'job_name',
                name: 'Job Name',
                sortable: true,
                resizable: false,
                textOverflow: 'ellipsis',
                minWidth: 120,
                maxWidth: 200,
                formatter: Soho.Formatters.Text,
                searchable: true,
                filterType: 'text',
                filterConditions: ['contains', 'equals', 'does-not-equal']
            },
            {
                id: 'process_name',
                field: 'process_name',
                name: 'Process',
                sortable: true,
                resizable: false,
                textOverflow: 'ellipsis',
                minWidth: 120,
                maxWidth: 200,
                formatter: Soho.Formatters.Text,
                searchable: true,
                filterType: 'text',
                filterConditions: ['contains', 'equals', 'does-not-equal']
            },
            {
                id: 'category',
                field: 'category',
                name: 'Category',
                sortable: true,
                resizable: false,
                width: 120,
                formatter: Soho.Formatters.Text,
                searchable: true,
                filterType: 'text',
                filterConditions: ['contains', 'equals', 'does-not-equal']
            },
            {
                id: 'created_by',
                field: 'created_by',
                name: 'Created By',
                sortable: true,
                resizable: false,
                textOverflow: 'ellipsis',
                minWidth: 100,
                maxWidth: 150,
                formatter: Soho.Formatters.Text,
                searchable: true,
                filterType: 'text',
                filterConditions: ['contains', 'equals', 'does-not-equal']
            }
        ];
    }
}
