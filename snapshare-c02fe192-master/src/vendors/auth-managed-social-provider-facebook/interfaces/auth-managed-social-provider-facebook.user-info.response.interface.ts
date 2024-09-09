// picture
interface IAuthManagedSocialProviderFacebookUserInfoResponsePicture {
  data: IAuthManagedSocialProviderFacebookUserInfoResponsePictureData;
}
interface IAuthManagedSocialProviderFacebookUserInfoResponsePictureData {
  height?: number;
  is_silhouette?: boolean;
  url?: string;
  width?: number;
}

// location
interface IAuthManagedSocialProviderFacebookUserInfoResponseLocation {
  id?: string;
  name?: string;
}

// friends
interface IAuthManagedSocialProviderFacebookUserInfoResponseFriends {
  data: IAuthManagedSocialProviderFacebookUserInfoResponseFriendsData[];
  summary?: IAuthManagedSocialProviderFacebookUserInfoResponseFriendsSummary;
}
interface IAuthManagedSocialProviderFacebookUserInfoResponseFriendsData {
  id: string;
  name: string;
}
interface IAuthManagedSocialProviderFacebookUserInfoResponseFriendsSummary {
  total_count: number;
}

export interface IAuthManagedSocialProviderFacebookUserInfoResponse {
  id: string;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  birthday?: string;
  picture?: IAuthManagedSocialProviderFacebookUserInfoResponsePicture;
  location?: IAuthManagedSocialProviderFacebookUserInfoResponseLocation;
  friends?: IAuthManagedSocialProviderFacebookUserInfoResponseFriends;
}
