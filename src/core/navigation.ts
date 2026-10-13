export interface PageNavigator {
  go(url: string): void;
}

export const browserNavigator: PageNavigator = {
  go: (url) => window.location.assign(url),
};
