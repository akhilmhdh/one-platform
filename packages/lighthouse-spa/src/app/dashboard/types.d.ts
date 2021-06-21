type Properties = {
  name: string;
  id: string;
  projectId: string;
  apps: PropertyApps[];
};

type PropertyApps = {
  id: string;
  name: string;
  branch: string;
};

type Score = {
  pwa: string;
  accessibility: string;
  seo: string;
  bestPractices: string;
  performance: string;
};

type PropertyBuilds = {
  id: string;
  projectId: string;
  score: Score[];
};
