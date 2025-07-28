import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Zap, Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 30px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SectionTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  option {
    background: #2a2a2a;
    color: white;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &.primary {
    background: #667eea;
    color: white;

    &:hover {
      background: #5a67d8;
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const InstrumentSettings = ({ instrument, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '34401A',
    gpibAddress: '22',
    description: '',
    autoConnect: false,
    measurementType: 'DC_VOLTAGE',
    range: 'AUTO',
    resolution: '6.5'
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (instrument) {
      setFormData({
        name: instrument.name || '',
        type: instrument.type || '34401A',
        gpibAddress: instrument.gpibAddress || '22',
        description: instrument.description || '',
        autoConnect: instrument.autoConnect || false,
        measurementType: instrument.measurementType || 'DC_VOLTAGE',
        range: instrument.range || 'AUTO',
        resolution: instrument.resolution || '6.5'
      });
    }
  }, [instrument]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      toast.error('Failed to save instrument settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Connection test successful!');
    } catch (error) {
      toast.error('Connection test failed');
    }
  };

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContent
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <ModalTitle>
              {instrument ? 'Edit Instrument' : 'Add New Instrument'}
            </ModalTitle>
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>
                <SettingsIcon size={18} />
                Basic Settings
              </SectionTitle>
              
              <FormGroup>
                <Label htmlFor="name">Instrument Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Multimeter 1"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="type">Instrument Type</Label>
                <Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="34401A">HP 34401A Multimeter</option>
                  <option value="34410A">Agilent 34410A Multimeter</option>
                  <option value="34461A">Keysight 34461A Multimeter</option>
                  <option value="34465A">Keysight 34465A Multimeter</option>
                  <option value="custom">Custom Instrument</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="gpibAddress">GPIB Address</Label>
                <Input
                  id="gpibAddress"
                  name="gpibAddress"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.gpibAddress}
                  onChange={handleInputChange}
                  placeholder="22"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">Description (Optional)</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter instrument description..."
                />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>
                <Zap size={18} />
                Measurement Settings
              </SectionTitle>

              <FormGroup>
                <Label htmlFor="measurementType">Measurement Type</Label>
                <Select
                  id="measurementType"
                  name="measurementType"
                  value={formData.measurementType}
                  onChange={handleInputChange}
                >
                  <option value="DC_VOLTAGE">DC Voltage</option>
                  <option value="AC_VOLTAGE">AC Voltage</option>
                  <option value="DC_CURRENT">DC Current</option>
                  <option value="AC_CURRENT">AC Current</option>
                  <option value="RESISTANCE">Resistance</option>
                  <option value="FREQUENCY">Frequency</option>
                  <option value="PERIOD">Period</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="range">Range</Label>
                <Select
                  id="range"
                  name="range"
                  value={formData.range}
                  onChange={handleInputChange}
                >
                  <option value="AUTO">Auto</option>
                  <option value="0.1">0.1V</option>
                  <option value="1">1V</option>
                  <option value="10">10V</option>
                  <option value="100">100V</option>
                  <option value="1000">1000V</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="resolution">Resolution</Label>
                <Select
                  id="resolution"
                  name="resolution"
                  value={formData.resolution}
                  onChange={handleInputChange}
                >
                  <option value="4.5">4½ digits</option>
                  <option value="5.5">5½ digits</option>
                  <option value="6.5">6½ digits</option>
                  <option value="7.5">7½ digits</option>
                </Select>
              </FormGroup>
            </FormSection>

            <ButtonGroup>
              <Button
                type="button"
                className="secondary"
                onClick={handleTestConnection}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap size={16} />
                Test Connection
              </Button>
              <Button
                type="submit"
                className="primary"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save size={16} />
                {isLoading ? 'Saving...' : 'Save Instrument'}
              </Button>
            </ButtonGroup>
          </Form>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default InstrumentSettings; 