export const removeHtml = (text: string) => {
  return text.replace(/<[^>]*>?/g, ' ');
};
