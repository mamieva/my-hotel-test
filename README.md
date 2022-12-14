# MyHotel Test

## Prerequisites


Before you start, you need to install and configure the tools:

* [git](https://git-scm.com/)
* [Node.js and npm](https://nodejs.org/)
* [Angular CLI](https://angular.io/cli)
* IDE (e.g. [Visual Studio Code](https://code.visualstudio.com/) or [WebStorm](https://www.jetbrains.com/webstorm/))



## Getting started


### Create the Angular application


**1.** Let's create the application with the Angular base structure using the `@angular/cli` with the route file and the SCSS style format.

```powershell
ng new my-hotel-test --routing true --style scss
CREATE my-hotel-test/README.md (1083 bytes)
CREATE my-hotel-test/.editorconfig (274 bytes)
CREATE my-hotel-test/.gitignore (548 bytes)
CREATE my-hotel-test/angular.json (3363 bytes)
CREATE my-hotel-test/package.json (1095 bytes)
CREATE my-hotel-test/tsconfig.json (863 bytes)
CREATE my-hotel-test/.browserslistrc (600 bytes)
CREATE my-hotel-test/karma.conf.js (1449 bytes)
CREATE my-hotel-test/tsconfig.app.json (287 bytes)
CREATE my-hotel-test/tsconfig.spec.json (333 bytes)
CREATE my-hotel-test/.vscode/extensions.json (130 bytes)
CREATE my-hotel-test/.vscode/launch.json (474 bytes)
CREATE my-hotel-test/.vscode/tasks.json (938 bytes)
CREATE my-hotel-test/src/favicon.ico (948 bytes)
CREATE my-hotel-test/src/index.html (315 bytes)
CREATE my-hotel-test/src/main.ts (372 bytes)
CREATE my-hotel-test/src/polyfills.ts (2338 bytes)
CREATE my-hotel-test/src/styles.scss (80 bytes)
CREATE my-hotel-test/src/test.ts (745 bytes)
CREATE my-hotel-test/src/assets/.gitkeep (0 bytes)
CREATE my-hotel-test/src/environments/environment.prod.ts (51 bytes)
CREATE my-hotel-test/src/environments/environment.ts (658 bytes)
CREATE my-hotel-test/src/app/app-routing.module.ts (245 bytes)
CREATE my-hotel-test/src/app/app.module.ts (393 bytes)
CREATE my-hotel-test/src/app/app.component.scss (0 bytes)
CREATE my-hotel-test/src/app/app.component.html (23364 bytes)
CREATE my-hotel-test/src/app/app.component.spec.ts (1151 bytes)
CREATE my-hotel-test/src/app/app.component.ts (237 bytes)
??? Packages installed successfully.
    Successfully initialized git.
```

**2.** Let's create a custom validator for the email field. Create the `EmailValidatorDirective` directive.

```powershell
ng generate directive email-validator --skip-tests=true
CREATE src/app/email-validator.directive.ts (157 bytes)
UPDATE src/app/app.module.ts (592 bytes)
```

**3.** Change the `src/app/email-validator.directive.ts` file. Create the `emailValidator` function and the `EmailValidatorDirective` class as below.

```typescript
import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {

  const EMAIL_REGEXP = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = EMAIL_REGEXP.test(control.value);

    if (isValid) {
      return null;
    } else {
      return {
        emailValidator: {
          valid: false,
        },
      };
    }
  };

}

@Directive({
  selector: '[appEmailValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: EmailValidatorDirective,
    multi: true,
  }],
})
export class EmailValidatorDirective implements Validator {

  constructor() {
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    return emailValidator()(control);
  }

}
```

**4.** Change the `src/app/app.component.ts` file. Import the `NgForm` service, create the `IUser` interface and create the `validate` function as below.

```typescript
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { emailValidator } from './email-validator.directive';

interface IUser {
  name: string;
  nickname: string;
  email: string;
  password: string;
  showPassword: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  reactiveForm!: FormGroup;
  user: IUser;

  constructor() {
    this.user = {} as IUser;
  }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      name: new FormControl(this.user.name, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      nickname: new FormControl(this.user.nickname, [
        Validators.maxLength(10),
      ]),
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
        emailValidator(),
      ]),
      password: new FormControl(this.user.password, [
        Validators.required,
        Validators.minLength(15),
      ]),
    });
  }

  get name() {
    return this.reactiveForm.get('name')!;
  }

  get nickname() {
    return this.reactiveForm.get('nickname')!;
  }

  get email() {
    return this.reactiveForm.get('email')!;
  }

  get password() {
    return this.reactiveForm.get('password')!;
  }

  public validate(): void {
    if (this.reactiveForm.invalid) {
      for (const control of Object.keys(this.reactiveForm.controls)) {
        this.reactiveForm.controls[control].markAsTouched();
      }
      return;
    }

    this.user = this.reactiveForm.value;

    console.info('Name:', this.user.name);
    console.info('Nickname:', this.user.nickname);
    console.info('Email:', this.user.email);
    console.info('Password:', this.user.password);
  }

}
```

**5.** Change the `src/app/app.component.html` file. Add the form as below.

```html
<div class="container-fluid py-3">
  <h1>Angular Reactive Form Validation</h1>

  <div class="row justify-content-center my-5">
    <div class="col-4">
      <form [formGroup]="reactiveForm" #form="ngForm">
        <div class="row">
          <div class="col mb-2">
            <label for="name" class="form-label">Name:</label>
            <input type="text" id="name" name="name" formControlName="name" placeholder="Your name" required minlength="1" maxlength="250" class="form-control form-control-sm" [class.is-invalid]="name.invalid && (name.dirty || name.touched)">
            <div *ngIf="name.invalid && (name.dirty || name.touched)" class="invalid-feedback">
              <div *ngIf="name.errors?.['required']">
                This field is required.
              </div>
              <div *ngIf="name.errors?.['minlength']">
                This field must have at least 1 character.
              </div>
              <div *ngIf="name.errors?.['maxlength']">
                This field must have at most 250 characters.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mb-2">
            <label for="nickname" class="form-label">Nickname:</label>
            <input type="text" id="nickname" name="nickname" formControlName="nickname" placeholder="Your nickname" maxlength="10" class="form-control form-control-sm" [class.is-invalid]="nickname.invalid && (nickname.dirty || nickname.touched)">
            <div *ngIf="nickname.invalid && (nickname.dirty || nickname.touched)" class="invalid-feedback">
              <div *ngIf="nickname.errors?.['maxlength']">
                This field must have at most 10 characters.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mb-2">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="email" name="email" formControlName="email" placeholder="your-name@provider.com" required minlength="1" maxlength="250" class="form-control form-control-sm" [class.is-invalid]="email.invalid && (email.dirty || email.touched)">
            <div *ngIf="email.invalid && (email.dirty || email.touched)" class="invalid-feedback">
              <div *ngIf="email.errors?.['required']">
                This field is required.
              </div>
              <div *ngIf="email.errors?.['minlength']">
                This field must have at least 1 character.
              </div>
              <div *ngIf="email.errors?.['maxlength']">
                This field must have at most 250 characters.
              </div>
              <div *ngIf="!email.errors?.['required'] && !email.errors?.['minlength'] && !email.errors?.['maxlength'] && email.errors?.['emailValidator']">
                Invalid email format.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mb-2">
            <label for="password" class="form-label">Password:</label>
            <div class="input-group input-group-sm has-validation">
              <input [type]="user.showPassword ? 'text' : 'password'" id="password" name="password" formControlName="password" required minlength="15" class="form-control form-control-sm" [class.is-invalid]="password.invalid && (password.dirty || password.touched)">
              <button type="button" class="btn btn-outline-secondary" (click)="user.showPassword = !user.showPassword">
                <i class="bi" [ngClass]="{'bi-eye-fill': !user.showPassword, 'bi-eye-slash-fill': user.showPassword}"></i>
              </button>
              <div *ngIf="password.invalid && (password.dirty || password.touched)" class="invalid-feedback">
                <div *ngIf="password.errors?.['required']">
                  This field is required.
                </div>
                <div *ngIf="password.errors?.['minlength']">
                  This field must have at least 15 characters.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mb-2 d-grid">
            <button type="button" class="btn btn-sm btn-primary" (click)="validate()">Validate</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
```

**6.** Change the `src/app/app.module.ts` file. Import the `ReactiveFormsModule` module and the `EmailValidatorDirective` directive as below.

```typescript
import { ReactiveFormsModule } from '@angular/forms';

import { EmailValidatorDirective } from './email-validator.directive';

declarations: [
  AppComponent,
  EmailValidatorDirective,
],
imports: [
  BrowserModule,
  ReactiveFormsModule,
  AppRoutingModule,
],
```

**7.** Run the application with the command below.

```powershell
npm start

> my-hotel-test@1.0.0 start
> ng serve

??? Browser application bundle generation complete.

Initial Chunk Files   | Names         |  Raw Size
vendor.js             | vendor        |   2.25 MB | 
styles.css, styles.js | styles        | 454.68 kB | 
polyfills.js          | polyfills     | 294.84 kB | 
scripts.js            | scripts       |  76.33 kB | 
main.js               | main          |  27.76 kB | 
runtime.js            | runtime       |   6.56 kB | 

                      | Initial Total |   3.09 MB

Build at: 2022-03-21T00:40:49.519Z - Hash: af669f909d9510f8 - Time: 3254ms

** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **


??? Compiled successfully.
```

**8.** Ready! Access the URL `http://localhost:4200/` and check if the application is working.



## Cloning the application

**1.** Clone the repository.

```powershell
git clone git@github.com:mamieva/my-hotel-test.git
```

**2.** Install the dependencies.

```powershell
npm ci
```

**3.** Run the application.

```powershell
npm start
```
