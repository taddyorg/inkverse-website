import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLock } from 'react-icons/md';

import { Section } from '../ui';

import { prettyFormattedDate, prettyFormattedFreeInDays } from '@/shared/utils/date';
import { getThumbnailImageUrl } from '@/public/comicseries';
import { getInkverseUrl, InkverseUrlType } from '@/public/utils';
import type { ComicSeries, ComicIssue } from '@/shared/graphql/types';

type ComicIssuesBoxProps = {
  comicseries: ComicSeries | null | undefined;
  issues: ComicIssue[] | null | undefined;
}
  
export function ComicIssuesList(props: ComicIssuesBoxProps) {
  const { comicseries, issues } = props;
  const [showAll, setShowAll] = useState(false);

  if (!comicseries || !issues) {
    return <></>;
  }

  return (
    <Section className="mt-2 mb-4 px-4 sm:px-6 lg:px-8 rounded-md">
      <h2 className='text-2xl font-semibold mb-4'>Episodes</h2>
      {issues.map((comicissue, index) => (
        <ComicIssueDetails
          key={comicissue.uuid}
          comicseries={comicseries}
          comicissue={comicissue}
          position={index}
        />
      ))}
      {/* {issues.length > 5 && (
        <div className="flex justify-center mt-6">
          <button
            className="w-full max-w-md px-4 py-2 text-brand-pink border-2 border-brand-pink hover:bg-brand-pink hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black rounded-full transition-colors"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'Show All Episodes'}
          </button>
        </div>
      )} */}
    </Section>
  );
}

type ComicIssueLayoutProps = {
  children?: React.ReactNode,
  comicissue: ComicIssue, 
  position: number,
  isPatreonExclusive?: boolean 
}

const ComicIssueItem = ({ 
  children, 
  comicissue, 
  position, 
  isPatreonExclusive 
}: ComicIssueLayoutProps) => (
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

const ComicIssueDetails = ({ comicseries, comicissue, position }: { comicseries: ComicSeries, comicissue: ComicIssue, position: number }) => {
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

  if (isPatreonExclusive) {
    return (
      <ComicIssueItem comicissue={comicissue} position={position} isPatreonExclusive={true}>
        <div className="text-sm">
          {dateAndFreeContent}
          <p className="font-bold mt-1 text-brand-pink">
            PATREON EXCLUSIVE - Read on Inkverse Mobile app
          </p>
        </div>
      </ComicIssueItem>
    );
  }

  const linkToComicIssue = getInkverseUrl({ type: InkverseUrlType.COMICISSUE, shortUrl: comicseries.shortUrl, name: comicissue.name, uuid: comicissue.uuid });
  if (!linkToComicIssue) {
    return <></>;
  }

  return (
    <Link to={linkToComicIssue} className="block">
      <ComicIssueItem comicissue={comicissue} position={position}>
        {dateAndFreeContent}
      </ComicIssueItem>
    </Link>
  );
}