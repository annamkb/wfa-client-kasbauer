import {Component, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../shared/authentication.service';
import {TutoringService} from '../shared/tutoring.service';
import {User} from '../shared/user';  // Import

interface Response {
  access_token: string;
}

@Component({
  selector: 'bs-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  currentUserId = signal<number | null>(null);
  currentUser = signal<User | null>(null);
  loginError: string | null = null;
  loadingLogin = signal(false);
  loadingUser = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private tutoringService: TutoringService
  ) {
    this.loginForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    if (this.authService.isLoggedIn()) {
      const id = this.authService.getCurrentUserId();
      this.currentUserId.set(id);

      this.loadUser(id);
    }

    //Fehlermeldung automatisch zurücksetzen bei Eingabeänderung
    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginError) {
        this.loginError = null;
      }
    });
  }

  login(): void {
    this.loginError = null;
    this.loadingLogin.set(true);

    const val = this.loginForm.value;

    if (val.username && val.password) {
      this.authService.login(val.username, val.password).subscribe({
        next: (res: any) => {
          this.authService.setSessionStorage((res as Response).access_token);
          const id = this.authService.getCurrentUserId();
          this.currentUserId.set(id);
          this.loadUser(id);
          this.router.navigateByUrl('/');
          this.loadingLogin.set(false);
        },
        error: (err) => {
          if (err.status === 401) {
            this.loginError = 'Benutzername oder Passwort ist falsch.';
          } else {
            this.loginError = 'Ein unbekannter Fehler ist aufgetreten.';
          }
          this.loadingLogin.set(false);
        }
      });
    } else {
      this.loadingLogin.set(false);
    }
  }

  loadUser(id: number) {
    this.loadingUser.set(true);
    this.tutoringService.getUserById(id).subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.loadingUser.set(false);
      },
      error: () => {
        this.currentUser.set(null);
        this.loadingUser.set(false);
      }
    });
  }


  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.currentUserId.set(null);
    this.currentUser.set(null);
  }
}
