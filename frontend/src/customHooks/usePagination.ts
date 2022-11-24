import { useMemo } from 'react';

const usePagination = (page: number, totalPages: number, range: number) => {
  const prevLastPage = useMemo<number>(() => (Math.ceil(page / range) - 1) * range, [page, range]);

  const nextFirstPage = useMemo<number>(() => Math.ceil(page / range) * range + 1, [page, range]);

  const currentPages = useMemo<number[]>(() => {
    return Array.from(
      { length: Math.min(range, totalPages - (Math.ceil(page / range) - 1) * range) },
      (_, i) => (Math.ceil(page / range) - 1) * range + i + 1,
    );
  }, [page, range, totalPages]);

  return { prevLastPage, nextFirstPage, currentPages };
};

export default usePagination;
