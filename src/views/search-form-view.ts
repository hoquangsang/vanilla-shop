const HINT_ID = "search-hint";

export class SearchFormView {
  private readonly hint: HTMLElement;

  constructor(
    private readonly form: HTMLFormElement,
    private readonly input: HTMLInputElement,
  ) {
    // Created up front so screen readers already watch it when the error appears.
    this.hint = document.createElement("p");
    this.hint.id = HINT_ID;
    this.hint.setAttribute("role", "status");
    this.hint.className =
      "absolute top-full left-0 z-10 mt-1 bg-white px-1 text-sm text-primary";
    this.hint.hidden = true;
    this.form.append(this.hint);
    this.input.addEventListener("input", () => this.clearError());
  }

  bindSubmit(handler: (raw: string) => void): void {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      handler(this.input.value);
    });
  }

  showError(message: string): void {
    this.hint.textContent = message;
    this.hint.hidden = false;
    this.input.setAttribute("aria-invalid", "true");
    this.input.setAttribute("aria-describedby", HINT_ID);
    this.input.focus();
  }

  clearError(): void {
    this.hint.hidden = true;
    this.hint.textContent = "";
    this.input.removeAttribute("aria-invalid");
    this.input.removeAttribute("aria-describedby");
  }
}
