import * as communityRepository from "../repositories/communityRepository.js";

export const readAll = async (c) => {
  try {
    const communities = await communityRepository.readAll();
    return c.json(communities);
  } catch (error) {
    console.error("readAll error:", error);
    return c.json({ error: "Failed to retrieve communities" }, 500);
  }
};

export const readOne = async (c) => {
  try {
    const communityId = parseInt(c.req.param("communityId"));
    const community = await communityRepository.readOne(communityId);
    
    if (!community) {
      return c.json({ error: "Community not found" }, 404);
    }
    
    return c.json(community);
  } catch (error) {
    console.error("readOne error:", error);
    return c.json({ error: "Failed to retrieve community" }, 500);
  }
};

export const create = async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json();
    const { name, description } = body;
    
    if (!name || name.trim().length === 0) {
      return c.json({ error: "Community name is required" }, 400);
    }
    
    const community = await communityRepository.create(name, description || null, user?.id);
    return c.json(community, 200);
  } catch (error) {
    console.error("create error:", error);
    return c.json({ error: "Failed to create community" }, 500);
  }
};

export const deleteOne = async (c) => {
  try {
    const communityId = parseInt(c.req.param("communityId"));
    const user = c.get("user");
    const community = await communityRepository.remove(communityId, user?.id);
    
    if (!community) {
      return c.json({ error: "Community not found" }, 404);
    }
    
    return c.json(community);
  } catch (error) {
    console.error("deleteOne error:", error);
    return c.json({ error: "Failed to delete community" }, 500);
  }
};
