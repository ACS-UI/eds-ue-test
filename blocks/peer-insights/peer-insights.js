export default function decorate(block) {
  [...block.children].forEach((row) => {
    if (row.children.length === 1 && !row.querySelector('picture, img, h3, h4, h5, h6')) {
      row.classList.add('peer-insights-introduction');
      return;
    }

    row.classList.add('peer-insights-card');
    row.setAttribute('role', 'article');
    const cells = [...row.children];
    const image = cells.find((cell) => cell.querySelector('picture, img'));
    if (image) image.classList.add('peer-insights-card-image');
    else row.classList.add('peer-insights-card-text-only');
    const body = cells.at(-1);
    if (body && body !== image) body.classList.add('peer-insights-card-body');
  });
}
