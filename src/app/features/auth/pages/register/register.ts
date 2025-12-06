import { Component, signal, inject, ChangeDetectionStrategy, WritableSignal } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { passwordsMatch, strongPassword } from '../../../../core/validators/passwordValidators';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterRequest } from '../../../../core/models/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  public readonly loading: WritableSignal<boolean> = signal(false);
  public readonly photoPreview: WritableSignal<string | ArrayBuffer | null> = signal(null);

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  
  private selectedFile: File | null = null;

  public readonly form: FormGroup = this.fb.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPassword()]],
      confirmPassword: ['', Validators.required],
      photo: new FormControl<File | null>(null, Validators.required),
    },
    { validators: passwordsMatch('password', 'confirmPassword') }
  );

  public onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file: File | undefined = input?.files?.[0];
    
    if (!file) {
      return;
    }

    this.selectedFile = file;
    this.form.patchValue({ photo: file });

    const reader = new FileReader();
    reader.onload = (): void => this.photoPreview.set(reader.result);
    reader.readAsDataURL(file);
  }

  public submit(): void {
    if (this.form.invalid || !this.selectedFile) {
      this.showMessage('Por favor, preencha todos os campos corretamente', 'error');
      return;
    }

    this.loading.set(true);
    this.uploadPhotoAndRegister();
  }

  public goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private uploadPhotoAndRegister(): void {
    this.authService.uploadProfile(this.selectedFile!).subscribe({
      next: (uploadRes: any): void => {
        this.handlePhotoUploadSuccess(uploadRes);
      },
      error: (err): void => {
        this.handlePhotoUploadError(err);
      },
    });
  }

  private handlePhotoUploadSuccess(uploadRes: string): void {
    const avatarUrl = uploadRes;
    const payload = this.buildRegisterPayload(avatarUrl);

    this.authService.register(payload).subscribe({
      next: (res: any): void => this.handleRegisterSuccess(res, payload),
      error: (err): void => this.handleRegisterError(err),
    });
  }

  private handlePhotoUploadError(err: any): void {
    this.loading.set(false);
    console.error('Erro ao enviar foto:', err);
    this.showMessage('Erro ao enviar foto. Tente novamente.', 'error');
  }

  private buildRegisterPayload(avatarUrl: string): RegisterRequest {
    const firstName = this.form.value.firstName?.trim() ?? '';
    const lastName = this.form.value.lastName?.trim() ?? '';
    
    return {
      name: `${firstName} ${lastName}`.trim(),
      email: this.form.value.email!,
      password: this.form.value.password!,
      matchPassword: this.form.value.password!,
      avatarUrl,
    };
  }

  private handleRegisterSuccess(res: any, payload: RegisterRequest): void {
    const status = res?.status ?? res?.statusCode ?? res?.code;

    if (status === 201) {
      this.showMessage('Cadastro realizado com sucesso!', 'success');
      this.performAutoLogin(payload);
    } else {
      this.loading.set(false);
      this.showMessage('Cadastro realizado. Faça login para continuar.', 'info');
      this.router.navigate(['/login']);
    }
  }

  private handleRegisterError(err: any): void {
    this.loading.set(false);
    console.error('Erro ao criar usuário:', err);
    this.showMessage('Erro ao criar usuário. Tente novamente.', 'error');
  }

  private performAutoLogin(payload: RegisterRequest): void {
    this.authService
      .login({ email: payload.email, password: payload.password })
      .subscribe({
        next: (): void => this.handleLoginSuccess(),
        error: (err): void => this.handleLoginError(err),
      });
  }

  private handleLoginSuccess(): void {
    this.loading.set(false);
    this.showMessage('Login realizado com sucesso!', 'success');
    this.router.navigate(['/']);
  }

  private handleLoginError(err: any): void {
    this.loading.set(false);
    console.error('Erro no login automático:', err);
    this.showMessage('Cadastro ok, mas houve erro no login. Tente fazer login.', 'warning');
    this.router.navigate(['/login']);
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const config = {
      duration: 4000,
      horizontalPosition: 'end' as const,
      verticalPosition: 'top' as const,
      panelClass: [`snackbar-${type}`],
    };

    this.snackBar.open(message, 'Fechar', config);
  }
}
