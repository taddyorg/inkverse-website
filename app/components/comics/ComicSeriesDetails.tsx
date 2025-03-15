import { Link } from "react-router";
import { FaPlay } from "react-icons/fa";

import { Section } from '../ui';

import type { ComicIssue, ComicSeries } from '@/shared/graphql/types';
import { getInkverseUrl, InkverseUrlType } from '@/public/utils';
import { getPrettyGenre } from '@/public/genres';
import { ComicSeriesImageVariant, getBannerImageUrl, getCoverImageUrl, getThumbnailImageUrl } from '@/public/comicseries';
import { getAvatarImageUrl } from '@/public/creator';

export enum ComicSeriesPageType {
  COMICSERIES_SCREEN = 'COMICSERIES_SCREEN',
  FEATURED_BANNER = 'FEATURED_BANNER',
  MOST_POPULAR = 'MOST_POPULAR',
  COVER = 'COVER',
  SEARCH = 'SEARCH',
  LIST_ITEM = 'LIST_ITEM',
}

type ComicSeriesDetailsProps = {
  comicseries: ComicSeries | null | undefined;
  pageType: ComicSeriesPageType;
  firstIssue?: ComicIssue | null | undefined;
  index?: number;
}

export function ComicSeriesDetails(props: ComicSeriesDetailsProps){
  const { comicseries, firstIssue, pageType } = props;

  if (!comicseries) { return <></>; }

  if (pageType === ComicSeriesPageType.MOST_POPULAR) {
      const link = getInkverseUrl({ type: InkverseUrlType.COMICSERIES, shortUrl: comicseries.shortUrl });
      if (!link) { return <></>; }

      return (
        <Link to={link} className="flex flex-row">
          <CoverArt comicseries={comicseries} pageType={pageType} />
          <div className="flex flex-col px-2">
            <Name comicseries={comicseries} pageType={pageType} />
            <Genre comicseries={comicseries} pageType={pageType} />
          </div>
        </Link>
      );
  }

  else if (pageType === ComicSeriesPageType.FEATURED_BANNER) {
      const link = getInkverseUrl({ type: InkverseUrlType.COMICSERIES, shortUrl: comicseries.shortUrl });
      if (!link) { return <></>; }

      return (
        <Link to={link}>
          <CoverArt comicseries={comicseries} pageType={pageType} />
        </Link>
      );
  }

  else if (pageType === ComicSeriesPageType.COVER) {
    const link = getInkverseUrl({ type: InkverseUrlType.COMICSERIES, shortUrl: comicseries.shortUrl });
    if (!link) { return <></>; }

      return (
        <Link to={link}>
          <CoverArt comicseries={comicseries} pageType={pageType} />
        </Link>
      );
  }

  else if (pageType === ComicSeriesPageType.SEARCH) {
    const link = getInkverseUrl({ type: InkverseUrlType.COMICSERIES, shortUrl: comicseries.shortUrl });
    if (!link) { return <></>; }
    return (
      <Link to={link} className="flex flex-row p-6" onClick={() => {
        window.dispatchEvent(new Event('closeSearchBox'));
      }}>
        <CoverArt comicseries={comicseries} pageType={pageType} />
        <div className="w-2/3 pl-4">
          <Name comicseries={comicseries} pageType={pageType}/>
          <div className='flex flex-row justify-between'>
            <Genre comicseries={comicseries} pageType={pageType}/>
          </div>
        </div>
      </Link>
    );
  }
  

  else if (pageType === ComicSeriesPageType.LIST_ITEM) {
    const link = getInkverseUrl({ type: InkverseUrlType.COMICSERIES, shortUrl: comicseries.shortUrl });
    if (!link) { return <></>; }

    return (
      <Link to={link} className="block w-full">
        <div className="flex gap-6 py-6">
          <span className="text-lg font-semibold">{props.index || 1}.</span>
          <div className="flex flex-1 gap-6">
            <CoverArt comicseries={comicseries} pageType={pageType} />
            <div className="flex-1">
              <Name comicseries={comicseries} pageType={pageType}/>
              <Genre comicseries={comicseries} pageType={pageType}/>
              <p className='mt-3'>{comicseries?.description}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  
  return (
    <Section className="py-6 mt-2 px-4 sm:px-6 lg:px-8 rounded-md">
      <div className="flex flex-col sm:flex-row ">
        <CoverArt comicseries={comicseries} pageType={pageType} />
        <div className="sm:w-2/3 sm:pl-4">
          <Name comicseries={comicseries} pageType={pageType}/>
          <div className='flex flex-row justify-between'>
            <Genre comicseries={comicseries} pageType={pageType}/>
            <Counts comicseries={comicseries} pageType={pageType}/>
          </div>
          <Creators comicseries={comicseries} pageType={pageType}/>
          <p className='mt-2'>{comicseries?.description?.trim()}</p>
        </div>
      </div>
      <div className='flex flex-row mt-4 justify-end'>
        {/* <ReadFirstIssueButton comicseries={comicseries} firstIssue={firstIssue} /> */}
        {/* <RecommendButton /> */}
        {/* <SaveButton /> */}
      </div>
    </Section>
  );
}

const Name = ({ comicseries, pageType }: { comicseries: ComicSeries, pageType: ComicSeriesPageType }) => {
  switch (pageType) {
    case ComicSeriesPageType.COMICSERIES_SCREEN:
      return <h1 className="mt-4 sm:mt-0 font-bold text-xl">{comicseries.name}</h1>;
    case ComicSeriesPageType.LIST_ITEM:
      return <h2 className="font-bold text-xl">{comicseries.name}</h2>;
    default:
      return <h2 className="mt-4 sm:mt-0 font-bold text-xl">{comicseries.name}</h2>;
  }
}

const CoverArt = ({ comicseries, pageType }: { comicseries: ComicSeries, pageType: ComicSeriesPageType }) => {
  switch (pageType) {
    case ComicSeriesPageType.FEATURED_BANNER:
      return (
        <img
          src={getBannerImageUrl({ bannerImageAsString: comicseries.bannerImageAsString, variant: ComicSeriesImageVariant.LARGE }) || undefined}
          alt={`${comicseries.name} banner art`}
          className="w-full aspect-[16/9] max-h-[470px] rounded-lg object-cover object-center"
        />
      );
    case ComicSeriesPageType.MOST_POPULAR:
      return (
        <img
          src={getThumbnailImageUrl({ thumbnailImageAsString: comicseries.thumbnailImageAsString }) || undefined}
          alt={`${comicseries.name} thumbnail art`}
          className="h-32 aspect-1 rounded-sm object-contain object-center mr-2"
        />
    );
    case ComicSeriesPageType.COVER:
      return (
        <img
          src={getCoverImageUrl({ coverImageAsString: comicseries.coverImageAsString }) || undefined}
          alt={`${comicseries.name} comic cover art`}
          className="h-40 sm:h-60 aspect-4/6 rounded-sm object-contain object-center mr-2"
        />
    );
    case ComicSeriesPageType.SEARCH:
    case ComicSeriesPageType.LIST_ITEM:
      return (
        <img
          src={getThumbnailImageUrl({ thumbnailImageAsString: comicseries.thumbnailImageAsString }) || undefined}
          alt={`${comicseries.name} thumbnail art`}
          className="h-20 aspect-1 rounded-sm object-contain object-center mr-2"
        />
    );
    default:
      return (
        <img
          src={getCoverImageUrl({ coverImageAsString: comicseries.coverImageAsString }) || undefined}
          alt={`${comicseries.name} comic cover art`}
          className="h-90 sm:h-60 aspect-4/6 rounded-sm object-contain object-center mr-2"
        />
      );
  }
}

function formatGenresString({ comicseries }: { comicseries: ComicSeries }) {
  const genres = [ comicseries.genre0, comicseries.genre1, comicseries.genre2 ];
  return genres.filter(Boolean).map((genre) => genre && getPrettyGenre(genre)).join('  •  ');
};

const Genre = ({ comicseries, pageType }: { comicseries: ComicSeries, pageType: ComicSeriesPageType }) => {
  if (pageType === ComicSeriesPageType.MOST_POPULAR) {
    return (
      <p className='mt-2 font-semibold'>{formatGenresString({ comicseries })}</p>
    );
  }

  return (
    <p className='mt-2 font-semibold'>{formatGenresString({ comicseries })}</p>
  );
}

const Counts = ({ comicseries, pageType }: { comicseries: ComicSeries, pageType: ComicSeriesPageType }) => {
  return (
    <div className='mt-2 flex flex-row gap-2'>
      {/* <div className='flex items-center'>
        <FaThumbsUp className='mr-2 text-brand-pink' />
        <p className='text-brand-pink font-bold'>{comicseries.recommendationsCount} recommendations</p>
      </div>
      <div className='flex items-center'>
        <FaBookmark className='mr-2 text-brand-pink' />
        <p className='text-brand-pink font-bold'>{comicseries.issuesCount} issues</p>
      </div>
      {comicseries.recommendationsCount > 0 && (
        <div className='flex items-center'>
          <FaThumbsUp className='mr-2 text-brand-pink' />
          <p className='text-brand-pink font-bold'>{comicseries.recommendationsCount}</p>
        </div>
      )}
      {comicseries.saveCount > 0 && (
        <div className='flex items-center'>
          <FaBookmark className='mr-2 text-brand-pink' />
          <p className='text-brand-pink font-bold'>{comicseries.saveCount}</p>
        </div>
      )} */}
    </div>
  );
}

const Creators = ({ comicseries, pageType }: { comicseries: ComicSeries, pageType: ComicSeriesPageType }) => {
  if (!comicseries.creators || comicseries.creators.length === 0) {
    return <></>;
  }

  const creators = comicseries.creators.filter((creator) => creator !== null);
  
  return (
    <div className='mt-2 flex flex-row gap-2'>
      {creators.map((creator) => {
        const link = getInkverseUrl({ type: InkverseUrlType.CREATOR, shortUrl: creator.shortUrl });
        if (!link) { return <></> }
        return (
          <Link 
            key={creator.uuid}
            to={link} 
            className='flex items-center' 
          >
          <img 
            src={getAvatarImageUrl({ avatarImageAsString: creator.avatarImageAsString })} 
            alt={creator.name || undefined} 
            className='h-8 aspect-1 rounded-sm object-contain object-center mr-2' 
          />
          <p className='font-semibold'>{creator.name}</p>
          </Link>
        );
      })}
    </div> 
  );
}

// const RecommendButton = ({ isLoading, recommendHandler }) => {
//     return (
//         <a href='https://inkverse.co/download' target='_blank' className={`flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold transition-colors duration-150 bg-background-primary border-2 border-button-disabled text-text-primary hover:bg-brand-pink hover:text-white hover:border-brand-pink`}>
//             <div className="flex items-center">
//                 <FaThumbsUp
//                     className={`mr-2 text-text-primary group-hover:text-white`}
//                     size={16}
//                 />
//                 <span>Recommend</span>
//             </div>
//         </a>
//     );
// };

// const SaveButton = ({ isLoading, saveHandler }) => {
//     return (
//         <a href='https://inkverse.co/download' target='_blank' className={`flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold transition-colors duration-150 bg-background-primary border-2 border-button-disabled text-text-primary hover:bg-brand-pink hover:text-white hover:border-brand-pink ml-2`}>
//             <div className="flex items-center">
//                 <FaBookmark
//                     className={`mr-2 text-text-primary`}
//                     size={16}
//                 />
//                 <span>Save</span>
//             </div>
//         </a>
//     );
// };

const ReadFirstIssueButton = ({ comicseries, firstIssue }: { comicseries: ComicSeries, firstIssue: ComicIssue | null | undefined }) => {
  if (!firstIssue) { return <></>; }
  const link = getInkverseUrl({ type: InkverseUrlType.COMICISSUE, shortUrl: comicseries.shortUrl, name: firstIssue.name, uuid: firstIssue.uuid });
  if (!link) { return <></>; }
  
  return (
    <Link 
      to={link} 
      className='flex items-center justify-center px-4 py-2 mr-2 rounded-full text-sm font-bold transition-colors duration-150 text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
    >
      <FaPlay className="mr-2" size={12} />
      <span>Read Ep 1</span>
    </Link>
  );
}