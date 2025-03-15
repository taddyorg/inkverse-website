import { ComicSeriesDetails, ComicSeriesPageType } from '../comics/ComicSeriesDetails';
import { Section } from '../ui';
import type { List } from '@/shared/graphql/types';

export enum ListPageType {
  LIST_SCREEN = 'LIST_SCREEN',
}

type ListDetailsProps = {
  list?: List | null | undefined;
  pageType: ListPageType;
}

export function ListDetails({ list, pageType }: ListDetailsProps) {
  if (!list) { return null; }

  return (
    <Section className="px-4 py-6 mt-2 sm:px-6 lg:px-8 rounded-md">
      <div className="flex flex-col">
        <BannerImage list={list} />
        <Description list={list} />
        {list.comicSeries && list.comicSeries.length > 0 && list.comicSeries.filter((comicSeries) => comicSeries !== null).map((comicSeries, index) => (
          <ComicSeriesDetails 
            key={comicSeries.uuid}
            comicseries={comicSeries} 
            index={index + 1}
            pageType={ComicSeriesPageType.LIST_ITEM} 
          />
        ))}
      </div>
    </Section>
  );
}

type ListComponentProps = {
  list: List;
  pageType: ListPageType;
}

const Name = ({ list, pageType }: ListComponentProps) => {
  switch (pageType) {
    case ListPageType.LIST_SCREEN:
      return <h1 className="font-bold text-xl">{list.name}</h1>;
    default:
      return <h2 className="font-bold text-xl">{list.name}</h2>;
  }
}

const Description = ({ list }: { list: List }) => {
  if (!list.description) return null;
  return <p className="mt-4">{list.description}</p>;
}

const BannerImage = ({ list }: { list: List }) => {
  if (!list.bannerImageUrl) return null;
  return <img src={list.bannerImageUrl} alt={`${list.name} banner`} className="w-full object-cover" />;
}
