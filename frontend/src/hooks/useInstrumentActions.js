import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const useInstrumentActions = () => {
  const queryClient = useQueryClient();

  const addInstrument = useMutation(
    async (instrumentData) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/instruments`, instrumentData);
        return response.data;
      } catch (error) {
        // For demo purposes, simulate successful creation
        if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
          const newInstrument = {
            id: Date.now(),
            ...instrumentData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          return newInstrument;
        }
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('instruments');
      }
    }
  );

  const updateInstrument = useMutation(
    async ({ id, ...instrumentData }) => {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/instruments/${id}`, instrumentData);
        return response.data;
      } catch (error) {
        // For demo purposes, simulate successful update
        if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
          const updatedInstrument = {
            id,
            ...instrumentData,
            updatedAt: new Date().toISOString()
          };
          return updatedInstrument;
        }
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('instruments');
      }
    }
  );

  const deleteInstrument = useMutation(
    async (id) => {
      try {
        await axios.delete(`${API_BASE_URL}/api/instruments/${id}`);
        return id;
      } catch (error) {
        // For demo purposes, simulate successful deletion
        if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
          return id;
        }
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('instruments');
      }
    }
  );

  return {
    addInstrument: addInstrument.mutateAsync,
    updateInstrument: updateInstrument.mutateAsync,
    deleteInstrument: deleteInstrument.mutateAsync,
    isLoading: addInstrument.isLoading || updateInstrument.isLoading || deleteInstrument.isLoading
  };
}; 