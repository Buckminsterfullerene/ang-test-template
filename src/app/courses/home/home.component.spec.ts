import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';

describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesServices: any;
  const beginnerCourses = setupCourses().filter(course => course.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category === 'ADVANCED');

  // Do this before each test.  Use Angular's async() method test zone.
  beforeEach(async(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: CoursesService,
          useValue: coursesServiceSpy
        }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      coursesServices = TestBed.get(CoursesService);
    });
  }));

  /**
   * Synchronous test
   */
  it('should create the component', () => {

    expect(component).toBeTruthy();

  });

  /**
   * Synchronous test
   */
  it('should display only beginner courses', () => {
    // Get the test data  of() is an Observable from RxJs
    coursesServices.findAllCourses.and.returnValue(of(beginnerCourses));

    // Now apply the test data
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });

  /**
   * Synchronous test
   */
  it('should display only advanced courses', () => {
    // Get the test data  of() is an Observable from RxJs
    coursesServices.findAllCourses.and.returnValue(of(advancedCourses));

    // Now apply the test data
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });

  /**
   * Synchronous test
   */
  it('should display both tabs', () => {
    // Get the test data  of() is an Observable from RxJs
    coursesServices.findAllCourses.and.returnValue(of(setupCourses()));

    // Now apply the test data
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(2, 'Expected to find 2 tabs');
  });

  /**
   * Asynchronous test using Jasmine DoneFn()
   * Here, we use the 'done: DoneFn' function from Jasmine to let the test know it is an asynchronous test
   * and to wait for the call back to end.
   */
  it('should display advanced courses when tab clicked - using DoneFn()', (done: DoneFn) => {
    // Get the test data.  of() is an Observable from RxJs
    coursesServices.findAllCourses.and.returnValue(of(setupCourses()));

    // Now apply the test data
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    // Now simulate the click event of clicking on the 'Advanced' tab
    click(tabs[1]);
    // Now call the change detection to give time for Angular to update the DOM
    fixture.detectChanges();

    // Now at this point the test will still fail due to the animation that happens when you click from tab to tab.
    // This app is using animation (https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
    // If you have animation, then you need to do the next step.
    setTimeout(() => {
      // Get all the card titles in the DOM
      const cardTitles = el.queryAll(By.css('.mat-card-title'));
      // Check for all the card titles
      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
      // Now check for the title's text
      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
      // Let Jasmine know that all the assertions have been completed
      done();
    }, 500);
  });

  /**
   * Asynchronous test using Angular's fakeAsync() - THE RECOMMENDED METHOD INSTEAD OF async();
   * Here, we use Angular's fakeAsync() function to let the test know it is an asynchronous test
   * and to wait for the call back to end.
   */
  it('should display advanced courses when tab clicked - using fakeAsync()', fakeAsync(() => {
    // Get the test data.  of() is an Observable from RxJs
    coursesServices.findAllCourses.and.returnValue(of(setupCourses()));

    // Now apply the test data
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    // Now simulate the click event of clicking on the 'Advanced' tab
    click(tabs[1]);
    // Now call the change detection to give time for Angular to update the DOM
    fixture.detectChanges();

    // Empty the task queue
    flush();
    // NOTE: We can also use tick(), but you will need to know how long will the macrotask last.
    // In this case, we know that the macrotask is from window.requestAnimationFrame which takes 16ms.  Therefore, we can use the following
    // tick(). (https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
    // tick(16);

    // Get all the card titles in the DOM
    const cardTitles = el.queryAll(By.css('.mat-card-title'));
    // Check for all the card titles
    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
    // Now check for the title's text
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  }));

  /**
   * Asynchronous test using Angular's async() - ONLY USE IN RARE CASES, SUCH AS THE NEED TO CALL HTTP WITHIN THE TEST
   * Here, we use Angular's async() function to let the test know it is an asynchronous test
   * and to wait for the call back to end.
   *
   * With async(), you cannot use the following methods: flush(), tick(), flushMicrotasks().
   * It is not as flexible as fackAsync() where you can check things at certain times of the test; such as using tick().
   * However, if you need to make a HTTP call in your test, then you should use async();
   */
  it('should display advanced courses when tab clicked - using async()', async(() => {
    // Get the test data.  of() is an Observable from RxJs
    coursesServices.findAllCourses.and.returnValue(of(setupCourses()));

    // Now apply the test data
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    // Now simulate the click event of clicking on the 'Advanced' tab
    click(tabs[1]);
    // Now call the change detection to give time for Angular to update the DOM
    fixture.detectChanges();

    /*
    The async() method provides us with a callback notifying when it is completed.
    This is the callback we have access too.  It is this method, whenStable(), that we place our assertions.
     */
    fixture.whenStable().then(() => {
      console.log('called whenStable()');

      // Get all the card titles in the DOM
      const cardTitles = el.queryAll(By.css('.mat-card-title'));
      // Check for all the card titles
      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
      // Now check for the title's text
      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
    });
  }));

});


