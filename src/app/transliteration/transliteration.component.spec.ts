import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransliterationComponent } from './transliteration.component';

describe('TransliterationComponent', () => {
  let component: TransliterationComponent;
  let fixture: ComponentFixture<TransliterationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransliterationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransliterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
