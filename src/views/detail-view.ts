export class DetailView {
  constructor(private readonly textarea: HTMLTextAreaElement) {}

  render(query: string): void {
    this.textarea.value = query;
  }
}
