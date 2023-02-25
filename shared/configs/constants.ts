import { ObjectType } from "@shared/interfaces/base";
import EProject from '@public/assets/images/projects/e.svg';
import CProject from '@public/assets/images/projects/c.svg';
import IProject from '@public/assets/images/projects/i.svg';
import PulseProject from '@public/assets/images/projects/pulse.svg';
import CTIProject from '@public/assets/images/projects/cti.svg';

export const EMPTY_OBJECT: ObjectType = {};
export const EMPTY_STRING: string = "";

export const DEFAULT_THEME: string = "light";
export const STORAGE_KEY: string = "theme-preference";

export const MOCK_PROJECTS = [
  {
    image: EProject,
    title: "Project E",
    description:
      "E is a data processing and recommendation service to help the client improve their business and customer relationship",
    time: "2022",
    technicals: ['Angular', 'PrimeNG'],
    credential: true

  },
  {
    image: CProject,
    title: "Project C",
    description:
      "C is a migration from lengacy code to lastest technologies and support department to interact with customers.",
    time: "2021-2022",
    technicals: ['Angular', 'ngRx', 'PrimeNG'],
    credential: true
  },
  {
    image: IProject,
    title: "Project I",
    description:
      "I is a system to help connect and deploy marketing department and customers, deploy efficiency campaigns to the market.",
    time: "2021",
    technicals: ['ReactJS', 'Redux', 'NodeJS'],
    credential: true
  },
  {
    image: PulseProject,
    title: "PulseMS",
    url: "https://www.pulsecollab.com/",
    description:
      "PulseMS is a complex all-in-one management system providing powerful features to manage resources, budget, and planning for the enterprise.",
    time: "2020-2021",
    technicals: ['ReactJS', 'Redux', 'Bryntum', 'PHP Laravel']
  },
  {
    image: CTIProject,
    title: "CTI",
    url: 'https://caretransitions.health/',
    description:
      "CTI is an evidence-based, short-term model that complements a systems's care team by activating patient engagement in their health management.",
    time: "2019-2020",
    technicals: ['NextJS', 'TypeORM', 'Auth0']
  },
];
