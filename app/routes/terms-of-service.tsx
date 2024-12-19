import { type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { NotionWrapper } from "@/components/ui/NotionWrapper";
import { loadDocumentation } from "@/lib/loader/documentation.server";
import { getDocumentMeta } from "@/lib/meta/documentation";

export const loader = async ({ params, request, context }: LoaderFunctionArgs) => {
  return await loadDocumentation({ params, request, context }, "/terms-of-service");
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) { return []; }
  else if (!data.id) { return []; }
  return getDocumentMeta(data);
};

export default function() {
  const data = useLoaderData<typeof loader>();
  if (!data || !data.text) {
    return <div>Could not find post</div>;
  }

  return (
    <NotionWrapper blockText={data.text}/>
  );
}