// Native buttons retain keyboard support; each page owns its local views.
document.querySelectorAll("[data-diagram]").forEach((diagram) => {
  const buttons = [...diagram.querySelectorAll("button[data-view]")];
  const panels = [...diagram.querySelectorAll("[data-panel]")];

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      buttons.forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== view;
      });
    });
  });
});
