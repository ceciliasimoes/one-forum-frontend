import { Component, Inject, inject, signal, WritableSignal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { userService } from "../../core/services/user";
import { User } from "../../core/models/user";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'edit-dialog',
  templateUrl: './edit-dialog.html',
  imports: [MatDialogModule, MatInputModule, MatButtonModule, FormsModule]
})
export class EditDialog{
  userId!: number
  protected user: WritableSignal<User> = signal({} as User)

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private userService: userService) {
    this.userId = this.data.id
  }
  
  ngOnInit(): void{
    this.userService.getUser(this.userId!).subscribe((user)=>{
      this.user.set(user)
    })
  }

  readonly dialog = inject(MatDialog)
  cancelar(){
    this.dialog.closeAll();
  }

  enviar() {
    const data = {
        name: this.user().profile.name,
        photo: this.user().profile.photo
    }

    this.userService.editUser(this.userId, data).subscribe({
        next:()=>{
            console.log("Atualizado com sucesso: "+data)
            this.dialog.closeAll()
        },
        error: (error) => console.log(error)
    })
  }
}