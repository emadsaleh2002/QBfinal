import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-deleted-question',
  templateUrl: './admin-deleted-question.component.html',
  styleUrls: ['./admin-deleted-question.component.css']
})
export class AdminDeletedQuestionComponent {
  constructor(private router: Router,private themeService: ThemeService , private http:HttpClient , private authservice:AuthService) {}

  // Subjects and Topics
   subjects: any[] = []; 
   topics: any[] = [];
  selectedSubject: any = null;
  selectedTopic: any = null;
  filteredQuestions: any[] = [];
  message = '';
  isDarkMode = false;
  deleteMessage: string = '';


  // Custom search (first letter only)
  customSearchSubject(term: string, item: any): boolean {
    return item.name.toLowerCase().startsWith(term.toLowerCase());
  }

  customSearchTopic(term: string, item: any): boolean {
    return item.toLowerCase().startsWith(term.toLowerCase());
  }

  // Handlers
  onSubjectChange(subject:any) {
    this.selectedTopic = '';
    this.filteredQuestions = [];

     const subjectId = subject._id;

    this.http.get<any>(`${this.authservice.baseUrl}/api/subjects/${subjectId}/chapters`)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.topics = res.data;  // ✅ هنا التغيير
            this.selectedTopic='';
             console.log('Topics:', this.topics);
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


  onTopicChange() {
   this.filteredQuestions = []; // Clear previous
  const token = localStorage.getItem('authToken');
  
  if (!this.selectedSubject || !this.selectedTopic) return;
  const subjectId = this.selectedSubject._id;
  const chapterName = this.selectedTopic.name;

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  const url = `${this.authservice.baseUrl}/api/questions?subjectId=${subjectId}&chapter=${encodeURIComponent(chapterName)}`;

  this.http.get<any>(url, { headers }).subscribe({
    next: (res) => {
      if (res.success) {
        this.filteredQuestions = res.data;
        console.log('✅ Questions loaded:', this.filteredQuestions);
      } else {
        this.filteredQuestions = [];
        console.warn('⚠️ No questions returned.');
      }
    },
    error: (err) => {
      console.error('❌ Error loading questions:', err);
      this.filteredQuestions = [];
    }
  });
    
  }

  deleteQuestion(questionId: string) {
    const token = localStorage.getItem('authToken');

  if (!token) {
    console.error('❌ No auth token found.');
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  const url = `${this.authservice.baseUrl}/api/questions/${questionId}`;

  if (confirm('Are you sure you want to delete this question?')) {
    this.http.delete<any>(url, { headers }).subscribe({
      next: (res) => {
        if (res.success) {
          // ✅ إزالة السؤال من القائمة بدون إعادة التحميل
          this.filteredQuestions = this.filteredQuestions.filter(q => q._id !== questionId);
         
          this.deleteMessage = '✅ Question deleted successfully.';

              // ✅ إخفاء الرسالة بعد 3 ثواني
              setTimeout(() => {
                this.deleteMessage = '';
              }, 3000);
        } else {
             this.deleteMessage = '❌Question Failed deleted.';

              // ✅ إخفاء الرسالة بعد 3 ثواني
              setTimeout(() => {
                this.deleteMessage = '';
              }, 3000);
        }
      },
      error: (err) => {
         this.deleteMessage = '❌ Error deleting question.';

              // ✅ إخفاء الرسالة بعد 3 ثواني
              setTimeout(() => {
                this.deleteMessage = '';
              }, 3000);
        // console.error('❌ Error deleting question:', err);
      }
    });
  }
    
  }

  goBack() {
    this.router.navigate(['/admin/questions']);
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

}
