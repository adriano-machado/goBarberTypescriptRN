import React ,{useCallback}from 'react';
import { View, Button } from 'react-native';
import { useAuth } from '../../hooks/auth';
import { Container, HeaderTitle, Header , UserName,ProfileButton,UserAvatar} from './styles';
import {useNavigation} from "@react-navigation/native"
const Dashboard: React.FC = () => {
  const { signOut,user } = useAuth();
  const {navigate} = useNavigation()
  const navigationToProfile = useCallback(() => {
    navigate("Profile")
  },[navigate])
  return (
    <Container>
      <Header>
        <HeaderTitle>
          Welcome, { "\n"}
          <UserName>{user.name}</UserName>
        </HeaderTitle>
        <ProfileButton onPress={navigationToProfile}>
              <UserAvatar source={{uri:user.avatar_url}}>

              </UserAvatar>

        </ProfileButton>
      </Header>
    </Container>
  );
};
export default Dashboard;


