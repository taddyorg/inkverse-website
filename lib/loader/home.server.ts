import { type LoaderFunctionArgs } from "react-router";
import { getApolloClient } from "@/lib/apollo/client.server";
import { handleLoaderError } from "./error-handler";
import { HomeScreen, type ComicSeries, type HomeScreenQuery, type List } from "@/shared/graphql/operations";

export type HomeScreenLoaderData = {
  featuredComicSeries: ComicSeries[] | null | undefined;
  curatedLists: List[] | null | undefined;
  mostPopularComicSeries: ComicSeries[] | null | undefined;
  recentlyAddedComicSeries: ComicSeries[] | null | undefined;
  recentlyUpdatedComicSeries: ComicSeries[] | null | undefined;
  apolloState: Record<string, any>;
};

export async function loadHomeScreen({ params, request, context }: LoaderFunctionArgs): Promise<HomeScreenLoaderData> {
  const client = getApolloClient(request);

  try {
    const homeScreenResult = await client.query<HomeScreenQuery>({
      query: HomeScreen,
    });

    if (!homeScreenResult.data) {
      throw new Response("Not Found", { status: 404 });
    }

    const featuredSeries = homeScreenResult.data.getFeaturedComicSeries?.comicSeries?.filter(
      (series): series is ComicSeries => series !== null
    );

    // Select random featured series
    const randomFeaturedSeries = featuredSeries?.length 
      ? [featuredSeries[Math.floor(Math.random() * featuredSeries.length)]]
      : [];

    const state = client.extract();

    const mostPopularComicSeries = homeScreenResult.data.getMostPopularComicSeries?.comicSeries?.filter((series): series is ComicSeries => series !== null).slice(0, 6);
    const suffledMostPopularComicSeries = mostPopularComicSeries?.sort(() => Math.random() - 0.5).slice(0, 6);

    return {
      featuredComicSeries: randomFeaturedSeries,
      curatedLists: homeScreenResult.data.getCuratedLists?.lists?.filter((list): list is List => list !== null),
      mostPopularComicSeries: suffledMostPopularComicSeries,
      recentlyAddedComicSeries: homeScreenResult.data.getRecentlyAddedComicSeries?.comicSeries?.filter((series): series is ComicSeries => series !== null),
      recentlyUpdatedComicSeries: homeScreenResult.data.getRecentlyUpdatedComicSeries?.comicSeries?.filter((series): series is ComicSeries => series !== null),
      apolloState: state,
    };
    
  } catch (error) {
    handleLoaderError(error, 'Comic Series');
  }
}