import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarModalComponent } from './progress-bar-modal.component';

describe('ProgressBarModalComponent', () => {
  let component: ProgressBarModalComponent;
  let fixture: ComponentFixture<ProgressBarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressBarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
