export declare class UserDto {
    user_id: number;
    username: string;
    password?: string;
    password_google?: string;
    password_facebook?: string;
    email: string;
    rol_id: number;
    step: number;
    name: string;
    telephone: string;
    facebook_id?: string;
    facebook_photo?: string;
    google_id?: string;
    google_photo?: string;
    photo_selected?: string;
    user_hometown?: string;
    instagram_basic?: string;
    age_range?: string;
    birthday?: string;
    gender?: string;
    link?: string;
    location?: string;
    valid_until: Date;
    remember_token?: string;
    conekta_token?: string;
    created_at: Date;
    updated_at: Date;
}