import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from 'src/app/_services/firebase-service.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-university-content',
  templateUrl: './university-content.component.html',
  styleUrls: ['./university-content.component.scss']
})
export class UniversityContentComponent implements OnInit {
  readonly featureFields = [
    { key: 'contentlibrary', label: 'Content Library' },
    { key: 'fourcards', label: 'Four Cards' },
    { key: 'interactive', label: 'Interactive' },
    { key: 'languagelab', label: 'Language Lab' },
    { key: 'search', label: 'Search' }
  ];
  universities: any[] = [];
  selectedUniversityId = '';
  categoryName = '';
  contentTitle = '';
  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private firebaseService: FirebaseServiceService,
    private notifyService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUniversities();
  }

  get selectedUniversity(): any {
    return this.universities.find(item => item._id === this.selectedUniversityId);
  }

  get categoryOptions(): any[] {
    const categories = this.selectedUniversity?.category;
    if (!Array.isArray(categories)) return [];
    return [...categories]
      .filter(category => category?.name)
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  }

  onUniversityChange(): void {
    this.categoryName = '';
    this.contentTitle = '';
    this.selectedFile = null;
    const fileInput = document.getElementById('contentFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  isFeatureActive(field: string): boolean {
    return this.selectedUniversity?.[field] === 'active';
  }

  async toggleFeature(field: any, event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const enabled = input.checked;
    if (!this.selectedUniversity) return;

    try {
      const updatedUniversity = await this.firebaseService.updateUniversityFeature(
        this.selectedUniversityId,
        this.selectedUniversity.collegeId,
        field,
        enabled
      );
      const index = this.universities.findIndex(
        item => item.collegeId === updatedUniversity.collegeId
      );
      if (index >= 0) {
        this.universities[index] = updatedUniversity;
        this.selectedUniversityId = updatedUniversity._id;
      }
      this.notifyService.showSuccess(
        `${this.featureFields.find(item => item.key === field)?.label || 'Feature'} is now ${enabled ? 'active' : 'inactive'}`
      );
    } catch (error) {
      console.error('Unable to update UniversityCollection feature:', error);
      input.checked = !enabled;
      this.notifyService.showError(error?.message || 'Unable to update the feature status');
    }
  }

  loadUniversities(): void {
    this.firebaseService.syncExistingInstitutionsToUniversities()
      .then(() => this.firebaseService.getUniversityCollections())
      .then(data => this.universities = data)
      .catch(error => {
        console.error('Unable to load UniversityCollection:', error);
        this.notifyService.showError('Unable to load universities from Firebase');
      });
  }

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.length ? input.files[0] : null;
    if (this.selectedFile && this.selectedFile.size > 100 * 1024 * 1024) {
      this.notifyService.showError('File must be 100 MB or smaller');
      this.selectedFile = null;
      input.value = '';
    }
  }

  async uploadContent(form: any): Promise<void> {
    if (!form.valid || !this.selectedFile || !this.selectedUniversity) {
      this.notifyService.showError('Select an institution, enter category and content titles, and choose a file');
      return;
    }

    this.uploading = true;
    try {
      const file = this.selectedFile;
      const url = await this.firebaseService.uploadUniversityContent(
        this.selectedUniversity.collegeId,
        this.categoryName.trim(),
        file
      );
      await this.firebaseService.addUniversityContentMetadata(
        this.selectedUniversityId,
        this.categoryName.trim(),
        this.contentTitle.trim(),
        url
      );
      this.uploading = false;
      this.notifyService.showSuccess('University content uploaded successfully');
      this.categoryName = '';
      this.contentTitle = '';
      this.selectedFile = null;
      form.resetForm({ universityId: this.selectedUniversityId });
      this.loadUniversities();
    } catch (error) {
      this.uploading = false;
      this.notifyService.showError('Unable to upload the file');
    }
  }
}
