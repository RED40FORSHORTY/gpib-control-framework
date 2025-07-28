import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { 
  Settings, 
  Trash2, 
  Zap, 
  Activity, 
  Wifi, 
  WifiOff,
  Maximize2,
  Minimize2
} from 'lucide-react';
import toast from 'react-hot-toast';

const PanelContainer = styled(motion.div)`
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  min-width: 350px;
  min-height: 250px;
  cursor: move;
  user-select: none;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const InstrumentTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
`;

const InstrumentType = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &.danger:hover {
    background: rgba(255, 59, 48, 0.3);
    border-color: rgba(255, 59, 48, 0.5);
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#4ade80' : '#ef4444'};
  animation: ${props => props.connected ? 'pulse 2s infinite' : 'none'};

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const StatusText = styled.span`
  color: ${props => props.connected ? '#4ade80' : '#ef4444'};
  font-size: 0.9rem;
  font-weight: 500;
`;

const DisplaySection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  text-align: center;
`;

const DisplayValue = styled.div`
  color: #4ade80;
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  margin-bottom: 5px;
`;

const DisplayUnit = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
`;

const ControlSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const ControlButton = styled(motion.button)`
  flex: 1;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  font-size: 0.85rem;
`;

const InfoItem = styled.div`
  color: rgba(255, 255, 255, 0.8);
`;

const InfoLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  margin-bottom: 2px;
`;

const ResizeHandle = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  opacity: 0.5;
  
  &:hover {
    opacity: 1;
  }
`;

const InstrumentPanel = ({ instrument, onEdit, onDelete }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentValue, setCurrentValue] = useState('0.000');
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Simulate connection status
    setIsConnected(Math.random() > 0.3);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isConnected) {
        setCurrentValue((Math.random() * 10).toFixed(3));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleConnect = () => {
    setIsConnected(!isConnected);
    toast.success(isConnected ? 'Disconnected' : 'Connected');
  };

  const handleMeasure = () => {
    if (!isConnected) {
      toast.error('Instrument not connected');
      return;
    }
    setCurrentValue((Math.random() * 10).toFixed(3));
    toast.success('Measurement taken');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${instrument.name}?`)) {
      onDelete();
    }
  };

  const handleDragStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  if (isMinimized) {
    return (
      <Draggable
        position={position}
        onStop={handleDragStop}
        bounds="parent"
      >
        <PanelContainer
          style={{ 
            width: '200px', 
            height: '80px',
            padding: '10px'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <PanelHeader>
            <div>
              <InstrumentTitle>{instrument.name}</InstrumentTitle>
              <InstrumentType>{instrument.type}</InstrumentType>
            </div>
            <HeaderActions>
              <ActionButton onClick={() => setIsMinimized(false)}>
                <Maximize2 size={16} />
              </ActionButton>
              <ActionButton onClick={onEdit}>
                <Settings size={16} />
              </ActionButton>
              <ActionButton onClick={handleDelete} className="danger">
                <Trash2 size={16} />
              </ActionButton>
            </HeaderActions>
          </PanelHeader>
        </PanelContainer>
      </Draggable>
    );
  }

  return (
    <Draggable
      position={position}
      onStop={handleDragStop}
      bounds="parent"
    >
      <ResizableBox
        width={400}
        height={350}
        minConstraints={[350, 250]}
        maxConstraints={[600, 500]}
        onResize={(e, { size }) => {
          // Handle resize if needed
        }}
      >
        <PanelContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <PanelHeader>
            <div>
              <InstrumentTitle>{instrument.name}</InstrumentTitle>
              <InstrumentType>{instrument.type}</InstrumentType>
            </div>
            <HeaderActions>
              <ActionButton onClick={() => setIsMinimized(true)}>
                <Minimize2 size={16} />
              </ActionButton>
              <ActionButton onClick={onEdit}>
                <Settings size={16} />
              </ActionButton>
              <ActionButton onClick={handleDelete} className="danger">
                <Trash2 size={16} />
              </ActionButton>
            </HeaderActions>
          </PanelHeader>

          <StatusIndicator>
            <StatusDot connected={isConnected} />
            <StatusText connected={isConnected}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </StatusText>
          </StatusIndicator>

          <DisplaySection>
            <DisplayValue>{currentValue}</DisplayValue>
            <DisplayUnit>V DC</DisplayUnit>
          </DisplaySection>

          <ControlSection>
            <ControlButton
              onClick={handleConnect}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isConnected ? <WifiOff size={16} /> : <Wifi size={16} />}
              {isConnected ? 'Disconnect' : 'Connect'}
            </ControlButton>
            <ControlButton
              onClick={handleMeasure}
              disabled={!isConnected}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Activity size={16} />
              Measure
            </ControlButton>
          </ControlSection>

          <InfoSection>
            <InfoItem>
              <InfoLabel>GPIB Address</InfoLabel>
              {instrument.gpibAddress}
            </InfoItem>
            <InfoItem>
              <InfoLabel>Range</InfoLabel>
              Auto
            </InfoItem>
            <InfoItem>
              <InfoLabel>Resolution</InfoLabel>
              6½ digits
            </InfoItem>
            <InfoItem>
              <InfoLabel>Last Update</InfoLabel>
              {new Date().toLocaleTimeString()}
            </InfoItem>
          </InfoSection>
        </PanelContainer>
      </ResizableBox>
    </Draggable>
  );
};

export default InstrumentPanel; 