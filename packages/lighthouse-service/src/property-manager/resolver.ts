import { FilterQuery } from "mongoose";
import { Property } from "./schema";

const dummyUser = {
  name: "akhil",
  uid: "akmohan",
  rhatUUID: "akmohan",
  email: "akmohan@redhat.com",
};

export const PropertyResolver = {
  Query: {
    async fetchProperties(root: any, args: any, ctx: any) {
      const { limit, offset, search, user } = args;

      const filters: FilterQuery<PropertyType> = {
        name: { $regex: search || "" },
      };
      if (user) filters.createdBy = user;

      const properties = await Property.find(filters)
        .limit(limit || 100)
        .skip(offset || 0)
        .exec();
      return properties.map((el: any) => {
        el.createdBy = dummyUser;
        el.updatedBy = dummyUser;
        return el;
      });
    },
    async fetchProperty(root: any, args: any, ctx: any) {
      const { id } = args;
      const property: any = await Property.findById(id).exec();
      property.createdBy = dummyUser;
      property.updatedBy = dummyUser;
      return property;
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
    async updateProperty(root: any, args: any, ctx: any) {
      const { id, data } = args;
      return Property.findByIdAndUpdate(id, data, { new: true }).exec();
    },
    async deleteProperty(root: any, args: any, ctx: any) {
      const { id } = args;
      return Property.findByIdAndDelete(id).exec();
    },
    async createApp(root: any, args: any, ctx: any) {
      const { propertyId, appData } = args;
      return Property.findByIdAndUpdate(
        propertyId,
        {
          $push: { apps: appData },
        },
        { new: true }
      ).exec();
    },
    async updateApp(root: any, args: any, ctx: any) {
      const { appId, appData } = args;
      /**
       * To patch a sub document we use set fn. of mongoose
       * apps.$.name = name
       * we dynamically convert the input response as its same for doc model
       */
      const appPatchQuery = Object.entries(appData).reduce(
        (query: Record<string, unknown>, [type, value]) => {
          query[`apps.$.${type}`] = value;
          return query;
        },
        {}
      );
      return Property.findOneAndUpdate({ "apps._id": appId }, appPatchQuery, {
        new: true,
      }).exec();
    },
    async deleteApp(root: any, args: any, ctx: any) {
      const { appId } = args;
      return Property.findOneAndUpdate(
        { "apps._id": appId },
        {
          $pull: {
            apps: { _id: appId },
          },
        },
        {
          new: true,
        }
      ).exec();
    },
  },
};
