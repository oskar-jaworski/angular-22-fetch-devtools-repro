import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import { HTTP_TRANSPORT_LABEL } from './http-transport.token';

interface SampleDocument {
  id: string;
  fileName: string;
  createdDate: string;
  createdBy: string;
  visibleToClient: boolean;
}

interface SampleDocumentPage {
  content: SampleDocument[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

@Component({
  selector: 'app-root',
  imports: [JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly _http = inject(HttpClient);

  public readonly transportLabel = inject(HTTP_TRANSPORT_LABEL);
  public readonly response = signal<SampleDocumentPage | null>(null);
  public readonly error = signal<string | null>(null);

  public constructor() {
    this.load();
  }

  public load = (): void => {
    this.error.set(null);

    this._http
      .get<SampleDocumentPage>('/api/documents', {
        params: {
          page: '0',
          size: '5',
          sort: 'createdDate,desc',
        },
      })
      .pipe(take(1))
      .subscribe({
        next: (response: SampleDocumentPage) => this.response.set(response),
        error: (error: unknown) => this.error.set(String(error)),
      });
  };
}
