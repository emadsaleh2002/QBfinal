import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-question-display',
  templateUrl: './question-display.component.html',
  styleUrls: ['./question-display.component.css']
})
export class QuestionDisplayComponent {
  questions: any[] = [];
  feedBackOpenQuestion:any[]=[];
  selectedAnswers: { [key: number]: string } = {};
  correctAnswers: { [key: number]: boolean | null |"NoAnswer"} = {};
  currentIndex = 0;
  totalCorrect = 0;
  showAnswers = false;
  showAnswerButton = true;
  showSubmitButton = true;
  showResults = false;
  isDarkMode = false;
  evaluateOpen:boolean=false;
  answers: { questionId: string; answer: string }[] = [];


  constructor(private router: Router,private themeService: ThemeService , private http:HttpClient , private authservice:AuthService){
    const navigation = this.router.getCurrentNavigation();
    this.questions = navigation?.extras.state?.['questions'] || [];
    console.log(this.questions);
  }

  get correctCount(): number {
    return Object.values(this.correctAnswers).filter(v => v === true).length;
  }

  get wrongCount(): number {
    return Object.values(this.correctAnswers).filter(v => v === false).length;
  }

  get unansweredCount(): number {
    return Object.values(this.correctAnswers).filter(v => v === "NoAnswer").length;
  }

  get correctPercent(): number {
    return this.percentage(this.correctCount);
  }

  get wrongPercent(): number {
    return this.percentage(this.wrongCount);
  }

  get unansweredPercent(): number {
    return this.percentage(this.unansweredCount);
  }

  percentage(count: number): number {
    return this.questions.length ? (count / this.questions.length) * 100 : 0;
  }

  submitAnswers(): void {
    this.showResults = true;
    this.totalCorrect = 0;
    this.showSubmitButton = false;
    //console.log(this.selectedAnswers);
    this.answers = []; // clear previous values

    this.questions.forEach((q, i) => {
      let raw = this.selectedAnswers[i]?.trim()|| '';
      // Use "NoAnswer" if nothing was entered:
      const answer = raw === '' ? 'NoAnswer' : raw;

      // Fill the answered array
      this.answers.push({
        questionId: q._id,
        answer: answer
      });

      if (answer === 'NoAnswer') {
        this.correctAnswers[i] = "NoAnswer";
        return;
      }

      if (['mcq', 'true_false', 'complete'].includes(q.type)) {
        const correct = answer.toLowerCase() === q.correctAnswer.trim().toLowerCase();
        this.correctAnswers[i] = correct;
        if (correct) this.totalCorrect++;
      } else if (q.type === 'open_text') {
        // this.correctAnswers[i] = null;
        this.evaluateOpen=true;
      }
    });

    this.currentIndex = 0;
     console.log('Answered Questions:', this.answers);

       const token = localStorage.getItem('authToken'); // ✅ Make sure this is set
     
         const headers = new HttpHeaders({
           'Authorization': `Bearer ${token}`,
           'Content-Type': 'application/json'
         });
         
         // ✅ Prepare body with "answers" key
        const body = {
          answers: this.answers
        };

         this.http.post<any>(`${this.authservice.baseUrl}/api/answers/batch`, body, { headers })
            .subscribe({
              next: (res) => {
                console.log('✅ Answers submitted successfully:', res);
                if(this.evaluateOpen){
                  this.feedBackOpenQuestion=res.data;
                  this.EvaluateOpenQuestion(res.data);
                  this.EvaluteCorrectAnswersInOpenQuestions(res.data);
                }
              },
              error: (err) => {
                console.error('❌ Error submitting answers:', err);
              }
            });

  }

  next(): void {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  previous(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  first(): void {
    this.currentIndex = 0;
  }

  last(): void {
    this.currentIndex = this.questions.length - 1;
  }

  ShowAnswers(): void {
    this.showAnswers = true;
    this.showAnswerButton = false;
  }

  get isPreviousDisabled(): boolean {
    return this.currentIndex === 0;
  }

  get isNextDisabled(): boolean {
    return this.currentIndex === this.questions.length - 1;
  }
  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }


  EvaluateOpenQuestion(feedbackArray: any[]){
    this.totalCorrect=0;
    feedbackArray.forEach(item=>{
      if(item.isCorrect){
        this.totalCorrect++;
      }
    })
  }

  EvaluteCorrectAnswersInOpenQuestions(feedbackArray: any[]){
    feedbackArray.forEach((item , index)=>{
      if(this.correctAnswers[index]!="NoAnswer"){
        this.correctAnswers[index]=item.isCorrect;
      }
    });

  }
goBack() {
    this.router.navigate(['/questions']);
  }
}
