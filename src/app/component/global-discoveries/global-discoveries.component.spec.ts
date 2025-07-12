import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalDiscoveriesComponent } from './global-discoveries.component';

describe('GlobalDiscoveriesComponent', () => {
  let component: GlobalDiscoveriesComponent;
  let fixture: ComponentFixture<GlobalDiscoveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalDiscoveriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalDiscoveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
