export interface IUserInformation {
  country: string;
  display_name: string;
  email: string;
  external_urls: string;
  href: string;
  id: string;
  images: {
    url: string;
    height: string;
    width: string
  }[]
  type: string;
  uri: string
}

export interface ISongInformation {
  album: {
    id: string;
    images: {
      url: string;
      height: number;
      width: number
    }[];
    name: string;
    release_date: string
  }
  artists: {
    name: string
  }[];
  id: string;
  name: string;
  preview_url: string;
  external_urls: {
    spotify: string
  };
  uri: string
}

export interface IPlaylist {
  id: string;
  name: string;
  external_urls: {
    spotify: string
  }
}