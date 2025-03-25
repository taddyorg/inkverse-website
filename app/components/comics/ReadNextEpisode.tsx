import { Link } from 'react-router-dom';

import type { ComicIssue, ComicSeries } from '@/shared/graphql/types';
import { getThumbnailImageUrl } from '@/public/comicissue';
import { getInkverseUrl } from '@/public/utils';

interface ReadNextEpisodeProps {
  comicissue: ComicIssue;
  comicseries: ComicSeries;
  showEmptyState?: boolean;
  firstTextCTA?: string;
  secondTextCTA?: string;
}

export function ReadNextEpisode({ 
  comicissue, 
  comicseries,
  showEmptyState = true, 
  firstTextCTA = 'NEXT', 
  secondTextCTA = 'EPISODE' 
}: ReadNextEpisodeProps) {
  if (!comicissue) {
    if (!showEmptyState) { return null; }
    return (
      <div className="w-full mt-6 px-4">
        <div className="text-center mt-8">
          <p className="text-lg font-medium">You are up to date with this series!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-6 px-4 lg:px-8">
      <Link 
        to={getInkverseUrl({ type: 'comicissue', uuid: comicissue.uuid, name: comicissue.name, shortUrl: comicseries.shortUrl }) || ''}
        className="block w-full overflow-hidden"
      >
        <div className="flex items-center p-4 bg-white rounded-3xl border-2 border-brand-pink">
          {comicissue.thumbnailImageAsString && (
            <div>
              <img
                src={getThumbnailImageUrl({ thumbnailImageAsString: comicissue.thumbnailImageAsString })}
                alt="Next Episode Thumbnail"
                className="w-32 h-32 rounded-2xl object-cover"
              />
            </div>
          )}
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-brand-pink">{firstTextCTA}</p>
            <p className="text-2xl font-bold text-brand-pink">{secondTextCTA}</p>
          </div>
        </div>
      </Link>
    </div>
  );
} 