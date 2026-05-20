import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-notice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner-notice.html',
  styleUrl: './banner-notice.css',
})
export class BannerNotice {
  @Input() config: any = null;
}
