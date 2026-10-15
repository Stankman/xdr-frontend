import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent landing hero theme', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let originalBodyClass: string;

  beforeEach(async () => {
    originalBodyClass = document.body.className;
    await TestBed.configureTestingModule({
      declarations: [LoginComponent]
    });
    TestBed.overrideComponent(LoginComponent, {
      set: {
        template: `
          <section class="landing-hero">
            <span class="landing-eyebrow">Welcome</span>
            <h1>Welcome</h1>
            <p class="landing-description">Join the hotel</p>
            <p class="landing-note">Free to play</p>
            <span class="landing-art-label">Explore</span>
          </section>
        `
      }
    });
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.className = originalBodyClass;
    fixture.destroy();
  });

  it('preserves the dark hero and uses a brighter blue gradient with white copy in light mode', () => {
    const hero = fixture.nativeElement.querySelector('.landing-hero') as HTMLElement;
    const eyebrow = fixture.nativeElement.querySelector('.landing-eyebrow') as HTMLElement;
    const heading = fixture.nativeElement.querySelector('h1') as HTMLElement;
    const description = fixture.nativeElement.querySelector('.landing-description') as HTMLElement;
    const note = fixture.nativeElement.querySelector('.landing-note') as HTMLElement;
    const artLabel = fixture.nativeElement.querySelector('.landing-art-label') as HTMLElement;

    document.body.className = 'dark';
    const darkBackground = getComputedStyle(hero).backgroundImage;
    const darkBaseColor = getComputedStyle(hero).backgroundColor;
    const darkColor = getComputedStyle(heading).color;

    document.body.className = 'light';
    const lightBackground = getComputedStyle(hero).backgroundImage;
    const lightColor = getComputedStyle(heading).color;

    expect(darkBackground).toContain('rgb(35, 100, 135)');
    expect(darkBaseColor).toBe('rgb(16, 43, 64)');
    expect(darkColor).toBe('rgb(255, 255, 255)');
    expect(lightBackground).toContain('rgb(7, 89, 133)');
    expect(lightBackground).toContain('rgb(37, 99, 235)');
    expect(getComputedStyle(eyebrow).color).toBe('rgb(255, 255, 255)');
    expect(lightColor).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(description).color).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(note).color).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(artLabel).color).toBe('rgb(255, 255, 255)');
  });
});
