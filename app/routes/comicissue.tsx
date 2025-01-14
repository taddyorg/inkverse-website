import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";


import ComicIssueDetails from "../components/comics/ComicIssueDetails";

import { getMetaTags } from "@/lib/seo";
import type { ComicIssue } from '@/shared/graphql/operations';
import { loadComicIssue } from "@/lib/loader/comicissue.server";
import { inkverseWebsiteUrl } from "@/public/utils";
import { InkverseUrlType } from "@/public/utils";
import { getInkverseUrl } from "@/public/utils";
import { getBannerImageUrl } from "@/public/comicissue";

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

  return (
    <div className="max-w-3xl mx-auto sm:p-6 lg:p-8">
      <ComicIssueDetails 
        comicissue={comicissue} 
        comicseries={comicseries} 
        allIssues={allIssues?.issues?.map((issue) => issue as ComicIssue) ?? []} 
      />
    </div>
  );
}