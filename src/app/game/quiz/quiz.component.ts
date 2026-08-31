import { Component, inject, OnInit } from '@angular/core';
import { UserQuiz } from '@model/quiz';
import { QuizService } from '@service/quiz.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@service/security/authentication.service';
import { NotificationType } from '@model/enum/notification-type.enum';
import { NotificationService } from '@service/notification.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonComponent } from '@/app/component/button/button.component';

@Component({
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  imports: [FormsModule, ButtonComponent],
})
export class QuizComponent implements OnInit {
  quizzes: UserQuiz[] = [];
  currentQuizIndex = 0;
  currentQuestionIndex = 0;
  answerSelected = false;
  correctAnswers = 0;
  incorrectAnswers = 0;
  score = false;

  private _snackBar = inject(MatSnackBar);
  private authenticationService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);

  constructor(private quizService: QuizService) {}

  get selectedQuiz(): UserQuiz | undefined {
    return this.quizzes[this.currentQuizIndex];
  }

  get currentQuestion(): string | undefined {
    return this.quizzes[this.currentQuestionIndex]?.question;
  }

  ngOnInit(): void {
    const user = this.authenticationService.getUserFromLocalCache();
    if (!user || !user.userId) {
      return;
    }

    this.quizService.getQuizByUserId(user.userId).subscribe({
      next: (data) => {
        this.quizzes = data;
        // this.selectRandomQuestion();
      },
      error: () => {
        this.notificationService.notify(
          NotificationType.ERROR,
          'Unable to load quiz questions right now.',
        );
      },
    });
  }

  private selectRandomQuestion(): void {
    if (this.quizzes.length === 0) {
      return;
    }

    this.currentQuizIndex = Math.floor(Math.random() * this.quizzes.length);
    const questions = this.quizzes[this.currentQuizIndex] ? [this.quizzes[this.currentQuizIndex]] : [];
    if (questions.length === 0) {
      this.currentQuestionIndex = 0;
      return;
    }

    this.currentQuestionIndex = Math.floor(Math.random() * questions.length);
  }

  onSubmit(form: NgForm) {
    if (!this.currentQuestion) {
      return;
    }

    const selectedAnswer = form.value.answers;
    const isCorrect = this.quizzes[this.currentQuizIndex].answer === selectedAnswer;

    this.answerSelected = true;

    if (isCorrect) {
      this.correctAnswers++;
    } else {
      this.incorrectAnswers++;
    }

    setTimeout(() => {
      this.answerSelected = false;
      form.resetForm();
      this.selectRandomQuestion();

      const radioButtons = document.getElementsByName('answers');
      radioButtons.forEach((radio) => {
        (radio as HTMLInputElement).checked = false;
      });
    }, 600);
  }

  displayScore() {
    this.score = !this.score;
  }
}
