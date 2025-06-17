import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { AuthService } from '../auth.service';
import { HttpClient , HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-topics',
  templateUrl: './admin-topics.component.html',
  styleUrls: ['./admin-topics.component.css']
})
export class AdminTopicsComponent implements OnInit {
  subjects: any[] = []; 
  topics: any[] = [];
  successMessage: string = '';
  selectedSubject: any = null;
  newTopic: string = '';
  errorMessage: string = '';
  isDarkMode = false;
  searchText: string = ''; // Added for topic search

  constructor(private router: Router, private themeService: ThemeService , private authservice : AuthService , private http:HttpClient) {}

  // Custom search: match first letter only (case-insensitive)
  customSearchSubject(term: string, item: any): boolean {
    return item && item.toLowerCase().startsWith(term.toLowerCase());
  }

  addTopic() {
    
    const trimmed = this.newTopic.trim().toLowerCase();

    if (!trimmed) {
      this.errorMessage = 'Topic name is required.';
      return;
    }

    // تحقق إذا كان الاسم موجود بالفعل في القائمة
  const existingTopics = this.topics.map(topic =>
    topic.name.trim().toLowerCase()
  );

  if (existingTopics.includes(trimmed)) {
    this.errorMessage = 'This topic already exists.';
    return;
  }
    // بداية إضافة الأسم الجديد
  const token = localStorage.getItem('authToken');
  const subjectId = this.selectedSubject._id;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const body = {
    name: this.newTopic.trim()
  };

  this.http.post<any>(`${this.authservice.baseUrl}/api/subjects/${subjectId}/chapters`, body, { headers })
    .subscribe({
      next: (res) => {
        if (res.success) {
          this.newTopic = '';
          this.errorMessage = '';
          this.successMessage = 'Topic added successfully ✅';

          // ✅ استدعاء الدالة لجلب أحدث قائمة
          this.onSubjectChange(this.selectedSubject);

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = 'Failed to add topic.';
          this.successMessage = '';
        }
      },
      error: (err) => {
        console.error('Error adding topic:', err);
        this.errorMessage = err.error?.message || 'An error occurred while adding the topic.';
        this.successMessage = '';
      }
    });

    
  }

  deleteTopic( chapterId: number) {
  const subjectId = this.selectedSubject._id;
  // const chapterId = topic._id;
  const token = localStorage.getItem('authToken');

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  this.http.delete<any>(`${this.authservice.baseUrl}/api/subjects/${subjectId}/chapters/${chapterId}`, { headers })
    .subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Topic deleted successfully ✅';
          this.errorMessage = '';
          this.onSubjectChange(this.selectedSubject);  // إعادة تحميل التوبيكات

          // ⏱️ إخفاء الرسالة بعد 3 ثواني
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = 'Failed to delete topic.';
          this.successMessage = '';
        }
      },
      error: (err) => {
        console.error('Error deleting topic:', err);
        this.errorMessage = err.error?.message || 'An error occurred while deleting the topic.';
        this.successMessage = '';
      }
    });



    // if (this.topics[subject]) {
    //   const deleted = this.topics[subject][index];
    //   this.topics[subject].splice(index, 1);

    //   const username = localStorage.getItem('username') || 'UnknownUser';
    //   const deleteData = {
    //     username: username,
    //     subject: subject,
    //     deletedTopic: deleted
    //   };

    //   console.log('Topic to be sent to backend (DELETE):', JSON.stringify(deleteData));
    // }
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });

     this.http.get<any>(`${this.authservice.baseUrl}/api/subjects`)
      .subscribe(response => {
        if (response.success) {
          this.subjects = response.data;
          // this.subjectNames = response.data.map((subject: any) => subject.name);
        }
      }, error => {
        console.error('Error fetching subjects:', error);
      });

  }

  filteredTopics(): any[] {
  const term = this.searchText.trim().toLowerCase();

  let filtered = this.topics;

  if (term) {
    filtered = this.topics.filter(topic =>
      topic.name?.trim().toLowerCase().includes(term)
    );
  }

  const sorted = [...filtered].sort((a, b) =>
    a.name?.trim().toLowerCase().localeCompare(b.name?.trim().toLowerCase())
  );

  // console.clear();
  // console.log('✅ Filtered count:', filtered.length);
  // console.log('✅ Sorted topics:', sorted.map(t => t.name));

  return sorted;

}

  onSubjectChange(subject: any) {
    const subjectId = subject._id;

    this.http.get<any>(`${this.authservice.baseUrl}/api/subjects/${subjectId}/chapters`)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.topics = res.data;  // ✅ هنا التغيير
            // console.log('Topics:', this.topics);
          } else {
            this.topics=[];
            // console.error('No topics found');
          }
        },
        error: (err) => {
          // console.error('Error fetching topics:', err);
          this.topics=[];
        }
      });
  }


}
