import { type LoaderFunctionArgs } from "react-router";
import { getApolloClient } from "@/lib/apollo/client.server";
import { type GetComicSeriesQuery, type GetComicSeriesQueryVariables, GetComicSeries } from "@/shared/graphql/operations";
import { handleLoaderError } from "./error-handler";

export type ComicSeriesLoaderData = {
  comicseries: GetComicSeriesQuery['getComicSeries'];
  apolloState: Record<string, any>;
};

export async function loadComicSeries({ params, request, context }: LoaderFunctionArgs): Promise<ComicSeriesLoaderData> {
  const { shortUrl } = params;

  const client = getApolloClient(request);

  try {
    // Get comic series data first
    const comicSeriesResult = await client.query<GetComicSeriesQuery, GetComicSeriesQueryVariables>({
      query: GetComicSeries,
      variables: { shortUrl },
    });

    if (!comicSeriesResult.data?.getComicSeries) {
      throw new Response("Not Found", { status: 404 });
    }

    const state = client.extract();

    // Return immediately with comic series, but defer user data
    return {
      comicseries: comicSeriesResult.data.getComicSeries,
      apolloState: state,
    };
    
  } catch (error) {
    handleLoaderError(error, 'Comic Series');
  }
}