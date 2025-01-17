import type { LoaderFunctionArgs, MetaFunction } from 'react-router-dom';
import { useLoaderData } from 'react-router';

// import { SimpleLoadingComponent } from '@/components/ui';
import { ComicSeriesDetails, ComicSeriesPageType } from '../components/comics/ComicSeriesDetails';

import { loadSearch } from '@/lib/loader/search.server';
import { getMetaTags } from '@/lib/seo';
import { getInkverseUrl, InkverseUrlType, inkverseWebsiteUrl } from '@/public/utils';

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) { return []; }
  if (!data.search) { return []; }

  const searchTerm = params.term || '';
  const searchTypes = params.types || 'comics';

  return getMetaTags(
    `Search for ${searchTypes.split(',').join('& ')} with '${searchTerm}'`,
    `Search for comics, creators, lists, and more on Inkverse.`,
    `${inkverseWebsiteUrl}${getInkverseUrl({ type: InkverseUrlType.SEARCH, term: searchTerm, types: searchTypes.split(',') })}`,
  );
};

export const loader = async ({ params, request, context }: LoaderFunctionArgs) => {
  return await loadSearch({ params, request, context });
};

function SearchScreen() {
  const searchData = useLoaderData<typeof loader>();
  // const { match = {}, location, comicseries:SSRComicseries } = props;

  // const [ comicseriesQuery, comicseriesQueryDispatch] = useReducer(comicInfoReducer, {});
  // const { isLoading, comicseries:CSRComicseries, issues, recommendations } = comicseriesQuery;

  // const comicseries = CSRComicseries || SSRComicseries;

  // useEffect(() => {
  //   const uuid = location.state
  //     ? location.state.passedInUuid
  //     : comicseries?.uuid;

  //   if (!uuid) { return; }

  //   getComicInfoScreen({ uuid }, comicseriesQueryDispatch);
  // }, [comicseries?.uuid, location.state?.passedInUuid]);

  // if (!comicseries) {
  //   return (
  //     <SimpleLoadingComponent />
  //   )
  // }
  
  return (
    <div className="max-w-3xl mx-auto sm:p-6 lg:p-8">
      {searchData?.search?.comicSeries?.filter(comicseries => comicseries !== null).map((comicseries) => (
        <ComicSeriesDetails 
          key={comicseries.uuid}
          comicseries={comicseries} 
          pageType={ComicSeriesPageType.SEARCH}
        />
      ))}
    </div>
  );
}

export default SearchScreen;