import type { LoaderFunctionArgs, MetaFunction } from 'react-router-dom';
import { useLoaderData } from 'react-router';

// import { SimpleLoadingComponent } from '@/components/ui';
import { CreatorDetails } from '../components/creator/CreatorDetails';
import { CreatorComics } from '../components/creator/CreatorComics';

import { loadCreator } from '@/lib/loader/creator.server';
import { getMetaTags } from '@/lib/seo';
import { getInkverseUrl, inkverseWebsiteUrl } from '@/public/utils';
import { getAvatarImageUrl } from '@/public/creator';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) { return []; }
  else if (!data.creator) { return []; }
  return getMetaTags(
    data.creator.name, 
    data.creator.bio,
    `${inkverseWebsiteUrl}${getInkverseUrl({ type: "creator", shortUrl: data.creator.shortUrl })}`,
    getAvatarImageUrl({ avatarImageAsString: data.creator.avatarImageAsString }),
  );
};

export const loader = async ({ params, request, context }: LoaderFunctionArgs) => {
  return await loadCreator({ params, request, context });
};

function CreatorScreen() {
  const creatorData = useLoaderData<typeof loader>();
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
      <CreatorDetails 
        creator={creatorData?.creator} 
        pageType={'creator-screen'} 
      />
      <CreatorComics 
        comicseries={creatorData?.comicseries?.filter((comicseries) => comicseries !== null)} 
        pageType={'creator-screen'} 
      />
    </div>
  );
}

export default CreatorScreen;