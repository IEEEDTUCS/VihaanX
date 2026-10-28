/**
 * The single source for edition metadata and gallery content.
 * Fill in verified images under frontend/public and supply paths like '/gallery/photo.jpg'.
 * Do not publish guessed years, themes, or captions.
 */
// Six intentionally unfilled slots: replace or remove as images are verified.
// Each entry has precisely { src, alt, caption, year }.
export const galleryPhotos = Array.from({ length: 6 }, () => ({
  src: '',
  alt: '',
  caption: '',
  year: null,
}));

export const pastEditions = [
  { src: '', alt: '', edition: '07', year: null, theme: '', href: '' },
  { src: '', alt: '', edition: '08', year: null, theme: '', href: '' },
  {
    src: '',
    alt: '',
    edition: '09',
    year: null,
    theme: '',
    href: 'https://9.vihaan.ieeedtu.in/',
  },
];
