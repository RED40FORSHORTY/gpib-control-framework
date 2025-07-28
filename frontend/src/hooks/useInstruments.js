import { useQuery } from 'react-query';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const useInstruments = () => {
  return useQuery(
    'instruments',
    async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/instruments`);
        return response.data;
      } catch (error) {
        // For demo purposes, return mock data if API is not available
        if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
          return [
            {
              id: 1,
              name: 'HP 34401A Multimeter',
              type: '34401A',
              gpibAddress: '22',
              description: 'High precision 6½ digit multimeter',
              autoConnect: true,
              measurementType: 'DC_VOLTAGE',
              range: 'AUTO',
              resolution: '6.5',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];
        }
        throw error;
      }
    },
    {
      refetchInterval: 5000, // Refetch every 5 seconds
      staleTime: 30000, // Consider data stale after 30 seconds
      retry: 3,
      retryDelay: 1000
    }
  );
}; 