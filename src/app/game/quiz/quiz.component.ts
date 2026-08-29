import { Component, inject, OnInit } from '@angular/core';
import { Quiz } from '@model/quiz';
import { QuizService } from '@service/quiz.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@service/security/authentication.service';
import { NotificationType } from '@model/enum/notification-type.enum';
import { NotificationService } from '@service/notification.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  imports: [FormsModule],
})
export class QuizComponent implements OnInit {
  quizzes: Quiz[] = [];
  question: string = '?';
  currentQuiz: number = 0;
  answer: string | null = null;
  answerSelected: boolean = false;
  correctAnswers: number = 0;
  incorrectAnswers: number = 0;
  score: boolean = false;
  random: number = 0;

  private _snackBar = inject(MatSnackBar);
  private authenticationService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    const user = this.authenticationService.getUserFromLocalCache();
    if (!user || !user.userId) {
      return;
    }

    this.quizService.getQuizByUserId(user.userId).subscribe((data) => {
      this.quizzes = data;
      if (this.quizzes.length > 0) {
        this.random = Math.floor(
          Math.random() * this.quizzes[0].questionAnswerList.length,
        );
      }
    });
  }

  onSubmit(form: NgForm) {
    this.answerSelected = true;

    setTimeout(() => {
      this.currentQuiz++;
      if (this.quizzes.length > 0) {
        this.random = Math.floor(
          Math.random() * this.quizzes[0].questionAnswerList.length,
        );
      }
      this.answerSelected = false;
      // unselect radio buttons
      for (let i = 0; i < document.getElementsByName('answers').length; i++) {
        const ele = document.getElementsByName('answers')[
          i
        ] as HTMLInputElement;
        ele.checked = false;
      }
    }, 6000);

    if (
      this.quizzes[this.random]?.questionAnswerList[this.random].answer ==
      form.value.answers
    ) {
      this.correctAnswers++;
      return true;
    } else {
      this.incorrectAnswers++;
      return false;
    }
  }

  displayScore() {
    this.score = !this.score;
  }
}
