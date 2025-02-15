import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Link } from 'react-router-dom';
import { MdChevronLeft } from 'react-icons/md';
import { ImageWithLoader } from "../components/ui";
import { GridOfComicIssues } from "../components/comics/GridOfComicIssues";

import { getMetaTags } from "@/lib/seo";
import { loadComicIssue } from "@/lib/loader/comicissue.server";
import { inkverseWebsiteUrl, getInkverseUrl, InkverseUrlType } from "@/public/utils";
import type { ComicIssue } from '@/shared/graphql/operations';
import { getBannerImageUrl } from "@/public/comicissue";
import { getStoryImageUrl } from "@/public/comicstory";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) { return []; }
  else if (!data.comicissue) { return []; }
  return getMetaTags(
    data.comicissue.name, 
    data.comicissue.creatorNote,
    `${inkverseWebsiteUrl}${getInkverseUrl({ type: InkverseUrlType.COMICISSUE, shortUrl: data.comicseries?.shortUrl, name: data.comicissue.name, uuid: data.comicissue.uuid })}`,
    getBannerImageUrl({ bannerImageAsString: data.comicissue.bannerImageAsString }),
  );
};

export const loader = async ({ params, request, context }: LoaderFunctionArgs) => {
  return await loadComicIssue({ params, request, context });
};

export default function ComicIssue() {
  const { comicissue, comicseries, allIssues } = useLoaderData<typeof loader>();
  const isSkinnyReadingMode = true;
  const comicSeriesLink = getInkverseUrl({ type: InkverseUrlType.COMICSERIES, shortUrl: comicseries?.shortUrl });

  return (
    <div className={`mx-auto sm:p-6 lg:p-8 ${isSkinnyReadingMode ? 'max-w-xl' : 'max-w-3xl'}`}>
      <div className='flex flex-col py-4 sm:py-0'>
        <div className="flex items-center mb-2">
          {comicSeriesLink && (
            <Link to={comicSeriesLink} className="flex flex-row mr-2">
              <MdChevronLeft size={24} />
              <p className="font-semibold">All Episodes</p>
            </Link>
          )}
        </div>
        {comicissue?.stories && comicissue.stories.map((story) => {
          const storyImageUrl = getStoryImageUrl({ storyImageAsString: story?.storyImageAsString });
          if (!storyImageUrl) return null;

          return (
            <ImageWithLoader
              key={story?.uuid}
              className="w-full select-none pointer-events-none"
              src={storyImageUrl} />
          )
        })}
        <GridOfComicIssues
          comicseries={comicseries}
          comicissue={comicissue}
          allIssues={allIssues?.issues?.map((issue) => issue as ComicIssue) ?? []}
        />
      </div>
    </div>
  );
}