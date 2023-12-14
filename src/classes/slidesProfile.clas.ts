export class ProfileAdminSlides {
  idProfile: number;
  nameProfile: string;
  profileType: number;

  sliders: SlideProfileAdmin[];

  constructor() {
    this.nameProfile = "";
    this.profileType = -1;
    this.idProfile = -1;
    this.sliders = [];
  }
}

export class SlideProfileAdmin {
  idSlider: number;
  url: string;
  order: number;
  comment: string;
  fileName: string;
  approved: boolean;

  constructor() {
    this.idSlider = -1;
    this.url = "";
    this.order = -1;
    this.comment = "";
    this.fileName = "";
    this.approved = false;
  }
}