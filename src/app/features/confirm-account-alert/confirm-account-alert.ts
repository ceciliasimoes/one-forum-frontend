import { Component, computed, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-confirm-account-alert',
  imports: [MatButtonModule],
  templateUrl: './confirm-account-alert.html',
  styleUrl: './confirm-account-alert.css',
})
export class ConfirmAccountAlert implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);

  notIsConfirmed = signal<boolean>(true);
  email = signal<string>("");
  loading = signal<boolean>(false);

  ngOnInit(): void {
    const data = history.state;
    this.email.set(data?.email || "");
    this.notIsConfirmed.set(data?.isLocked ?? true);
    
    // Verifica se veio com status de sucesso da query string
    if ((this.route.snapshot.queryParams['status'] as string | undefined) === 'success') {
      this.notIsConfirmed.set(false);
    }
  }

  resendConfirmationEmail(): void {
    const userEmail = this.email();
    
    if (!userEmail) {
      this.snackBar.open('Email não encontrado. Por favor, tente se registrar novamente.', 'Fechar', {
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-error'],
      });
      return;
    }

    this.loading.set(true);
    
    this.authService.requestResendConfirmationEmail(userEmail).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Email de confirmação reenviado com sucesso!', 'Fechar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Erro ao reenviar email:', err);
        this.snackBar.open('Erro ao reenviar email. Tente novamente.', 'Fechar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

}
