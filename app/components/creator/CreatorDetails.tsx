import { getAvatarImageUrl } from '@/public/creator';
import type { Creator, LinkDetails } from '@/shared/graphql/types';
import { CreatorLinks } from './CreatorLinks';

export type CreatorPageType = 
  | 'creator-screen'
  | 'mini-creator';

type CreatorDetailsProps = {
  creator?: Creator | null | undefined;
  pageType: CreatorPageType;
}

export function CreatorDetails({ creator, pageType }: CreatorDetailsProps) {
  if (!creator) { return null; }

  return (
    <div className="px-4 py-6 mt-2 sm:px-6 lg:px-8 rounded-md">
      <div className="flex flex-col sm:flex-row ">
        {creator.avatarImageAsString &&
          <Avatar creator={creator} pageType={pageType} />
        }
        <div className="sm:w-2/3 sm:pl-4">
          <Name creator={creator} pageType={pageType}/>
          <p className='mt-2'>{creator.bio}</p>
        </div>
      </div>
      {creator.links && 
        <CreatorLinks links={creator.links.filter((link): link is LinkDetails => link !== null)} />
      }
    </div>
  );
}

type CreatorComponentProps = {
  creator: Creator;
  pageType: CreatorPageType;
}

const Name = ({ creator, pageType }: CreatorComponentProps) => {
  switch (pageType) {
    case 'creator-screen':
      return <h1 className="mt-4 sm:mt-0 font-bold text-xl">{creator.name}</h1>;
    default:
      return <h2 className="mt-4 sm:mt-0 font-bold text-xl">{creator.name}</h2>;
  }
}

const Avatar = ({ creator, pageType }: CreatorComponentProps) => {
  return (
    <div className='flex flex-col items-center sm:items-start'>
      <img
        src={getAvatarImageUrl({ avatarImageAsString: creator.avatarImageAsString })}
        alt={`${creator.name} avatar`}
        className="h-40 w-40 rounded-full object-cover object-center mb-4 sm:mb-0 sm:mr-2"
      />
    </div>
  );
}