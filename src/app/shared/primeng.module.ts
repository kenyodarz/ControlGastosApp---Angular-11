import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Prime NG */
import { PanelModule } from 'primeng/panel';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { PasswordModule } from 'primeng/password';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputTextareaModule } from 'primeng/inputtextarea';

const myModule = [
  MessagesModule,
  ToolbarModule,
  MessageModule,
  PanelModule,
  MenubarModule,
  DialogModule,
  InputTextModule,
  ButtonModule,
  CalendarModule,
  ToastModule,
  TableModule,
  PasswordModule,
  ConfirmDialogModule,
  PaginatorModule,
  MultiSelectModule,
  SidebarModule,
  DropdownModule,
  MenuModule,
  TooltipModule,
  CardModule,
  KeyFilterModule,
  InputTextareaModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, myModule],
  exports: [myModule],
})
export class PrimengModule {}
