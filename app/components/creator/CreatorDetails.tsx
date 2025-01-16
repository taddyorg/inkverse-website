import React from 'react';

import { Section } from '../ui';
import { getAvatarImageUrl } from '@/public/creator';
import { getPrettyLinkType } from '@/public/links';
import type { Creator, LinkDetails } from '@/shared/graphql/types';

export enum CreatorPageType {
  CREATOR_SCREEN = 'CREATOR_SCREEN',
}

type CreatorDetailsProps = {
  creator?: Creator | null | undefined;
  pageType: CreatorPageType;
}

export function CreatorDetails({ creator, pageType }: CreatorDetailsProps) {
  if (!creator) { return null; }

  return (
    <Section className="px-4 py-6 mt-2 sm:px-6 lg:px-8 rounded-md">
      <div className="flex flex-col sm:flex-row ">
        {creator.avatarImageAsString &&
          <Avatar creator={creator} pageType={pageType} />
        }
        <div className="sm:w-2/3 sm:pl-4">
          <Name creator={creator} pageType={pageType}/>
          <p className='mt-2'>{creator.bio}</p>
          {creator.links && 
            <CreatorLinks links={creator.links.filter((link): link is LinkDetails => link !== null)} />
          }
        </div>
      </div>
    </Section>
  );
}

type CreatorComponentProps = {
  creator: Creator;
  pageType: CreatorPageType;
}

const Name = ({ creator, pageType }: CreatorComponentProps) => {
  switch (pageType) {
    case CreatorPageType.CREATOR_SCREEN:
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

type CreatorLinksProps = {
  links?: LinkDetails[];
}

const CreatorLinks = ({ links }: CreatorLinksProps) => {
  return (
    <div className="mt-4 flex flex-row gap-2 justify-center">
      {links?.map((link) => (link.url && link.type &&
        <a 
          key={link.url} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="border-2 border-gray-400 rounded-full px-2 py-1 hover:text-pink-500 hover:border-pink-500"
        >
          {getPrettyLinkType(link.type)}
        </a>
      ))}
    </div>
  );
}