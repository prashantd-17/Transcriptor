import { Routes } from '@angular/router';
import { TransliterationComponent } from './transliteration/transliteration.component';

export const routes: Routes = [  
    { path: '', redirectTo: 'transliteration', pathMatch: 'full' },
  { path: 'transliteration', component: TransliterationComponent },
];
