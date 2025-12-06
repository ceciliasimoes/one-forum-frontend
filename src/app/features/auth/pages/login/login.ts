import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ChangeDetectionStrategy, computed, WritableSignal } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  public readonly loading: WritableSignal<boolean> = signal(false);
  public readonly error: WritableSignal<string | null> = signal(null);

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  public readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  public readonly credentials = computed(() => ({
    email: this.form.get('email')!.value,
    password: this.form.get('password')!.value
  }));

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snack.open('Preencha os campos corretamente.', 'Fechar', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.value;

    this.auth.login({ email: email!, password: password! }).subscribe({
      next: async () => {
        this.loading.set(false);
        this.snack.open('Login realizado com sucesso!', 'Fechar', { duration: 2500 });
        await this.router.navigate(['/home']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Invalid email or password.');
        this.snack.open('Email ou senha inválidos.', 'Fechar', { duration: 3000 });
      }
    });
  }

  public goToSignUp(): Promise<boolean> {
    this.snack.open('Redirecionando para cadastro...', 'Fechar', { duration: 2000 });
    return this.router.navigate(['/register']);
  }

  public forgotPassword(): void {
    this.error.set(null);
    this.snack.open('Verifique seu email para recuperar a senha.', 'Fechar', { duration: 3000 });
  }
}
