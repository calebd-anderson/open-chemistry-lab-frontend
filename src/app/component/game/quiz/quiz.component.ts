import { Component, OnInit } from '@angular/core';
import { Quiz } from '../../../model/quiz';
import { QuizService } from '../../../service/quiz.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../service/security/authentication.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  imports: [FormsModule],
})
export class QuizComponent implements OnInit {
  quizzes: Quiz[] = [];
  question: string;
  currentQuiz: number = 0;
  answer: any;
  answerSelected: boolean;
  correctAnswers: number = 0;
  incorrectAnswers: number = 0;
  score: boolean = false;
  random: number;

  constructor(
    private quizService: QuizService,
    private _snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.quizService
      .getQuizByUserId(
        this.authenticationService.getUserFromLocalCache().userId
      )
      .subscribe((data) => {
        this.quizzes = data;
        this.random = Math.floor(
          Math.random() * this.quizzes[0].questionAnswerList.length
        );
      });
  }

  onSubmit(form: NgForm) {
    this.answerSelected = true;

    setTimeout(() => {
      this.currentQuiz++;
      this.random = Math.floor(
        Math.random() * this.quizzes[0].questionAnswerList.length
      );
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
      form.value.answers ==
      this.quizzes[this.random]?.questionAnswerList[this.random].answer
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
