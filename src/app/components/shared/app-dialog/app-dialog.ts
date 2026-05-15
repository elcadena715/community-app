import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-dialog.html',
  styleUrls: ['./app-dialog.css']
})
export class AppDialogComponent {
  @Input() config: any = null;
  @Input() isOpen: boolean = false;

  @Output() onClose = new EventEmitter<void>(); 
  @Output() onConfirm = new EventEmitter<void>();

  handleSecondaryAction() {
    this.onClose.emit();
  }

  handlePrimaryAction() {
    if (this.config?.showCancel) {
      this.onConfirm.emit();
    } else {
      this.onClose.emit();
    }
  }
}
