import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FooterComponent } from './footer.component';
import { AuthenticationService } from '../../service/security/authentication.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let mockRouter: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockAuthService = {
      getIsLoggedIn: jasmine.createSpy('getIsLoggedIn').and.returnValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthenticationService, useValue: mockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to lab when goToLab is called', () => {
    component.goToLab();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lab']);
  });

  it('should navigate to discoveries when goToDiscoveries is called', () => {
    component.goToDiscoveries();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/discoveries']);
  });

  it('should navigate to global discoveries when goToGlobalDiscoveries is called', () => {
    component.goToGlobalDiscoveries();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/globaldiscoveries']);
  });

  it('should navigate to quiz when goToQuiz is called', () => {
    component.goToQuiz();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/quiz']);
  });

  it('should navigate to flashcard when goToFlashcard is called', () => {
    component.goToFlashcard();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/flashcard']);
  });

  it('should navigate to about when goToAbout is called', () => {
    component.goToAbout();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/about']);
  });
});