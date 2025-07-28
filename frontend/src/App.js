import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Settings, Plus, Zap, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import InstrumentPanel from './components/InstrumentPanel';
import InstrumentSettings from './components/InstrumentSettings';
import { useInstruments } from './hooks/useInstruments';
import { useInstrumentActions } from './hooks/useInstrumentActions';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
`;

const Header = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h1`
  color: white;
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
`;

const InstrumentGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
`;

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: white;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
`;

const EmptyStateText = styled.h2`
  margin: 0 0 10px 0;
  font-size: 1.8rem;
  font-weight: 600;
`;

const EmptyStateSubtext = styled.p`
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.8;
`;

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const { instruments = [], isLoading, error } = useInstruments();
  const { addInstrument, updateInstrument, deleteInstrument } = useInstrumentActions();

  const handleAddInstrument = () => {
    setSelectedInstrument(null);
    setShowSettings(true);
  };

  const handleEditInstrument = (instrument) => {
    setSelectedInstrument(instrument);
    setShowSettings(true);
  };

  const handleSaveInstrument = async (instrumentData) => {
    try {
      if (selectedInstrument) {
        await updateInstrument(selectedInstrument.id, instrumentData);
        toast.success('Instrument updated successfully!');
      } else {
        await addInstrument(instrumentData);
        toast.success('Instrument added successfully!');
      }
      setShowSettings(false);
      setSelectedInstrument(null);
    } catch (error) {
      toast.error('Failed to save instrument');
    }
  };

  const handleDeleteInstrument = async (id) => {
    try {
      await deleteInstrument(id);
      toast.success('Instrument deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete instrument');
    }
  };

  if (error) {
    toast.error('Failed to load instruments');
  }

  return (
    <AppContainer>
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>GPIB Control Framework</Title>
        <HeaderActions>
          <ActionButton
            onClick={handleAddInstrument}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Add Instrument
          </ActionButton>
          <ActionButton
            onClick={() => setShowSettings(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={20} />
            Settings
          </ActionButton>
        </HeaderActions>
      </Header>

      {isLoading ? (
        <EmptyState>
          <EmptyStateIcon>⚡</EmptyStateIcon>
          <EmptyStateText>Loading instruments...</EmptyStateText>
        </EmptyState>
      ) : (!instruments || instruments.length === 0) ? (
        <EmptyState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <EmptyStateIcon>🔧</EmptyStateIcon>
          <EmptyStateText>No instruments connected</EmptyStateText>
          <EmptyStateSubtext>
            Add your first instrument to get started
          </EmptyStateSubtext>
          <ActionButton
            onClick={handleAddInstrument}
            style={{ marginTop: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Add First Instrument
          </ActionButton>
        </EmptyState>
      ) : (
        <InstrumentGrid
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {instruments.map((instrument) => (
            <InstrumentPanel
              key={instrument.id}
              instrument={instrument}
              onEdit={() => handleEditInstrument(instrument)}
              onDelete={() => handleDeleteInstrument(instrument.id)}
            />
          ))}
        </InstrumentGrid>
      )}

      {showSettings && (
        <InstrumentSettings
          instrument={selectedInstrument}
          onSave={handleSaveInstrument}
          onClose={() => {
            setShowSettings(false);
            setSelectedInstrument(null);
          }}
        />
      )}
    </AppContainer>
  );
}

export default App; 