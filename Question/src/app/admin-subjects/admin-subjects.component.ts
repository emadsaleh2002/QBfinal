import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-admin-subjects',
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.css']
})
export class AdminSubjectsComponent implements OnInit {
   subjects: any[] = [];           // full subject objects
   subjectNames: string[] = [];    // just names
   isSubmitting: boolean = false;
   successMessage: string = '';

  isDarkMode = false;
  constructor(private router: Router,private themeService: ThemeService , private http:HttpClient , private authservice : AuthService) {}

  newSubject: string = '';
  searchText: string = '';
  errorMessage: string = '';

   addSubject() {
     if (this.isSubmitting) return; // تمنع الضغط المتكرر
      this.isSubmitting = true;

    const trimmed = this.newSubject.trim();
    const normalizedNew = trimmed.toLowerCase().replace(/\s+/g, '');

    if (!trimmed) {
      this.errorMessage = 'Course name is required.';
      return;
    }

    const exists = this.subjectNames.some(subject =>
      subject.toLowerCase().replace(/\s+/g, '') === normalizedNew
    );

    if (exists) {
      this.errorMessage = 'This course already exists.';
      this.isSubmitting=false;
      return;
    }

    const token = localStorage.getItem('authToken'); 

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    console.log(headers);

    const body = {
      name: trimmed
      // Optionally add "description": '...' here
    };

    this.http.post<any>(`${this.authservice.baseUrl}/api/subjects`, body, { headers })
      .subscribe({
        next: (response) => {
          if (response.success) {
          this.successMessage = 'Course added successfully ✅';
          this.ReloadSubjects();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
           this.isSubmitting = false;
           this.newSubject='';
          } else {
            this.errorMessage = 'Failed to add course. Please try again.';
          }
        },
        error: (error) => {
          console.error('Add Subject Error:', error);
          this.errorMessage = error.error?.message || 'An error occurred.';
          this.isSubmitting = false;
        }
      });
  }

  // deleteSubject(index: number) {
  //   const token = localStorage.getItem('authToken'); // ✅ Make sure this is set

  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   });

  //   const subjectId=this.subjects[index]._id;
  //   console.log(subjectId);

  //   this.http.delete<any>(`${this.authservice.baseUrl}/api/subjects/${subjectId}`, { headers }).subscribe({
  //   next: (res) => {
  //     if (res.success) {
  //     this.ReloadSubjects();
  //     } else {
  //       this.errorMessage = 'Failed to delete subject.';
  //     }
  //   },
  //   error: (err) => {
  //     console.error('Delete Subject Error:', err);
  //     this.errorMessage = err.error?.message || 'An error occurred.';
  //   }
  // });
    
  // }

deleteSubject(index: number) {
  const token = localStorage.getItem('authToken');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const subjectId = this.subjects[index]._id;

  this.http.delete<any>(`${this.authservice.baseUrl}/api/subjects/${subjectId}`, { headers }).subscribe({
    next: (res) => {
      if (res.success) {
        // ✅ عرض رسالة نجاح
        this.successMessage = 'Course deleted successfully ✅';

        // ✅ إعادة تحميل القائمة بعد الحذف
        this.ReloadSubjects();

        // ✅ مسح الرسالة بعد 3 ثواني
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      } else {
        this.errorMessage = 'Failed to delete course.';
      }
    },
    error: (err) => {
      console.error('Delete Subject Error:', err);
      this.errorMessage = err.error?.message || 'An error occurred.';
    }
  });
}



  filteredSubjects(): string[] {
    const term = this.searchText.trim().toLowerCase();
    return this.subjectNames.filter(subject =>
      subject.toLowerCase().startsWith(term)
    );
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });

    this.ReloadSubjects();

  }

  ReloadSubjects(){
    this.http.get<any>(`${this.authservice.baseUrl}/api/subjects`)
      .subscribe(response => {
        if (response.success) {
          this.subjects = response.data;
          this.subjectNames = response.data.map((subject: any) => subject.name);
        }
      }, error => {
        console.error('Error fetching course:', error);
      });
  }

  }



