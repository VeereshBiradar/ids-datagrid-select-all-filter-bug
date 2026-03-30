/// <reference types="ids-enterprise-typings" />

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SohoComponentsModule } from 'ids-enterprise-ng';

export interface FilterValue {
    columnId: string;
    operator: string;
    value: string;
}

@Component({
    selector: 'app-filter-panel',
    standalone: true,
    imports: [CommonModule, FormsModule, SohoComponentsModule],
    templateUrl: './filter-panel.component.html',
    styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent {
    @Input() gridColumns: SohoDataGridColumn[] = [];

    filterValues: { [key: string]: { operator: string; value: string } } = {};

    // Expose for the modal caller
    get filterValueWithType(): { [key: string]: { operator: string; value: string } } {
        return this.filterValues;
    }

    // Filterable columns (only those with filterType)
    get filterableColumns(): SohoDataGridColumn[] {
        return this.gridColumns.filter(c => c.filterType);
    }

    ngOnInit(): void {
        // Initialize filter values for each filterable column
        for (const col of this.filterableColumns) {
            this.filterValues[col.id!] = { operator: 'contains', value: '' };
        }
    }
}
