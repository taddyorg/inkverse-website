import { Section } from '../ui';
import { ComicIssueDetails } from './ComicIssueDetails';
import type { ComicSeries, ComicIssue } from '@/shared/graphql/types';

type ComicIssuesBoxProps = {
  comicseries: ComicSeries | null | undefined;
  issues: ComicIssue[] | null | undefined;
  currentIssueUuid: string | undefined;
}
  
export function ComicIssuesList(props: ComicIssuesBoxProps) {
  const { comicseries, issues, currentIssueUuid } = props;

  if (!comicseries || !issues) {
    return <></>;
  }

  return (
    <Section className="mt-2 mb-4 px-4 sm:px-6 lg:px-8 rounded-md">
      <h2 className='text-2xl font-semibold mb-4'>Episodes</h2>
      {issues.map((comicissue, index) => (
        <ComicIssueDetails
          key={comicissue.uuid}
          comicseries={comicseries}
          comicissue={comicissue}
          position={comicissue.position || 0}
          isCurrentIssue={comicissue.uuid === currentIssueUuid}
        />
      ))}
    </Section>
  );
}