import { useState, useEffect, useCallback } from 'react';

export const useInfiniteScroll = (callback: () => void, hasMore: boolean) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 500
        && hasMore
        && !isFetching
      ) {
        setIsFetching(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isFetching]);

  useEffect(() => {
    if (!isFetching) return;
    callback();
    setIsFetching(false);
  }, [isFetching, callback]);

  return { isFetching };
};

