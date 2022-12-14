import styled from 'styled-components';

export const Ellipsis = styled.span`
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  line-height: 1.1em;
`;

export const Emphasize = styled.span`
  color: #3244ff;
  font-weight: 700;
`;
