import {getProfileSync} from 'components/utils/AuthService';

export function userPermittedToPage(page) {
  const userProfile = getProfileSync();
  if(userProfile.isAdmin) {
    return true;
  }
  else{
    const blockedPages = userProfile.app_metadata.blockedPages;
    return !blockedPages || blockedPages.findIndex(blockedPage => page === blockedPage) === -1;
  }
}