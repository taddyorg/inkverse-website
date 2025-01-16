import { Section } from '../ui';
import type { CreatorPageType } from './CreatorDetails';
import { ComicSeriesDetails, ComicSeriesPageType } from '../comics/ComicSeriesDetails';

import type { ComicSeries } from '@/shared/graphql/types.js';

type CreatorComicsProps = {
  comicseries?: ComicSeries[] | null | undefined;
  pageType: CreatorPageType;
}

export function CreatorComics(props: CreatorComicsProps){
  const { comicseries, pageType } = props;

  return (
    <Section className="px-4 py-2 mt-4 sm:px-6 lg:px-8 rounded-md">
      <div className="flex flex-col">
        <h2 className='text-xl font-bold mb-2'>Comics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {comicseries?.map((comicseries) => (
            <div key={comicseries.uuid}>
              <ComicSeriesDetails 
                comicseries={comicseries} 
                pageType={ComicSeriesPageType.COVER} 
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}