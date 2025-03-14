import { Component, EventEmitter, HostBinding, OnInit, Output, ViewChild } from '@angular/core';
import { SohoComponentsModule, SohoModuleNavComponent } from 'ids-enterprise-ng';
import { PersonalizeMenuComponent } from '../personalize-menu/personalize-menu.component';

@Component({
  selector: 'app-header',
  imports: [PersonalizeMenuComponent, SohoComponentsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @HostBinding('class.header') get isHeader() { return true; }
  @HostBinding('class.is-personalizable') get isPersonalizable() { return true; }

  constructor() { }

  ngOnInit() {
  }

  @Output() hamburgerClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  toggleModuleNav(e: MouseEvent) {
    this.hamburgerClick.next(e);
  }
}
