const getApiBaseUrl = () => {
  const savedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('custom_backend_url') : null;
  if (savedUrl) {
    const isBanned = savedUrl.includes('localhost') || 
                     savedUrl.includes('127.0.0.1') || 
                     savedUrl.includes('10.141.95.184') || 
                     savedUrl.includes('10.0.2.2') ||
                     savedUrl.includes(':5000');
    if (isBanned) {
      localStorage.removeItem('custom_backend_url');
    } else {
      return savedUrl;
    }
  }
  return import.meta.env.VITE_BACKEND_URL || "https://placement-companion-backend.onrender.com";
};

export const API_BASE_URL = getApiBaseUrl();

// Offline sync queue helper
export const syncFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  if (token && options.headers) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  // If method is GET, run standard fetch
  if (!options.method || options.method === 'GET') {
    return fetch(url, options);
  }

  // If method is PATCH/POST (mutation), handle potential offline queue
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    // Network failure (offline)
    console.warn(`Fetch failed (likely offline). Queueing mutation for ${url}:`, error);
    
    // Only queue sync endpoints
    if (url.includes('/api/sync/')) {
      const queue = JSON.parse(localStorage.getItem('pendingSyncQueue') || '[]');
      queue.push({
        url,
        method: options.method,
        body: options.body,
        timestamp: Date.now()
      });
      localStorage.setItem('pendingSyncQueue', JSON.stringify(queue));
    }
    
    throw error;
  }
};

export const syncPendingChanges = async () => {
  const queue = JSON.parse(localStorage.getItem('pendingSyncQueue') || '[]');
  if (queue.length === 0) return;

  console.log(`Syncing ${queue.length} pending offline changes...`);
  const token = localStorage.getItem('token');
  if (!token) return;

  // Group by URL to only send the latest state for conflict resolution (newest wins)
  const latestUpdates = {};
  queue.forEach(item => {
    latestUpdates[item.url] = item;
  });

  const urlsToSync = Object.keys(latestUpdates);
  for (const url of urlsToSync) {
    const item = latestUpdates[url];
    try {
      await fetch(item.url, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: item.body
      });
      console.log(`Successfully synced offline changes for: ${url}`);
    } catch (err) {
      console.error(`Failed to sync offline changes for ${url}:`, err);
      // Keep it in queue or retry later
      return; 
    }
  }

  // Clear queue if all succeeded
  localStorage.removeItem('pendingSyncQueue');
};

// Register online listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', syncPendingChanges);
}