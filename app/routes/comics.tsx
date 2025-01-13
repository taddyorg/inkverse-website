import type { LoaderFunctionArgs, MetaFunction } from 'react-router-dom';
import { useLoaderData } from 'react-router';

// import { SimpleLoadingComponent } from '@/components/ui';
import ComicSeriesDetails from '../components/comics/ComicSeriesDetails';
// import ComicRecommendations from '@/components/comics/ComicRecommendations';
// import ComicIssuesBox from '@/components/comics/ComicIssuesBox';
// import SEO from '@/components/seo';

import { loadComicSeries } from '@/lib/loader/comics.server';
import { getMetaTags } from '@/lib/seo';
import { getInkverseUrl, InkverseUrlType, inkverseWebsiteUrl } from '@/public/utils';
import { getBannerImageUrl } from '@/public/comicseries';

// import ComicSeriesDetails from '@/components/comics/ComicSeriesDetails';
// import { getComicInfoScreen, comicInfoReducer } from '@/shared/dispatch/comic_info';
// import { getComicSeriesTitle, getComicSeriesDescription, getComicSeriesUrl, getComicSeriesImageUrl } from './helper';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) { return []; }
  else if (!data.comicseries) { return []; }
  return getMetaTags(
    data.comicseries.name, 
    data.comicseries.description,
    `${inkverseWebsiteUrl}${getInkverseUrl({ type: InkverseUrlType.COMICSERIES, shortUrl: data.comicseries.shortUrl })}`,
    getBannerImageUrl({ bannerImageAsString: data.comicseries.bannerImageAsString }),
  );
};

export const loader = async ({ params, request, context }: LoaderFunctionArgs) => {
  return await loadComicSeries({ params, request, context });
};

function ComicSeriesScreen() {
  const comicSeriesData = useLoaderData<typeof loader>();
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
      <ComicSeriesDetails 
        comicseries={comicSeriesData?.comicseries} 
        firstIssue={comicSeriesData?.issues?.[0]}
        pageType="comicseries" 
      />
    </div>
  );
}

export default ComicSeriesScreen;