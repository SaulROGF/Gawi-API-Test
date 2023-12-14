export declare class ProfileAdminSlides {
    idProfile: number;
    nameProfile: string;
    profileType: number;
    sliders: SlideProfileAdmin[];
    constructor();
}
export declare class SlideProfileAdmin {
    idSlider: number;
    url: string;
    order: number;
    comment: string;
    fileName: string;
    approved: boolean;
    constructor();
}
