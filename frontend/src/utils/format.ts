export const removeTag = (text: string) => {
  return text.replace(/<[^>]*>?/g, ' ');
};
