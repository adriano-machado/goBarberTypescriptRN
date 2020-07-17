import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { Platform } from 'react-native';
import api from '../../services/api';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
} from './styles';
import { useAuth } from '../../hooks/auth';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}
export interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { providerId } = route.params as RouteParams;

  const { user } = useAuth();
  const { goBack } = useNavigation();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

  const [selectedProvider, setSelectedProvider] = useState(providerId);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    async function loadProviders(): Promise<void> {
      const response = await api.get('providers');
      setProviders(response.data);
    }
    loadProviders();
  }, []);

  useEffect(() => {
    async function checkAvailability(): Promise<void> {
      const response = await api.get(
        `providers/${selectedProvider}/day-availability`,
        {
          params: {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
          },
        },
      );
      setAvailability(response.data);
    }
    checkAvailability();
  }, [selectedDate, selectedProvider]);
  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const toogleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      if (date) {
        setSelectedDate(date);
      }
    },
    [],
  );

  const handleSelectProvider = useCallback((id: string) => {
    setSelectedProvider(id);
  }, []);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => ({
        hour,
        available,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
      }));
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => ({
        hour,
        available,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
      }));
  }, [availability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Barbers</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
      <ProvidersListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              selected={selectedProvider === provider.id}
              onPress={() => handleSelectProvider(provider.id)}
            >
              <ProviderAvatar source={{ uri: provider.avatar_url }} />
              <ProviderName selected={selectedProvider === provider.id}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>
      <Calendar>
        <Title>Choose the date</Title>
        <OpenDatePickerButton onPress={toogleDatePicker}>
          <OpenDatePickerButtonText>Select other date</OpenDatePickerButtonText>
        </OpenDatePickerButton>
        {showDatePicker && (
          <DateTimePicker
            onChange={handleDateChanged}
            mode="date"
            display="calendar"
            textColor="#f4ede8"
            value={selectedDate}
          />
        )}
      </Calendar>
      {morningAvailability.map(({ hourFormatted, available }) => (
        <Title>{hourFormatted}</Title>
      ))}
      {afternoonAvailability.map(({ hourFormatted, available }) => (
        <Title>{hourFormatted}</Title>
      ))}
    </Container>
  );
};
export default CreateAppointment;
