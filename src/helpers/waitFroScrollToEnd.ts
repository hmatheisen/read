export const waitForScrollEnd = (element: HTMLElement): Promise<void> => {
  return new Promise(resolve => {
    // Try modern scrollend event first
    if ("onscrollend" in element) {
      element.addEventListener("scrollend", () => resolve(), { once: true });
    } else {
      // Fallback to polling
      const el = element as HTMLElement;
      let lastScrollLeft = el.scrollLeft;
      let sameCount = 0;

      const checkScroll = setInterval(() => {
        if (el.scrollLeft === lastScrollLeft) {
          sameCount++;
          if (sameCount >= 3) {
            // Stable for 3 checks (150ms)
            clearInterval(checkScroll);
            resolve();
          }
        } else {
          sameCount = 0;
          lastScrollLeft = el.scrollLeft;
        }
      }, 50);
    }
  });
};
