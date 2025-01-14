import { Link } from "react-router";
import { FaPlay } from "react-icons/fa";

import { Section } from '../ui';

import type { ComicIssue, ComicSeries } from '@/shared/graphql/types';
import { getInkverseUrl, InkverseUrlType } from '@/public/utils';
import { getPrettyGenre } from '@/public/genres';
import { getCoverImageUrl, getThumbnailImageUrl } from '@/public/comicseries';
import { getAvatarImageUrl } from '@/public/creator';

type ComicSeriesPageType = 'recently-added' | 'search' | 'comicseries';

type ComicSeriesDetailsProps = {
  comicseries: ComicSeries | null | undefined;
  firstIssue: ComicIssue | null | undefined;
  pageType: ComicSeriesPageType;
}

function ComicSeriesDetails(props: ComicSeriesDetailsProps){
  const { comicseries, firstIssue, pageType } = props;

  if (!comicseries) { return <></>; }

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
          <p className='mt-2'>{comicseries?.description}</p>
        </div>
      </div>
      <div className='flex flex-row mt-4 justify-end'>
        <ReadFirstIssueButton comicseries={comicseries} firstIssue={firstIssue} />
        {/* <RecommendButton /> */}
        {/* <SaveButton /> */}
      </div>
    </Section>
  );
}

const Name = ({ comicseries, pageType }: { comicseries: ComicSeries, pageType: ComicSeriesPageType }) => {
  return (<h1 className="mt-4 sm:mt-0 font-bold text-xl">{comicseries.name}</h1>);
}

const CoverArt = ({ comicseries, pageType }: { comicseries: ComicSeries, pageType: ComicSeriesPageType }) => {
  if (pageType === 'recently-added'){
    return (
      <img
        src={getCoverImageUrl({ coverImageAsString: comicseries.coverImageAsString }) || undefined}
        alt={`${comicseries.name} comic cover art`}
        className="h-90 aspect-4/6 rounded-sm object-contain object-center mr-2"
      />
    );
  }else if (pageType === 'search'){
    return (
      <img
        src={getThumbnailImageUrl({ thumbnailImageAsString: comicseries.thumbnailImageAsString }) || undefined}
        alt={`${comicseries.name} thumbnail art`}
        className="h-20 aspect-1 rounded-sm object-contain object-center mr-2"
      />
    );
  }

  return (
    <img
      src={getCoverImageUrl({ coverImageAsString: comicseries.coverImageAsString }) || undefined}
      alt={`${comicseries.name} comic cover art`}
      className="h-90 sm:h-60 aspect-4/6 rounded-sm object-contain object-center mr-2"
    />
  );
}

function formatGenresString({ comicseries }: { comicseries: ComicSeries }) {
  const genres = [ comicseries.genre0, comicseries.genre1, comicseries.genre2 ];
  return genres.filter(Boolean).map((genre) => genre && getPrettyGenre(genre)).join('  •  ');
};

const Genre = ({ comicseries, pageType }: { comicseries: ComicSeries, pageType: ComicSeriesPageType }) => {
  return (
    <p className='mt-2 text-brand-pink font-semibold'>{formatGenresString({ comicseries })}</p>
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
            className='h-10 aspect-1 rounded-sm object-contain object-center mr-2' 
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

export default ComicSeriesDetails;