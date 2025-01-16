import { type LoaderFunctionArgs } from "react-router";
import { getApolloClient } from "@/lib/apollo/client.server";
import { type GetCreatorQuery, GetCreator, type GetCreatorQueryVariables, GetMiniCreator, type GetMiniCreatorQuery, type GetMiniCreatorQueryVariables } from "@/shared/graphql/operations";
import { handleLoaderError } from "./error-handler";

export type CreatorLoaderData = {
  creator: GetCreatorQuery['getCreator'];
  comicseries: NonNullable<GetCreatorQuery['getCreator']>['comics'] | null | undefined;
  apolloState: Record<string, any>;
};

export async function loadCreator({ params, request, context }: LoaderFunctionArgs): Promise<CreatorLoaderData> {
  const { shortUrl } = params;

  const client = getApolloClient(request);

  try {
    // Get creator data first
    const getCreatorUuid = await client.query<GetMiniCreatorQuery, GetMiniCreatorQueryVariables>({
      query: GetMiniCreator,
      variables: { shortUrl },
    });

    if (!getCreatorUuid.data?.getCreator || !getCreatorUuid.data?.getCreator.uuid) {
      throw new Response("Not Found", { status: 404 });
    }

    // Get comic series data first
    const creatorResult = await client.query<GetCreatorQuery, GetCreatorQueryVariables>({
      query: GetCreator,
      variables: { uuid: getCreatorUuid.data?.getCreator.uuid },
    });

    if (!creatorResult.data?.getCreator) {
      throw new Response("Not Found", { status: 404 });
    }

    const state = client.extract();

    // Return immediately with comic series, but defer user data
    return {
      creator: creatorResult.data.getCreator,
      comicseries: creatorResult.data.getCreator.comics,
      apolloState: state,
    };
    
  } catch (error) {
    return handleLoaderError(error, 'Creator');
  }
}