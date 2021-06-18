declare module "*.graphql";
declare module "*.json";

type LighthouseType = {
  sites: string;
  serverBaseUrl: string;
  currentBranch: string;
  authorName: string;
  authorEmail: string;
  buildToken: string;
  commitMessage: string;
  preset: string;
};

type LighthouseScoreType = {
  performance: string;
  accessibility: string;
  bestPractices: string;
  seo: string;
  pwa: string;
};

type LighthouseProjectType = {
  id: string;
  name: string;
  slug: string;
  externalUrl: string;
  token: string;
  baseBranch: string;
  createdAt: string;
  updatedAt: string;
};

type PropertyUserProfileType = {
  name: String;
  uid: string;
  rhatUUID: string;
  email: string;
};

type AppType = {
  _id?: string;
  id?: string;
  name: string;
  branch: string;
};

type PropertyType = {
  _id?: string;
  id: string;
  name: string;
  description: string;
  projectId: string;
  apps: AppType[];
  createdOn: string | PropertyUserProfileType;
  createdBy: string;
  updatedOn: string;
  updatedBy: string | PropertyUserProfileType;
};
