import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-admin-questions',
  templateUrl: './admin-questions.component.html',
  styleUrls: ['./admin-questions.component.css']
})
export class AdminQuestionsComponent {
   subjects: any[] = []; 
   topics: any[] = [];

  questionTypes: string[] = ['mcq', 'true/false', 'complete', 'open'];
  difficultyLevels: string[] = ['easy', 'medium', 'hard'];

  selectedSubject: any = null;
  selectedTopic: any = null;
  questionType: string = '';
  difficulty: string = '';
  correctAnswer: string = '';
  openQuestionText: string = '';  // لو نوع السؤال open
  selectedFile: File | null = null;
  message: string = '';
  score: number = 1;
  isDarkMode = false;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  showPreview: boolean = true;
  isSubmitting: boolean = false;

  constructor(private router: Router,private themeService: ThemeService , private http:HttpClient , private authservice:AuthService) {}

  goToDeletePage() {
    this.router.navigate(['/admin/deleted/question']);
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  onSubjectChange(subject: any) {

    this.message = '';
    this.openQuestionText='';
    const subjectId = subject._id;

    this.http.get<any>(`${this.authservice.baseUrl}/api/subjects/${subjectId}/chapters`)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.topics = res.data;  // ✅ هنا التغيير
            this.selectedTopic='';
            // console.log('Topics:', this.topics);
          } else {
            this.topics=[];
            this.selectedTopic='';
            // console.error('No topics found');
          }
        },
        error: (err) => {
          // console.error('Error fetching topics:', err);
          this.topics=[];
          this.selectedTopic='';
        }
      });
  }

  onFileSelected(event: any) {
    this.message='';

    const file = event.target.files[0];
    
    if (file) {
      this.selectedFile = file;
      console.log(this.selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result;
       this.showPreview = true;
    };
    reader.readAsDataURL(file); // ✅ يحوّل الصورة إلى base64 لعرضها
  } else {
    // ✅ المستخدم ضغط Cancel
    this.selectedFile = null;
    this.imagePreviewUrl = null;
     this.showPreview = false;
    console.log(this.selectedFile);
  }

  }

  

  addQuestion() {

     if (this.isSubmitting) return; // تمنع الضغط المتكرر
      this.isSubmitting = true;

      // التحقق من الحقول الأساسية
      if (!this.selectedSubject || !this.selectedTopic || !this.questionType || !this.difficulty) {
        this.message = 'Please fill all required fields.';
         this.isSubmitting = false;
        return;
      }

      const hasImage = !!this.selectedFile;
      const hasText = this.openQuestionText.trim().length > 0;

      // تحقق خاص لكل نوع سؤال
      if (this.questionType === 'mcq') {
        if (!hasImage) {
          this.message = 'Please upload an image for MCQ question.';
          this.isSubmitting = false;
          return;
        }
        if (hasText) {
          this.message = 'MCQ question should not have text.';
          this.isSubmitting = false;
          return;
        }
      } else if (this.questionType === 'open') {
        if (!hasText) {
          this.message = 'Please enter the question text for open question.';
          this.isSubmitting = false;
          return;
        }
      } else {
        if (!hasText && !hasImage) {
          this.message = 'Please provide either question text or image.';
          this.isSubmitting = false;
          return;
        }
      }

      if (this.questionType !== 'open' && !this.correctAnswer.trim()) {
        this.message = 'Please enter the correct answer.';
        this.isSubmitting = false;
        return;
      }

      if (this.score < 1 || this.score > 100) {
        this.message = 'Please enter a valid score between 1 and 100.';
        this.isSubmitting = false;
        return;
      }

      // إنشاء FormData
      const formData = new FormData();
      const questionTypeApi = 
            this.questionType === 'open' ? 'open_text' :
            this.questionType === 'true/false' ? 'true_false' :
            this.questionType;
      

      formData.append('type', questionTypeApi);
      formData.append('level', this.difficulty);
      formData.append('subjectId', this.selectedSubject._id);
      formData.append('chapter', this.selectedTopic.name);
      formData.append('score', String(this.score));

      if (questionTypeApi === 'open_text') {
          formData.append('modelAnswer', this.correctAnswer.trim());
        } else {
          formData.append('correctAnswer', this.correctAnswer.trim());
        }

      if (hasText) {
        formData.append('questionText', this.openQuestionText.trim());
      }

      if (hasImage && this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      console.log('📦 FormData contents:');
          formData.forEach((value, key) => {
            console.log(`${key}:`, value);
          });
      // إرسال البيانات للسيرفر
      const token = localStorage.getItem('authToken');

      this.http.post(`${this.authservice.baseUrl}/api/questions`, formData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).subscribe({
            next: (res) => {
              this.message = 'Question added successfully!';
              // console.log('✅ Question added:', res);
              this.resetForm();
               this.isSubmitting = false; // ✅ إعادة التفعيل
            },
            error: (err) => {
              this.message = 'Failed to add question.';
              // console.error('❌ Error:', err);
               this.isSubmitting = false; // ✅ إعادة التفعيل
            }
          });
}

resetForm() {
  this.selectedSubject = null;
  this.selectedTopic = '';
  this.questionType = '';
  this.difficulty = '';
  this.correctAnswer = '';
  this.openQuestionText = '';
  this.selectedFile = null;
  this.imagePreviewUrl = null;
  this.showPreview = false;
  this.score = 1;
  this.message = '';

  // إعادة تعيين input الخاص بالملف في الـ DOM
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}




  customSearchSubject(term: string, item: any): boolean {
    return item.name.toLowerCase().startsWith(term.toLowerCase());
  }

  customSearchTopic(term: string, item: any): boolean {
    return item.toLowerCase().startsWith(term.toLowerCase());
  }

  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });

    this.http.get<any>(`${this.authservice.baseUrl}/api/subjects`)
      .subscribe(response => {
        if (response.success) {
          this.subjects = response.data;
        }
      }, error => {
        console.error('Error fetching subjects:', error);
      });

  }

  onQuestionTypeChange() {
  this.correctAnswer = '';
  this.message='';
  this.openQuestionText='';
}

clearMessage() {
  this.message = '';
}

removeImage() {
  this.selectedFile = null;
  this.imagePreviewUrl = null;
  this.showPreview = false;

  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}

onDifficultyChange() {
  switch (this.difficulty) {
    case 'easy':
      this.score = 1;
      break;
    case 'medium':
      this.score = 2;
      break;
    case 'hard':
      this.score = 3;
      break;
    default:
      this.score = 1;
  }
}


}
