import { Property } from "./schema";

const dummyUser = {
  name: "akhil",
  uid: "akmohan",
  rhatUUID: "akmohan",
  email: "akmohan@redhat.com",
};

export const PropertyResolver = {
  Query: {
    async fetchProperties() {
      const properties: PropertyType[] = await Property.find().lean().exec();
      return properties.map((el: any) => {
        el.createdBy = dummyUser;
        el.updatedBy = dummyUser;
        return el;
      });
    },
  },
  Mutation: {
    async createProperty(root: any, args: any, ctx: any) {
      const { property } = args;
      property.createdBy = dummyUser.rhatUUID;
      property.updatedBy = dummyUser.rhatUUID;
      const data = new Property(property);
      return data.save();
    },
  },
};
