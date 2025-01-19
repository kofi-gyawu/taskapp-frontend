import { Component } from '@angular/core';
import { TaskcardComponent } from "./taskcard/taskcard.component";

@Component({
  selector: 'app-task-list',
  imports: [TaskcardComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {

}
