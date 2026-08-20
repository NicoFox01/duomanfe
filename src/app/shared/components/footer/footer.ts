import { Component } from '@angular/core';

import { CONTACT } from '../../data/contact';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly contact = CONTACT;
  protected readonly currentYear = new Date().getFullYear();
}
