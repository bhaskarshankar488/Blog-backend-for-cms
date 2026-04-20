export const cleanText = (text) =>
  text
    .replace(/^'+|'+$/g, '')
    .replace(/,+$/, '')
    .trim();

faq: faq.map(f => ({
  question: cleanText(f.question),
  answer: cleanText(f.answer)
}))