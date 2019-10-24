import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';


/**
 * Example on how to test for DOM
 */
describe('CoursesCardListComponent', () => {
  let component: CoursesCardListComponent;
  // ComponentFixture is a test utility to help test the component
  let fixture: ComponentFixture<CoursesCardListComponent>;
  // This allows us to access CSS
  let el: DebugElement;

  /*
  NOTE: Since the compileComponents() returns a promise the rest of the execution will not wait for it and the first test code
  will be initiated.  To make sure we do wait, we can use the Angular's testing utility method async(), (NOT JAVASCRIPT'S async),
  to wrap the lambda for the beforeEach() method.  The async() method will wait, by default, 5 seconds after all the operations
  have completed within the beforeEach() block is done.
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // Import the CoursesModule for ease.  Else, we'll have to declare all the components that the CoursesCardListComponent uses
        // which is already declared in the CoursesModule.
        CoursesModule
      ]
    })
    // This waits for the component to compile and returns a promis
      .compileComponents()
      // Now the component has been returned, we can test.
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it('should create the component', () => {
    // Confirm the component is displayed
    expect(component).toBeTruthy();
    console.log(component);

  });


  /**
   * This is a synchronous test.  If you can make the test synchronous, then do so.  It is easier to read and maintain.
   */
  it('should display the course list', () => {
    // Get test data and pass test data to the component
    component.courses = setupCourses();
    // Now notify that some changes were made.  This will detect changes in the DOM such as in the {{[interpolation]}} parts.
    fixture.detectChanges();

    // Here you can test the output of what is the element
    console.log(el.nativeElement.outerHTML);

    const cards = el.queryAll(By.css('.course-card'));
    expect(cards).toBeTruthy('Could not find cards');
    expect(cards.length).toBe(12, 'Unexpected number of courses');

  });


  it('should display the first course', () => {
    // Get test data and pass test data to the component
    component.courses = setupCourses();
    // Now notify that some changes were made.  This will detect changes in the DOM such as in the {{[interpolation]}} parts.
    fixture.detectChanges();

    // Get the first course
    const course = component.courses[0];
    const card = el.query(By.css('.course-card:first-child'));
    const title = card.query(By.css('mat-card-title'));
    const image = card.query(By.css('img'));

    expect(card).toBeTruthy('Could not find course card');
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);

  });


});


