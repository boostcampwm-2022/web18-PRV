import { Emphasize } from '@/style/styleUtils';

const MAX_TITLE_LENGTH = 150;

export const removeTag = (text: string) => {
  return text?.replace(/<[^>]*>?/g, ' ') || '';
};

export const highlightKeyword = (text: string, keyword: string) => {
  const rawKeywordList = keyword.trim().toLowerCase().split(/\s/gi);

  return rawKeywordList.length > 0 && rawKeywordList.some((rawKeyword) => text.toLowerCase().includes(rawKeyword))
    ? text
        .split(new RegExp(`(${rawKeywordList.join('|')})`, 'gi'))
        .map((part, i) =>
          rawKeywordList.some((keywordPart) => part.trim().toLowerCase() === keywordPart) ? (
            <Emphasize key={i}>{part}</Emphasize>
          ) : (
            part
          ),
        )
    : text;
};

export const sliceTitle = (title: string) => {
  return title.length > MAX_TITLE_LENGTH ? `${title.slice(0, MAX_TITLE_LENGTH)}...` : title;
};

export const isDoiFormat = (doi: string) => {
  return RegExp(/^https:\/\/doi.org\/([\d]{2}\.[\d]{1,}\/.*)/i).test(doi);
};

export const getDoiKey = (doi: string) => {
  return doi.match(RegExp(/^https:\/\/doi.org\/([\d]{2}\.[\d]{1,}\/.*)/i))?.[1] || '';
};
