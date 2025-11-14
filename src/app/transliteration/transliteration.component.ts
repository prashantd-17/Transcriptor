import { Component, OnInit } from '@angular/core';
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
export class TransliterationComponent implements OnInit {
  languages = LANGUAGES;
  language = '';
  inputText = '';
  outputText = '';
  suggestions: string[] = [];
  mode: 'transliteration' | 'translation' = 'transliteration';

  text = '';
  translatedText = '';
  sourceLang = 'en';
  targetLang = 'hi';
  loading = false;

  isTranscriptionVisible = false;

  private inputSubject = new Subject<string>();

  recognition: any;
isListening = false;


localeMap: any = {
  af: "af-ZA",
  sq: "sq-AL",
  am: "am-ET",
  ar: "ar-SA",
  hy: "hy-AM",
  az: "az-AZ",
  bn: "bn-BD",
  eu: "eu-ES",
  be: "be-BY",
  bs: "bs-BA",
  bg: "bg-BG",
  ca: "ca-ES",
  zh: "zh-CN",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  hr: "hr-HR",
  cs: "cs-CZ",
  da: "da-DK",
  nl: "nl-NL",
  en: "en-US",
  en_US: "en-US",
  en_GB: "en-GB",
  eo: "eo", // partial support
  et: "et-EE",
  fil: "fil-PH",
  fi: "fi-FI",
  fr: "fr-FR",
  gl: "gl-ES",
  ka: "ka-GE",
  de: "de-DE",
  el: "el-GR",
  gu: "gu-IN",
  ht: "ht-HT",
  ha: "ha-NG",
  he: "he-IL",
  hi: "hi-IN",
  hu: "hu-HU",
  is: "is-IS",
  id: "id-ID",
  ga: "ga-IE",
  it: "it-IT",
  ja: "ja-JP",
  jv: "jv-ID",
  kn: "kn-IN",
  kk: "kk-KZ",
  km: "km-KH",
  ko: "ko-KR",
  ku: "ku-TR",
  lo: "lo-LA",
  lv: "lv-LV",
  lt: "lt-LT",
  mk: "mk-MK",
  ms: "ms-MY",
  ml: "ml-IN",
  mt: "mt-MT",
  mr: "mr-IN",
  mn: "mn-MN",
  ne: "ne-NP",
  no: "no-NO",
  or: "or-IN",
  fa: "fa-IR",
  pl: "pl-PL",
  pt: "pt-PT",
  pa: "pa-IN",
  ro: "ro-RO",
  ru: "ru-RU",
  sm: "sm", // partial
  sa: "sa-IN",
  sr: "sr-RS",
  sd: "sd-PK",
  si: "si-LK",
  sk: "sk-SK",
  sl: "sl-SI",
  so: "so-SO",
  es: "es-ES",
  sw: "sw-KE",
  sv: "sv-SE",
  ta: "ta-IN",
  te: "te-IN",
  th: "th-TH",
  tr: "tr-TR",
  uk: "uk-UA",
  ur: "ur-PK",
  uz: "uz-UZ",
  vi: "vi-VN",
  cy: "cy-GB",
  xh: "xh-ZA",
  yi: "yi", // partial
  zu: "zu-ZA",
};

isMobile:boolean = false;
menuOpen = false;

  constructor(private translitService: TransliterationService) {
    this.inputSubject.pipe(debounceTime(400)).subscribe(text => this.processInput(text));
  }

  ngOnInit(): void {
    this.isMobile = this.isMobileView();
    console.log(this.isMobile)
     const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser. Please use Chrome.");
    return;
  }

  this.recognition = new SpeechRecognition();
  this.recognition.continuous = true;       // keep recording
  this.recognition.interimResults = true;   // show partial text while speaking
  this.recognition.lang = 'en-US';          // default
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



  translate() {
    if (!this.text.trim()) return;

    this.loading = true;
    this.translitService.translateText(this.text, this.sourceLang, this.targetLang)
      .subscribe({
        next: (res: any) => {
          this.translatedText = res.translatedText;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.translatedText = 'Translation failed. Try again later.';
          this.loading = false;
        }
      });
  }

  speakTranslatedText() {
    if (!this.translatedText) return;

    const utterance = new SpeechSynthesisUtterance(this.translatedText);
    utterance.lang = this.targetLang; // match voice with target language
    utterance.rate = 1; // speaking speed (1 = normal)
    speechSynthesis.speak(utterance);
  }

startSpeechToText() {
  if (!this.recognition) return;

  this.recognition.lang = this.localeMap[this.language] || "en-US";

  if (!this.isListening) {
    this.inputText = this.inputText || ""; // ensure initialized
    this.recognition.start();
    this.isListening = true;
  } else {
    this.recognition.stop();
    this.isListening = false;
  }

  this.recognition.onresult = (event: any) => {
    let transcript = "";
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + " ";
    }
    this.text = transcript.trim(); // show in input
    console.log(this.inputText)
  };

  this.recognition.onerror = () => (this.isListening = false);
  this.recognition.onend = () => (this.isListening = false);
}

 getWindow(): Window | null {
    if (typeof window !== 'undefined') {
      return window;
    }
    return null;
  }

  isMobileView(): boolean {
    const width = this.getWindow()?.innerWidth ?? 1024;
    return width < 576;
  }
}
