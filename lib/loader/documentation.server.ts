import { type LoaderFunctionArgs } from "react-router";
import { getApolloClient } from "@/lib/apollo.server";
import { type GetDocumentationQuery, type GetDocumentationQueryVariables, GetDocumentation } from "@/shared/graphql/operations";
import { handleLoaderError } from "./error-handler";

export async function loadDocumentation({ params, request, context }: LoaderFunctionArgs, basePath: string): Promise<GetDocumentationQuery['getDocumentation']> {
  const fullPath = params.slug 
      ? `${basePath}/${params.slug}` 
      : basePath;
  
  const client = getApolloClient(request);
  
  try {
    const { data } = await client.query<GetDocumentationQuery, GetDocumentationQueryVariables>({
      query: GetDocumentation,
      variables: { id: fullPath },
    });

    if (!data?.getDocumentation) {
      throw new Response("Not Found", { status: 404 });
    }

    return data.getDocumentation;
  } catch (error) {
    handleLoaderError(error, 'Documentation');
  }
}