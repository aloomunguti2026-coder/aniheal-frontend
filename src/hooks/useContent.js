import { useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../services/api';
import { subscribeToContentUpdates } from '../services/eventBus';

const CACHE_KEY = 'aniheal_persisted_content_v3';

const loadCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Unable to parse cached content:', e);
  }
  return null;
};

const saveCache = (content) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch (e) {
    console.warn('Unable to persist content to cache:', e);
  }
};

export function useContent() {
  const initialCache = useRef(loadCache()).current;

  const [data, setData] = useState({
    settings: initialCache?.settings || null,
    blocks: initialCache?.blocks || {},
    services: Array.isArray(initialCache?.services) ? initialCache.services : [],
    pricing: Array.isArray(initialCache?.pricing) ? initialCache.pricing : [],
    team: Array.isArray(initialCache?.team) ? initialCache.team : [],
    hubs: Array.isArray(initialCache?.hubs) ? initialCache.hubs : [],
    faqs: Array.isArray(initialCache?.faqs) ? initialCache.faqs : [],
    research: Array.isArray(initialCache?.research) ? initialCache.research : [],
    collaborations: Array.isArray(initialCache?.collaborations) ? initialCache.collaborations : [],
    loading: !initialCache,
    error: null,
  });

  const fetchAllContent = useCallback(async () => {
    try {
      const [
        settingsRes,
        blocksRes,
        servicesRes,
        pricingRes,
        teamRes,
        hubsRes,
        faqsRes,
        researchRes,
        collaborationsRes,
      ] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/public/settings`),
        fetch(`${API_BASE_URL}/public/content/all`),
        fetch(`${API_BASE_URL}/public/services`),
        fetch(`${API_BASE_URL}/public/pricing-plans`),
        fetch(`${API_BASE_URL}/public/team`),
        fetch(`${API_BASE_URL}/public/hubs`),
        fetch(`${API_BASE_URL}/public/faqs`),
        fetch(`${API_BASE_URL}/public/research`),
        fetch(`${API_BASE_URL}/collaborations`),
      ]);

      const extractResult = async (settledRes) => {
        if (settledRes.status === 'fulfilled' && settledRes.value.ok) {
          try {
            const json = await settledRes.value.json();
            if (json && json.success) {
              return { success: true, data: json.data };
            }
          } catch {
            return { success: false, data: null };
          }
        }
        return { success: false, data: null };
      };

      const settingsResData = await extractResult(settingsRes);
      const blocksResData = await extractResult(blocksRes);
      const servicesResData = await extractResult(servicesRes);
      const pricingResData = await extractResult(pricingRes);
      const teamResData = await extractResult(teamRes);
      const hubsResData = await extractResult(hubsRes);
      const faqsResData = await extractResult(faqsRes);
      const researchResData = await extractResult(researchRes);
      const collaborationsResData = await extractResult(collaborationsRes);

      // Convert blocks to dictionary keyed by `key`
      let blocksMap = null;
      if (blocksResData.success && blocksResData.data) {
        blocksMap = {};
        const bData = blocksResData.data;
        if (bData.byKey && typeof bData.byKey === 'object') {
          Object.assign(blocksMap, bData.byKey);
        } else if (Array.isArray(bData.blocks)) {
          bData.blocks.forEach((b) => {
            if (b.key) blocksMap[b.key] = b;
          });
        } else if (Array.isArray(bData)) {
          bData.forEach((b) => {
            if (b.key) blocksMap[b.key] = b;
          });
        }
      }

      setData((prev) => {
        const nextData = {
          settings: settingsResData.success ? settingsResData.data : prev.settings,
          blocks: blocksMap !== null ? blocksMap : prev.blocks,
          services: servicesResData.success
            ? (Array.isArray(servicesResData.data) ? servicesResData.data : [])
            : prev.services,
          pricing: pricingResData.success
            ? (Array.isArray(pricingResData.data) ? pricingResData.data : [])
            : prev.pricing,
          team: teamResData.success
            ? (Array.isArray(teamResData.data) ? teamResData.data : [])
            : prev.team,
          hubs: hubsResData.success
            ? (Array.isArray(hubsResData.data) ? hubsResData.data : [])
            : prev.hubs,
          faqs: faqsResData.success
            ? (Array.isArray(faqsResData.data) ? faqsResData.data : [])
            : prev.faqs,
          research: researchResData.success
            ? (Array.isArray(researchResData.data) ? researchResData.data : [])
            : prev.research,
          collaborations: collaborationsResData.success
            ? (Array.isArray(collaborationsResData.data) ? collaborationsResData.data : [])
            : prev.collaborations,
          loading: false,
          error: null,
        };

        saveCache(nextData);
        return nextData;
      });
    } catch (err) {
      console.warn('AniHeal Public API fetch error, preserving local cache:', err);
      setData((prev) => ({ ...prev, loading: false, error: err }));
    }
  }, []);

  useEffect(() => {
    fetchAllContent();

    // Subscribe to cross-tab and in-window content update broadcasts
    const unsubscribe = subscribeToContentUpdates(() => {
      fetchAllContent();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchAllContent]);

  return { ...data, refreshContent: fetchAllContent };
}
