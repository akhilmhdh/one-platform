export const sentryResolver = {
  Query: {
    listNamespaces(): { issues: number } {
      return { issues: 10 };
    },
  },
};
