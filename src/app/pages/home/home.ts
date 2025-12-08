import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Topbar } from "../../components/topbar/topbar";

@Component({
  selector: 'app-home',
  imports: [Topbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home {

}
