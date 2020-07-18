import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  HeaderTitle,
  Header,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText,
  ProvidersListTitle,
} from './styles';
import api from '../../services/api';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}
const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const { user } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    async function loadProviders(): Promise<void> {
      const response = await api.get('providers');
      setProviders(response.data);
    }
    loadProviders();
  }, []);
  const navigationToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigationToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );
  return (
    <Container>
      <Header>
        <HeaderTitle>
          Welcome, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>
        <ProfileButton onPress={navigationToProfile}>
          <UserAvatar
            source={{
              uri:
                user.avatar_url ||
                'https://api.adorable.io/avatars/285/abott@adorable.png',
            }}
          />
        </ProfileButton>
      </Header>
      <ProvidersList
        ListHeaderComponent={<ProvidersListTitle>Barbers</ProvidersListTitle>}
        keyExtractor={provider => provider.id}
        data={providers}
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => navigationToCreateAppointment(provider.id)}
          >
            <ProviderAvatar
              source={{
                uri:
                  provider.avatar_url ||
                  'https://api.adorable.io/avatars/285/abott@adorable.png',
              }}
            />
            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>
              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Monday to Friday</ProviderMetaText>
              </ProviderMeta>
              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>8h to 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};
export default Dashboard;
