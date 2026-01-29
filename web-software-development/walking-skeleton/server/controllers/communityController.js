import * as communityRepository from "../repositories/communityRepository.js";

export const readAll = async (c) => {
  try {
    const sql = c.get("sql");
    const communities = await communityRepository.readAll(sql);
    return c.json(communities);
  } catch (error) {
    console.error("readAll error:", error);
    return c.json({ error: "Failed to retrieve communities" }, 500);
  }
};

export const readOne = async (c) => {
  try {
    const sql = c.get("sql");
    const communityId = parseInt(c.req.param("communityId"));
    const community = await communityRepository.readOne(sql, communityId);
    
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
    const sql = c.get("sql");
    const body = await c.req.json();
    const { name, description } = body;
    
    if (!name || name.trim().length === 0) {
      return c.json({ error: "Community name is required" }, 400);
    }
    
    const community = await communityRepository.create(sql, name, description || null);
    return c.json(community, 201);
  } catch (error) {
    console.error("create error:", error);
    return c.json({ error: "Failed to create community" }, 500);
  }
};

export const deleteOne = async (c) => {
  try {
    const sql = c.get("sql");
    const communityId = parseInt(c.req.param("communityId"));
    const community = await communityRepository.remove(sql, communityId);
    
    if (!community) {
      return c.json({ error: "Community not found" }, 404);
    }
    
    return c.json(community);
  } catch (error) {
    console.error("deleteOne error:", error);
    return c.json({ error: "Failed to delete community" }, 500);
  }
};
