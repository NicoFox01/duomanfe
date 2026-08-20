import { Component } from '@angular/core';

import { Navbar } from '../../shared/components/navbar/navbar';
import { Footer } from '../../shared/components/footer/footer';
import { Hero } from './sections/hero';
import { About } from './sections/about';
import { Services } from './sections/services';
import { QuoteForm } from './sections/quote-form';
import { CareersForm } from './sections/careers-form';

@Component({
  selector: 'app-landing',
  imports: [Navbar, Footer, Hero, About, Services, QuoteForm, CareersForm],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}