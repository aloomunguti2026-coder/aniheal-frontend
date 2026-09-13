import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../services/api';

export function useContent() {
  const [data, setData] = useState({
    settings: null,
    blocks: {},
    services: [],
    pricing: [],
    team: [],
    hubs: [],
    faqs: [],
    research: [],
    loading: true,
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
      ] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/public/settings`),
        fetch(`${API_BASE_URL}/public/content/all`),
        fetch(`${API_BASE_URL}/public/services`),
        fetch(`${API_BASE_URL}/public/pricing-plans`),
        fetch(`${API_BASE_URL}/public/team`),
        fetch(`${API_BASE_URL}/public/hubs`),
        fetch(`${API_BASE_URL}/public/faqs`),
        fetch(`${API_BASE_URL}/public/research`),
      ]);

      const extractData = async (settledRes) => {
        if (settledRes.status === 'fulfilled' && settledRes.value.ok) {
          const json = await settledRes.value.json();
          return json.success ? json.data : null;
        }
        return null;
      };

      const settings = await extractData(settingsRes);
      const blocksData = await extractData(blocksRes);
      const services = await extractData(servicesRes);
      const pricing = await extractData(pricingRes);
      const team = await extractData(teamRes);
      const hubs = await extractData(hubsRes);
      const faqs = await extractData(faqsRes);
      const research = await extractData(researchRes);

      // Convert blocks to dictionary keyed by `key` (e.g. `home_hero`, `home_mission_vision`)
      const blocksMap = {};
      if (blocksData) {
        if (blocksData.byKey && typeof blocksData.byKey === 'object') {
          Object.assign(blocksMap, blocksData.byKey);
        } else if (Array.isArray(blocksData.blocks)) {
          blocksData.blocks.forEach((b) => {
            if (b.key) blocksMap[b.key] = b;
          });
        } else if (Array.isArray(blocksData)) {
          blocksData.forEach((b) => {
            if (b.key) blocksMap[b.key] = b;
          });
        }
      }

      setData({
        settings: settings || null,
        blocks: blocksMap,
        services: Array.isArray(services) ? services : [],
        pricing: Array.isArray(pricing) ? pricing : [],
        team: Array.isArray(team) ? team : [],
        hubs: Array.isArray(hubs) ? hubs : [],
        faqs: Array.isArray(faqs) ? faqs : [],
        research: Array.isArray(research) ? research : [],
        loading: false,
        error: null,
      });
    } catch (err) {
      console.warn('AniHeal Public API fetch error, using local fallback:', err);
      setData((prev) => ({ ...prev, loading: false, error: err }));
    }
  }, []);

  useEffect(() => {
    fetchAllContent();

    // Listen for instant admin broadcast events
    const handleUpdate = () => {
      fetchAllContent();
    };

    window.addEventListener('aniheal_content_updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      window.removeEventListener('aniheal_content_updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [fetchAllContent]);

  return { ...data, refreshContent: fetchAllContent };
}
