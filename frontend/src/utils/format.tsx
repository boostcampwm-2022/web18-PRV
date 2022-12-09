import { MAX_TITLE_LENGTH } from '../constants/main';
import { Emphasize } from '../style/styleUtils';

export const removeTag = (text: string) => {
  return text.replace(/<[^>]*>?/g, ' ');
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

export const DOI_REGEXP = new RegExp(/^[\d]{2}\.[\d]{1,}\/.*/);
