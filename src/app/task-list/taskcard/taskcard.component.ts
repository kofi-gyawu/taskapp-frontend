import { Component, Input } from '@angular/core';
import { Task } from '../task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-taskcard',
  imports: [CommonModule],
  templateUrl: './taskcard.component.html',
  styleUrl: './taskcard.component.scss'
})
export class TaskcardComponent {
  @Input() task!: Task;

  completeTask() {}
  comment(){}
}
