import * as api from "$lib/apis/communitiesApi.js";

let communities = $state([]);
let isInitialized = $state(false);

export function getCommunities() {
  return communities;
}

export function getOne(id) {
  return communities.find((c) => c.id === id);
}

export async function initializeCommunities() {
  if (isInitialized) return;
  try {
    const data = await api.readAll();
    communities = data;
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize communities:", error);
  }
}

export async function initializeCommunity(communityId) {
  try {
    const community = await api.readOne(communityId);
    const existing = communities.find((c) => c.id === community.id);
    if (!existing) {
      communities.push(community);
    }
    return community;
  } catch (error) {
    console.error("Failed to initialize community:", error);
  }
}

export async function addCommunity(name, description) {
  try {
    const community = await api.create({ name, description });
    communities.push(community);
    return community;
  } catch (error) {
    console.error("Failed to add community:", error);
    throw error;
  }
}

export async function removeCommunity(id) {
  try {
    await api.remove(id);
    communities = communities.filter((c) => c.id !== id);
  } catch (error) {
    console.error("Failed to remove community:", error);
    throw error;
  }
}
