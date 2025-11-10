import { Component } from '@angular/core';
import { TransliterationService } from '../transliteration.service';
import { debounceTime, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LANGUAGES } from '../language';

@Component({
  selector: 'app-transliteration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transliteration.component.html',
  styleUrl: './transliteration.component.scss'
})
export class TransliterationComponent {
  languages = LANGUAGES;
  language = '';
  inputText = '';
  outputText = '';
  suggestions: string[] = [];
  mode: 'transliteration' | 'translation' = 'transliteration';

  private inputSubject = new Subject<string>();

  constructor(private translitService: TransliterationService) {
    this.inputSubject.pipe(debounceTime(400)).subscribe(text => this.processInput(text));
  }

  onInputChange() {
    this.inputSubject.next(this.inputText);
  }

  processInput(text: string) {
    if (!text.trim()) {
      this.outputText = '';
      this.suggestions = [];
      return;
    }

    if (this.mode === 'transliteration') {
      this.translitService.transliterate(text, this.language).subscribe(res => {
        this.suggestions = res;
        this.outputText = res[0] || '';
      });
    } else if (this.mode === 'translation') {
      this.translitService.translate(text, 'en', this.language).subscribe(res => {
        this.outputText = res;
        this.suggestions = [];
      });
    }
  }

  useSuggestion(s: string) {
    this.outputText = s;
    this.suggestions = [];
  }
}
