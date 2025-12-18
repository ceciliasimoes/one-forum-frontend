import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, WritableSignal } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user';
import { AuthService, User } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { TopicList } from "../home/components/topic-list/topic-list";
import { StatusFlag } from '../../core/models/status-flag.model';
import { Topic } from '../../core/models/topics';
import { PageEvent } from '@angular/material/paginator';
import { TopicListService } from '../../core/services/topic-list.service';
import { SkeletonProfileCard } from '../../shared/components/skeleton-profile-card/skeleton-profile-card';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDivider,
    MatSelectModule,
    ReactiveFormsModule,
    TopicList,
    SkeletonProfileCard
],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Profile {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private location = inject(Location);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly topicListService = inject(TopicListService);
  protected user: WritableSignal<User> = signal({} as User);
  protected isEditing = signal(false);
  protected isLoadingProfile = signal(false);
  protected photoPreview = signal<string | null>(null);
  protected profileForm!: FormGroup;
  private selectedFile: File | null = null;
  protected isOwnProfile = signal(true);

  topicsStatusFlag = signal(StatusFlag.OK);
  userTopicsTotalElements = signal(0);
  userTopics: WritableSignal<Topic[]> = signal([]);


  constructor() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      photo: [''],
    });

    this.route.params.subscribe((params) => {
      const userId = params['id'];
      if (userId) {
        this.loadUserProfile(Number(userId));
      } else {
        this.loadCurrentUserProfile();
      }
    });
  }

  private loadCurrentUserProfile(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.user.set(currentUser);
      this.isOwnProfile.set(true);
    } else {
      this.router.navigate(['/login']);
    }
  }

  private loadUserProfile(userId: number): void {
    const currentUser = this.authService.currentUser();

    if (currentUser && currentUser.id === userId) {
      this.user.set(currentUser);
      this.isOwnProfile.set(true);
      this.router.navigate(['/profile']);
    } else {
      this.isLoadingProfile.set(true);
      this.authService.fetchUser(userId).subscribe({
        next: (userData) => {
          this.user.set(userData);
          this.isOwnProfile.set(false);
          this.setUserTopics();
          this.isLoadingProfile.set(false);
        },
        error: (err) => {
          console.error('Erro ao carregar perfil:', err);
          this.showMessage('Usuário não encontrado.', 'error');
          this.router.navigate(['/home']);
          this.isLoadingProfile.set(false);
        },
      });
    }
  }

  toggleEdit(): void {
    if (!this.isOwnProfile()) {
      this.showMessage('Você não pode editar este perfil.', 'warning');
      return;
    }

    this.isEditing.set(true);
    this.photoPreview.set(null);
    this.selectedFile = null;
    this.profileForm.patchValue({
      name: this.user().profileName,
      photo: this.user().profilePhoto,
    });
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.photoPreview.set(null);
    this.selectedFile = null;
    this.profileForm.reset();
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const imageUrl = e.target.result as string;
          this.photoPreview.set(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      if (this.selectedFile) {
        this.uploadPhotoAndUpdate();
      } else {
        this.updateProfile(this.user().profilePhoto);
      }
    }
  }

  private uploadPhotoAndUpdate(): void {
    this.authService.uploadProfile(this.selectedFile!).subscribe({
      next: (uploadRes: string): void => {
        this.handlePhotoUploadSuccess(uploadRes);
      },
      error: (err): void => {
        this.handlePhotoUploadError(err);
      },
    });
  }

  private handlePhotoUploadSuccess(avatarUrl: string): void {
    this.updateProfile(avatarUrl);
  }

  private handlePhotoUploadError(err: any): void {
    console.error('Erro ao enviar foto:', err);
    this.showMessage('Erro ao enviar foto. Tente novamente.', 'error');
  }

  private updateProfile(photoUrl: string): void {
    const data = {
      name: this.profileForm.value.name,
      photo: photoUrl,
    };

    this.userService.editUser(this.user().id, data).subscribe({
      next: () => {
        this.handleUpdateSuccess(data);
      },
      error: (error) => {
        this.handleUpdateError(error);
      },
    });
  }

  private handleUpdateSuccess(data: { name: string; photo: string }): void {
    const currentUser = this.user();
    this.user.set({
      ...currentUser,
      profileName: data.name,
      profilePhoto: data.photo,
    });

    this.authService.updateUserData();

    this.isEditing.set(false);
    this.photoPreview.set(null);
    this.selectedFile = null;

    this.showMessage('Perfil atualizado com sucesso!', 'success');
  }

  private handleUpdateError(error: any): void {
    console.error('Erro ao atualizar:', error);
    this.showMessage('Erro ao atualizar perfil. Tente novamente.', 'error');
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

  logout() {
    this.authService.logout();
  }

  private setUserTopics() {
    this.topicsStatusFlag.set(StatusFlag.LOADING);
    this.topicListService.fetchTopics({
      authorId: this.user().id,
    }).subscribe({
      next: data => {
        this.userTopics.set(data.content);
        this.userTopicsTotalElements.set(data.totalElements);
        this.topicsStatusFlag.set(StatusFlag.OK);
      }
    })
  }

  handlePaginationChange(pageEvent: PageEvent) {
    this.topicListService.fetchTopics({
      authorId: this.user().id,
      page: pageEvent.pageIndex,
      size: pageEvent.pageSize
    }).subscribe({
      next: data => {
        this.userTopics.set(data.content);
        this.userTopicsTotalElements.set(data.totalElements);
      }
    })
  }

  return() {
    this.location.back();
  }
}
