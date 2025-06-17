import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeletedQuestionComponent } from './admin-deleted-question.component';

describe('AdminDeletedQuestionComponent', () => {
  let component: AdminDeletedQuestionComponent;
  let fixture: ComponentFixture<AdminDeletedQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeletedQuestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeletedQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
