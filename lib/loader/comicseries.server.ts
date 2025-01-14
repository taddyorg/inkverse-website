import { type LoaderFunctionArgs } from "react-router";
import { getApolloClient } from "@/lib/apollo/client.server";
import { type GetComicSeriesQuery, type GetComicSeriesQueryVariables, GetComicSeries, type GetMiniComicSeriesQuery, type GetMiniComicSeriesQueryVariables, GetMiniComicSeries, SortOrder } from "@/shared/graphql/operations";
import { handleLoaderError } from "./error-handler";

export type ComicSeriesLoaderData = {
  comicseries: GetComicSeriesQuery['getComicSeries'];
  issues: NonNullable<GetComicSeriesQuery['getIssuesForComicSeries']>['issues'] | null;
  apolloState: Record<string, any>;
};

export async function loadComicSeries({ params, request, context }: LoaderFunctionArgs): Promise<ComicSeriesLoaderData> {
  const { shortUrl } = params;

  const client = getApolloClient(request);

  try {
    // Get comic series data first
    const getComicSeriesUuid = await client.query<GetMiniComicSeriesQuery, GetMiniComicSeriesQueryVariables>({
      query: GetMiniComicSeries,
      variables: { shortUrl },
    });

    if (!getComicSeriesUuid.data?.getComicSeries || !getComicSeriesUuid.data?.getComicSeries.uuid) {
      throw new Response("Not Found", { status: 404 });
    }

    // Get comic series data first
    const comicSeriesResult = await client.query<GetComicSeriesQuery, GetComicSeriesQueryVariables>({
      query: GetComicSeries,
      variables: { uuid: getComicSeriesUuid.data?.getComicSeries.uuid, sortOrderForIssues: SortOrder.OLDEST, limitPerPageForIssues: 1000, pageForIssues: 1 },
    });

    if (!comicSeriesResult.data?.getComicSeries) {
      throw new Response("Not Found", { status: 404 });
    }

    const state = client.extract();

    // Return immediately with comic series, but defer user data
    return {
      comicseries: comicSeriesResult.data.getComicSeries,
      issues: comicSeriesResult.data.getIssuesForComicSeries?.issues,
      apolloState: state,
    };
    
  } catch (error) {
    handleLoaderError(error, 'Comic Series');
  }
}