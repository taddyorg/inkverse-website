import { Link } from 'react-router-dom';
import { MdLock } from 'react-icons/md';

import { prettyFormattedDate, prettyFormattedFreeInDays } from '@/shared/utils/date';
import { getThumbnailImageUrl } from '@/public/comicseries';
import { getInkverseUrl, InkverseUrlType } from '@/public/utils';
import type { ComicSeries, ComicIssue } from '@/shared/graphql/types';

type ComicIssueDetailsProps = {
  comicseries: ComicSeries,
  comicissue: ComicIssue,
  position: number,
};

export const ComicIssueDetails = ({ comicseries, comicissue, position }: ComicIssueDetailsProps) => {
  const freeInDaysText = prettyFormattedFreeInDays(comicissue.dateExclusiveContentAvailable || undefined);
  const isPatreonExclusive = comicissue.scopesForExclusiveContent && comicissue.scopesForExclusiveContent.includes('patreon');

  const dateAndFreeContent = (
    <div className="text-sm">
      {comicissue.datePublished && prettyFormattedDate(new Date(comicissue.datePublished * 1000))}
      {freeInDaysText && freeInDaysText > 0 && (
        <>
          <span className="mx-1">·</span>
          <span className="text-brand-pink">{`Free in ${freeInDaysText} day${freeInDaysText > 1 ? 's' : ''}`}</span>
        </>
      )}
    </div>
  );

  const linkToComicIssue = getInkverseUrl({ type: InkverseUrlType.COMICISSUE, shortUrl: comicseries.shortUrl, name: comicissue.name, uuid: comicissue.uuid });
  if (!linkToComicIssue) {
    return <></>;
  }

  if (isPatreonExclusive) {
    return (
      <ComicIssueDetailsWrapper comicissue={comicissue} position={position} isPatreonExclusive={true}>
        <div className="text-sm">
          {dateAndFreeContent}
          <p className="font-bold mt-1 text-brand-pink">
            PATREON EXCLUSIVE - Read on Inkverse Mobile app
          </p>
        </div>
      </ComicIssueDetailsWrapper>
    );
  }

  return (
    <Link to={linkToComicIssue} className="block">
      <ComicIssueDetailsWrapper comicissue={comicissue} position={position}>
        {dateAndFreeContent}
      </ComicIssueDetailsWrapper>
    </Link>
  );
}

type ComicIssueDetailsWrapperProps = {
  children?: React.ReactNode,
  comicissue: ComicIssue, 
  position: number,
  isPatreonExclusive?: boolean 
}

const ComicIssueDetailsWrapper = ({ 
  children, 
  comicissue, 
  position, 
  isPatreonExclusive 
}: ComicIssueDetailsWrapperProps) => (
  <div className="flex justify-between items-center h-16 pr-4 mb-2">
    <div className="flex items-center">
      <div className={`w-16 h-16 mr-4 ${isPatreonExclusive ? 'relative' : ''}`}>
        <img 
          src={getThumbnailImageUrl({ thumbnailImageAsString: comicissue.thumbnailImageAsString })} 
          alt={comicissue.name || ''}
          className={`w-full h-full rounded-2xl object-cover ${isPatreonExclusive ? 'opacity-50' : 'opacity-100'}`} 
        />
        {isPatreonExclusive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <MdLock size={24} className="text-white" />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <h2 className="text-base font-normal m-0">{comicissue.name}</h2>
        {children}
      </div>
    </div>
    <span className="text-base">#{position + 1}</span>
  </div>
);