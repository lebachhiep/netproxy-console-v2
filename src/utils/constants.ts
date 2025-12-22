// Authentication constants
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_EMAIL: '/verify-email'
} as const;

export const PROTECTED_ROUTES = {
  HOME: '/home',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile'
} as const;

// Password validation constants
export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: true
} as const;

// Session constants
export const SESSION_CONFIG = {
  TIMEOUT_MINUTES: 30,
  REMEMBER_ME_DAYS: 30
} as const;

// Toast messages
export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  REGISTER_SUCCESS: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  PASSWORD_RESET_SENT: 'Email đặt lại mật khẩu đã được gửi!',
  EMAIL_VERIFICATION_SENT: 'Email xác thực đã được gửi!',
  PROFILE_UPDATED: 'Cập nhật thông tin thành công!'
} as const;

export const COUNTRY_OPTIONS = [
  {
    value: 'ad',
    label: '🇦🇩 Andorra'
  },
  {
    value: 'ae',
    label: '🇦🇪 United Arab Emirates'
  },
  {
    value: 'af',
    label: '🇦🇫 Afghanistan'
  },
  {
    value: 'ag',
    label: '🇦🇬 Antigua and Barbuda'
  },
  {
    value: 'ai',
    label: '🇦🇮 Anguilla'
  },
  {
    value: 'al',
    label: '🇦🇱 Albania'
  },
  {
    value: 'am',
    label: '🇦🇲 Armenia'
  },
  {
    value: 'ao',
    label: '🇦🇴 Angola'
  },
  {
    value: 'aq',
    label: '🇦🇶 Antarctica'
  },
  {
    value: 'ar',
    label: '🇦🇷 Argentina'
  },
  {
    value: 'as',
    label: '🇦🇸 American Samoa'
  },
  {
    value: 'at',
    label: '🇦🇹 Austria'
  },
  {
    value: 'au',
    label: '🇦🇺 Australia'
  },
  {
    value: 'aw',
    label: '🇦🇼 Aruba'
  },
  {
    value: 'ax',
    label: '🇦🇽 Åland Islands'
  },
  {
    value: 'az',
    label: '🇦🇿 Azerbaijan'
  },
  {
    value: 'ba',
    label: '🇧🇦 Bosnia and Herzegovina'
  },
  {
    value: 'bb',
    label: '🇧🇧 Barbados'
  },
  {
    value: 'bd',
    label: '🇧🇩 Bangladesh'
  },
  {
    value: 'be',
    label: '🇧🇪 Belgium'
  },
  {
    value: 'bf',
    label: '🇧🇫 Burkina Faso'
  },
  {
    value: 'bg',
    label: '🇧🇬 Bulgaria'
  },
  {
    value: 'bh',
    label: '🇧🇭 Bahrain'
  },
  {
    value: 'bi',
    label: '🇧🇮 Burundi'
  },
  {
    value: 'bj',
    label: '🇧🇯 Benin'
  },
  {
    value: 'bl',
    label: '🇧🇱 Saint Barthélemy'
  },
  {
    value: 'bm',
    label: '🇧🇲 Bermuda'
  },
  {
    value: 'bn',
    label: '🇧🇳 Brunei Darussalam'
  },
  {
    value: 'bo',
    label: '🇧🇴 Bolivia, Plurinational State of'
  },
  {
    value: 'bq',
    label: '🇧🇶 Bonaire, Sint Eustatius and Saba'
  },
  {
    value: 'br',
    label: '🇧🇷 Brazil'
  },
  {
    value: 'bs',
    label: '🇧🇸 Bahamas'
  },
  {
    value: 'bt',
    label: '🇧🇹 Bhutan'
  },
  {
    value: 'bv',
    label: '🇧🇻 Bouvet Island'
  },
  {
    value: 'bw',
    label: '🇧🇼 Botswana'
  },
  {
    value: 'by',
    label: '🇧🇾 Belarus'
  },
  {
    value: 'bz',
    label: '🇧🇿 Belize'
  },
  {
    value: 'ca',
    label: '🇨🇦 Canada'
  },
  {
    value: 'cc',
    label: '🇨🇨 Cocos (Keeling) Islands'
  },
  {
    value: 'cd',
    label: '🇨🇩 Congo, The Democratic Republic of the'
  },
  {
    value: 'cf',
    label: '🇨🇫 Central African Republic'
  },
  {
    value: 'cg',
    label: '🇨🇬 Congo'
  },
  {
    value: 'ch',
    label: '🇨🇭 Switzerland'
  },
  {
    value: 'ci',
    label: "🇨🇮 Côte d'Ivoire"
  },
  {
    value: 'ck',
    label: '🇨🇰 Cook Islands'
  },
  {
    value: 'cl',
    label: '🇨🇱 Chile'
  },
  {
    value: 'cm',
    label: '🇨🇲 Cameroon'
  },
  {
    value: 'cn',
    label: '🇨🇳 China'
  },
  {
    value: 'co',
    label: '🇨🇴 Colombia'
  },
  {
    value: 'cr',
    label: '🇨🇷 Costa Rica'
  },
  {
    value: 'cu',
    label: '🇨🇺 Cuba'
  },
  {
    value: 'cv',
    label: '🇨🇻 Cabo Verde'
  },
  {
    value: 'cw',
    label: '🇨🇼 Curaçao'
  },
  {
    value: 'cx',
    label: '🇨🇽 Christmas Island'
  },
  {
    value: 'cy',
    label: '🇨🇾 Cyprus'
  },
  {
    value: 'cz',
    label: '🇨🇿 Czechia'
  },
  {
    value: 'de',
    label: '🇩🇪 Germany'
  },
  {
    value: 'dj',
    label: '🇩🇯 Djibouti'
  },
  {
    value: 'dk',
    label: '🇩🇰 Denmark'
  },
  {
    value: 'dm',
    label: '🇩🇲 Dominica'
  },
  {
    value: 'do',
    label: '🇩🇴 Dominican Republic'
  },
  {
    value: 'dz',
    label: '🇩🇿 Algeria'
  },
  {
    value: 'ec',
    label: '🇪🇨 Ecuador'
  },
  {
    value: 'ee',
    label: '🇪🇪 Estonia'
  },
  {
    value: 'eg',
    label: '🇪🇬 Egypt'
  },
  {
    value: 'eh',
    label: '🇪🇭 Western Sahara'
  },
  {
    value: 'er',
    label: '🇪🇷 Eritrea'
  },
  {
    value: 'es',
    label: '🇪🇸 Spain'
  },
  {
    value: 'et',
    label: '🇪🇹 Ethiopia'
  },
  {
    value: 'fi',
    label: '🇫🇮 Finland'
  },
  {
    value: 'fj',
    label: '🇫🇯 Fiji'
  },
  {
    value: 'fk',
    label: '🇫🇰 Falkland Islands (Malvinas)'
  },
  {
    value: 'fm',
    label: '🇫🇲 Micronesia, Federated States of'
  },
  {
    value: 'fo',
    label: '🇫🇴 Faroe Islands'
  },
  {
    value: 'fr',
    label: '🇫🇷 France'
  },
  {
    value: 'ga',
    label: '🇬🇦 Gabon'
  },
  {
    value: 'gb',
    label: '🇬🇧 United Kingdom'
  },
  {
    value: 'gd',
    label: '🇬🇩 Grenada'
  },
  {
    value: 'ge',
    label: '🇬🇪 Georgia'
  },
  {
    value: 'gf',
    label: '🇬🇫 French Guiana'
  },
  {
    value: 'gg',
    label: '🇬🇬 Guernsey'
  },
  {
    value: 'gh',
    label: '🇬🇭 Ghana'
  },
  {
    value: 'gi',
    label: '🇬🇮 Gibraltar'
  },
  {
    value: 'gl',
    label: '🇬🇱 Greenland'
  },
  {
    value: 'gm',
    label: '🇬🇲 Gambia'
  },
  {
    value: 'gn',
    label: '🇬🇳 Guinea'
  },
  {
    value: 'gp',
    label: '🇬🇵 Guadeloupe'
  },
  {
    value: 'gq',
    label: '🇬🇶 Equatorial Guinea'
  },
  {
    value: 'gr',
    label: '🇬🇷 Greece'
  },
  {
    value: 'gs',
    label: '🇬🇸 South Georgia and the South Sandwich Islands'
  },
  {
    value: 'gt',
    label: '🇬🇹 Guatemala'
  },
  {
    value: 'gu',
    label: '🇬🇺 Guam'
  },
  {
    value: 'gw',
    label: '🇬🇼 Guinea-Bissau'
  },
  {
    value: 'gy',
    label: '🇬🇾 Guyana'
  },
  {
    value: 'hk',
    label: '🇭🇰 Hong Kong'
  },
  {
    value: 'hm',
    label: '🇭🇲 Heard Island and McDonald Islands'
  },
  {
    value: 'hn',
    label: '🇭🇳 Honduras'
  },
  {
    value: 'hr',
    label: '🇭🇷 Croatia'
  },
  {
    value: 'ht',
    label: '🇭🇹 Haiti'
  },
  {
    value: 'hu',
    label: '🇭🇺 Hungary'
  },
  {
    value: 'id',
    label: '🇮🇩 Indonesia'
  },
  {
    value: 'ie',
    label: '🇮🇪 Ireland'
  },
  {
    value: 'il',
    label: '🇮🇱 Israel'
  },
  {
    value: 'im',
    label: '🇮🇲 Isle of Man'
  },
  {
    value: 'in',
    label: '🇮🇳 India'
  },
  {
    value: 'io',
    label: '🇮🇴 British Indian Ocean Territory'
  },
  {
    value: 'iq',
    label: '🇮🇶 Iraq'
  },
  {
    value: 'ir',
    label: '🇮🇷 Iran, Islamic Republic of'
  },
  {
    value: 'is',
    label: '🇮🇸 Iceland'
  },
  {
    value: 'it',
    label: '🇮🇹 Italy'
  },
  {
    value: 'je',
    label: '🇯🇪 Jersey'
  },
  {
    value: 'jm',
    label: '🇯🇲 Jamaica'
  },
  {
    value: 'jo',
    label: '🇯🇴 Jordan'
  },
  {
    value: 'jp',
    label: '🇯🇵 Japan'
  },
  {
    value: 'ke',
    label: '🇰🇪 Kenya'
  },
  {
    value: 'kg',
    label: '🇰🇬 Kyrgyzstan'
  },
  {
    value: 'kh',
    label: '🇰🇭 Cambodia'
  },
  {
    value: 'ki',
    label: '🇰🇮 Kiribati'
  },
  {
    value: 'km',
    label: '🇰🇲 Comoros'
  },
  {
    value: 'kn',
    label: '🇰🇳 Saint Kitts and Nevis'
  },
  {
    value: 'kp',
    label: "🇰🇵 Korea, Democratic People's Republic of"
  },
  {
    value: 'kr',
    label: '🇰🇷 Korea, Republic of'
  },
  {
    value: 'kw',
    label: '🇰🇼 Kuwait'
  },
  {
    value: 'ky',
    label: '🇰🇾 Cayman Islands'
  },
  {
    value: 'kz',
    label: '🇰🇿 Kazakhstan'
  },
  {
    value: 'la',
    label: "🇱🇦 Lao People's Democratic Republic"
  },
  {
    value: 'lb',
    label: '🇱🇧 Lebanon'
  },
  {
    value: 'lc',
    label: '🇱🇨 Saint Lucia'
  },
  {
    value: 'li',
    label: '🇱🇮 Liechtenstein'
  },
  {
    value: 'lk',
    label: '🇱🇰 Sri Lanka'
  },
  {
    value: 'lr',
    label: '🇱🇷 Liberia'
  },
  {
    value: 'ls',
    label: '🇱🇸 Lesotho'
  },
  {
    value: 'lt',
    label: '🇱🇹 Lithuania'
  },
  {
    value: 'lu',
    label: '🇱🇺 Luxembourg'
  },
  {
    value: 'lv',
    label: '🇱🇻 Latvia'
  },
  {
    value: 'ly',
    label: '🇱🇾 Libya'
  },
  {
    value: 'ma',
    label: '🇲🇦 Morocco'
  },
  {
    value: 'mc',
    label: '🇲🇨 Monaco'
  },
  {
    value: 'md',
    label: '🇲🇩 Moldova, Republic of'
  },
  {
    value: 'me',
    label: '🇲🇪 Montenegro'
  },
  {
    value: 'mf',
    label: '🇲🇫 Saint Martin (French part)'
  },
  {
    value: 'mg',
    label: '🇲🇬 Madagascar'
  },
  {
    value: 'mh',
    label: '🇲🇭 Marshall Islands'
  },
  {
    value: 'mk',
    label: '🇲🇰 North Macedonia'
  },
  {
    value: 'ml',
    label: '🇲🇱 Mali'
  },
  {
    value: 'mm',
    label: '🇲🇲 Myanmar'
  },
  {
    value: 'mn',
    label: '🇲🇳 Mongolia'
  },
  {
    value: 'mo',
    label: '🇲🇴 Macao'
  },
  {
    value: 'mp',
    label: '🇲🇵 Northern Mariana Islands'
  },
  {
    value: 'mq',
    label: '🇲🇶 Martinique'
  },
  {
    value: 'mr',
    label: '🇲🇷 Mauritania'
  },
  {
    value: 'ms',
    label: '🇲🇸 Montserrat'
  },
  {
    value: 'mt',
    label: '🇲🇹 Malta'
  },
  {
    value: 'mu',
    label: '🇲🇺 Mauritius'
  },
  {
    value: 'mv',
    label: '🇲🇻 Maldives'
  },
  {
    value: 'mw',
    label: '🇲🇼 Malawi'
  },
  {
    value: 'mx',
    label: '🇲🇽 Mexico'
  },
  {
    value: 'my',
    label: '🇲🇾 Malaysia'
  },
  {
    value: 'mz',
    label: '🇲🇿 Mozambique'
  },
  {
    value: 'na',
    label: '🇳🇦 Namibia'
  },
  {
    value: 'nc',
    label: '🇳🇨 New Caledonia'
  },
  {
    value: 'ne',
    label: '🇳🇪 Niger'
  },
  {
    value: 'nf',
    label: '🇳🇫 Norfolk Island'
  },
  {
    value: 'ng',
    label: '🇳🇬 Nigeria'
  },
  {
    value: 'ni',
    label: '🇳🇮 Nicaragua'
  },
  {
    value: 'nl',
    label: '🇳🇱 Netherlands'
  },
  {
    value: 'no',
    label: '🇳🇴 Norway'
  },
  {
    value: 'np',
    label: '🇳🇵 Nepal'
  },
  {
    value: 'nr',
    label: '🇳🇷 Nauru'
  },
  {
    value: 'nu',
    label: '🇳🇺 Niue'
  },
  {
    value: 'nz',
    label: '🇳🇿 New Zealand'
  },
  {
    value: 'om',
    label: '🇴🇲 Oman'
  },
  {
    value: 'pa',
    label: '🇵🇦 Panama'
  },
  {
    value: 'pe',
    label: '🇵🇪 Peru'
  },
  {
    value: 'pf',
    label: '🇵🇫 French Polynesia'
  },
  {
    value: 'pg',
    label: '🇵🇬 Papua New Guinea'
  },
  {
    value: 'ph',
    label: '🇵🇭 Philippines'
  },
  {
    value: 'pk',
    label: '🇵🇰 Pakistan'
  },
  {
    value: 'pl',
    label: '🇵🇱 Poland'
  },
  {
    value: 'pm',
    label: '🇵🇲 Saint Pierre and Miquelon'
  },
  {
    value: 'pn',
    label: '🇵🇳 Pitcairn'
  },
  {
    value: 'pr',
    label: '🇵🇷 Puerto Rico'
  },
  {
    value: 'ps',
    label: '🇵🇸 Palestine, State of'
  },
  {
    value: 'pt',
    label: '🇵🇹 Portugal'
  },
  {
    value: 'pw',
    label: '🇵🇼 Palau'
  },
  {
    value: 'py',
    label: '🇵🇾 Paraguay'
  },
  {
    value: 'qa',
    label: '🇶🇦 Qatar'
  },
  {
    value: 're',
    label: '🇷🇪 Réunion'
  },
  {
    value: 'ro',
    label: '🇷🇴 Romania'
  },
  {
    value: 'rs',
    label: '🇷🇸 Serbia'
  },
  {
    value: 'ru',
    label: '🇷🇺 Russian Federation'
  },
  {
    value: 'rw',
    label: '🇷🇼 Rwanda'
  },
  {
    value: 'sa',
    label: '🇸🇦 Saudi Arabia'
  },
  {
    value: 'sb',
    label: '🇸🇧 Solomon Islands'
  },
  {
    value: 'sc',
    label: '🇸🇨 Seychelles'
  },
  {
    value: 'sd',
    label: '🇸🇩 Sudan'
  },
  {
    value: 'se',
    label: '🇸🇪 Sweden'
  },
  {
    value: 'sg',
    label: '🇸🇬 Singapore'
  },
  {
    value: 'sh',
    label: '🇸🇭 Saint Helena, Ascension and Tristan da Cunha'
  },
  {
    value: 'si',
    label: '🇸🇮 Slovenia'
  },
  {
    value: 'sj',
    label: '🇸🇯 Svalbard and Jan Mayen'
  },
  {
    value: 'sk',
    label: '🇸🇰 Slovakia'
  },
  {
    value: 'sl',
    label: '🇸🇱 Sierra Leone'
  },
  {
    value: 'sm',
    label: '🇸🇲 San Marino'
  },
  {
    value: 'sn',
    label: '🇸🇳 Senegal'
  },
  {
    value: 'so',
    label: '🇸🇴 Somalia'
  },
  {
    value: 'sr',
    label: '🇸🇷 Suriname'
  },
  {
    value: 'ss',
    label: '🇸🇸 South Sudan'
  },
  {
    value: 'st',
    label: '🇸🇹 Sao Tome and Principe'
  },
  {
    value: 'sv',
    label: '🇸🇻 El Salvador'
  },
  {
    value: 'sx',
    label: '🇸🇽 Sint Maarten (Dutch part)'
  },
  {
    value: 'sy',
    label: '🇸🇾 Syrian Arab Republic'
  },
  {
    value: 'sz',
    label: '🇸🇿 Eswatini'
  },
  {
    value: 'tc',
    label: '🇹🇨 Turks and Caicos Islands'
  },
  {
    value: 'td',
    label: '🇹🇩 Chad'
  },
  {
    value: 'tf',
    label: '🇹🇫 French Southern Territories'
  },
  {
    value: 'tg',
    label: '🇹🇬 Togo'
  },
  {
    value: 'th',
    label: '🇹🇭 Thailand'
  },
  {
    value: 'tj',
    label: '🇹🇯 Tajikistan'
  },
  {
    value: 'tk',
    label: '🇹🇰 Tokelau'
  },
  {
    value: 'tl',
    label: '🇹🇱 Timor-Leste'
  },
  {
    value: 'tm',
    label: '🇹🇲 Turkmenistan'
  },
  {
    value: 'tn',
    label: '🇹🇳 Tunisia'
  },
  {
    value: 'to',
    label: '🇹🇴 Tonga'
  },
  {
    value: 'tr',
    label: '🇹🇷 Turkey'
  },
  {
    value: 'tt',
    label: '🇹🇹 Trinidad and Tobago'
  },
  {
    value: 'tv',
    label: '🇹🇻 Tuvalu'
  },
  {
    value: 'tw',
    label: '🇹🇼 Taiwan, Province of China'
  },
  {
    value: 'tz',
    label: '🇹🇿 Tanzania, United Republic of'
  },
  {
    value: 'ua',
    label: '🇺🇦 Ukraine'
  },
  {
    value: 'ug',
    label: '🇺🇬 Uganda'
  },
  {
    value: 'um',
    label: '🇺🇲 United States Minor Outlying Islands'
  },
  {
    value: 'us',
    label: '🇺🇸 United States'
  },
  {
    value: 'uy',
    label: '🇺🇾 Uruguay'
  },
  {
    value: 'uz',
    label: '🇺🇿 Uzbekistan'
  },
  {
    value: 'va',
    label: '🇻🇦 Holy See (Vatican City State)'
  },
  {
    value: 'vc',
    label: '🇻🇨 Saint Vincent and the Grenadines'
  },
  {
    value: 've',
    label: '🇻🇪 Venezuela, Bolivarian Republic of'
  },
  {
    value: 'vg',
    label: '🇻🇬 Virgin Islands, British'
  },
  {
    value: 'vi',
    label: '🇻🇮 Virgin Islands, U.S.'
  },
  {
    value: 'vn',
    label: '🇻🇳 Việt Nam'
  },
  {
    value: 'vu',
    label: '🇻🇺 Vanuatu'
  },
  {
    value: 'wf',
    label: '🇼🇫 Wallis and Futuna'
  },
  {
    value: 'ws',
    label: '🇼🇸 Samoa'
  },
  {
    value: 'ye',
    label: '🇾🇪 Yemen'
  },
  {
    value: 'yt',
    label: '🇾🇹 Mayotte'
  },
  {
    value: 'za',
    label: '🇿🇦 South Africa'
  },
  {
    value: 'zm',
    label: '🇿🇲 Zambia'
  },
  {
    value: 'zw',
    label: '🇿🇼 Zimbabwe'
  }
];

export interface BankInfo {
  bin: string;
  shortName: string;
  name: string;
  bankLogoUrl: string;
  isVietQr: boolean;
  isNapas: boolean;
  isDisburse: boolean;
}

export const BANK_INFO_MAPPING: Record<string, BankInfo> = {
  KLB: {
    bin: '970452',
    shortName: 'KienLongBank',
    name: 'Ngân hàng TMCP Kiên Long',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/KLB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  STB: {
    bin: '970403',
    shortName: 'Sacombank',
    name: 'Ngân hàng TMCP Sài Gòn Thương Tín',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/STB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  IBKHN: {
    bin: '970455',
    shortName: 'IBKHN',
    name: 'Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh Hà Nội',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_ibk_bank.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  BIDV: {
    bin: '970418',
    shortName: 'BIDV',
    name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/BIDV.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  VRB: {
    bin: '970421',
    shortName: 'VRB',
    name: 'Ngân hàng Liên doanh Việt - Nga',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/VRB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  KEBHANAHCM: {
    bin: '970466',
    shortName: 'Keb Hana - HCM',
    name: 'Ngân hàng KEB Hana – Chi nhánh Thành phố Hồ Chí Minh',
    bankLogoUrl: 'https://img.mservice.com.vn/app/img/payment/KEBHANAHCM.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  SHB: {
    bin: '970443',
    shortName: 'SHB',
    name: 'Ngân hàng TMCP Sài Gòn - Hà Nội',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/SHB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  PBVN: {
    bin: '970439',
    shortName: 'PublicBank',
    name: 'Ngân hàng TNHH MTV Public Việt Nam',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/PBVN.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  DBS: {
    bin: '796500',
    shortName: 'DBSBank',
    name: 'DBS Bank Ltd - Chi nhánh Thành phố Hồ Chí Minh',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_dbs.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  VARB: {
    bin: '970405',
    shortName: 'Agribank',
    name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/VARB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  CFC: {
    bin: '970460',
    shortName: 'VietCredit',
    name: 'Công ty Tài chính Cổ Phần Tín Việt',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/CFC.png',
    isVietQr: false,
    isNapas: true,
    isDisburse: false
  },
  MB: {
    bin: '970422',
    shortName: 'MBBank',
    name: 'Ngân hàng TMCP Quân đội',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/MB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  VB: {
    bin: '970433',
    shortName: 'VietBank',
    name: 'Ngân hàng TMCP Việt Nam Thương Tín',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/VB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  EIB: {
    bin: '970431',
    shortName: 'Eximbank',
    name: 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/EIB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  VNPTMONEY: {
    bin: '971011',
    shortName: 'VNPTMoney',
    name: 'VNPT Money',
    bankLogoUrl: 'https://img.mservice.com.vn/app/img/payment/VNPTMONEY.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: false
  },
  SGB: {
    bin: '970400',
    shortName: 'SaigonBank',
    name: 'Ngân hàng TMCP Sài Gòn Công Thương',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/SGB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  CAKE: {
    bin: '546034',
    shortName: 'CAKE',
    name: 'TMCP Việt Nam Thịnh Vượng - Ngân hàng số CAKE by VPBank',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_cake.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  PGB: {
    bin: '970430',
    shortName: 'PGBank',
    name: 'Ngân hàng TMCP Xăng dầu Petrolimex',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/PGB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  NVB: {
    bin: '970419',
    shortName: 'NCB',
    name: 'Ngân hàng TMCP Quốc Dân',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/NVB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  HSBC: {
    bin: '458761',
    shortName: 'HSBC',
    name: 'Ngân hàng TNHH MTV HSBC (Việt Nam)',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_hsbc.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  STANDARD: {
    bin: '970410',
    shortName: 'StandardChartered',
    name: 'Ngân hàng TNHH MTV Standard Chartered Bank Việt Nam',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_standard_chartered.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  TCB: {
    bin: '970407',
    shortName: 'Techcombank',
    name: 'Ngân hàng TMCP Kỹ thương Việt Nam',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/TCB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  IVB: {
    bin: '970434',
    shortName: 'IndovinaBank',
    name: 'Ngân hàng TNHH Indovina',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/IVB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  VCB: {
    bin: '970436',
    shortName: 'VietcomBank',
    name: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/VCB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  KEBHANAHN: {
    bin: '970467',
    shortName: 'Keb Hana- HN',
    name: 'Ngân hàng KEB Hana – Chi nhánh Hà Nội',
    bankLogoUrl: 'https://img.mservice.com.vn/app/img/payment/KEBHANAHCM.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  SVB: {
    bin: '970424',
    shortName: 'ShinhanBank',
    name: 'Ngân hàng TNHH MTV Shinhan Việt Nam',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/SVB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  KBHN: {
    bin: '970462',
    shortName: 'KookminHN',
    name: 'Ngân hàng Kookmin - Chi nhánh Hà Nội',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_kookmin_hn.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  LPB: {
    bin: '970449',
    shortName: 'LPBank',
    name: 'NH TMCP Loc Phat Viet Nam',
    bankLogoUrl: 'https://static.momocdn.net/files/cGF5bWVudHNkaw==/image/LPB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  PVCB: {
    bin: '970412',
    shortName: 'PVcomBank',
    name: 'Ngân hàng TMCP Đại Chúng Việt Nam',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/PVCB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  ABB: {
    bin: '970425',
    shortName: 'ABBANK',
    name: 'Ngân hàng TMCP An Bình',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/ABB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  CBB: {
    bin: '970444',
    shortName: 'CBBank',
    name: 'Ngân hàng Thương mại TNHH MTV Xây dựng Việt Nam',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_cbbank.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  KBHCM: {
    bin: '970463',
    shortName: 'KookminHCM',
    name: 'Ngân hàng Kookmin - Chi nhánh Thành phố Hồ Chí Minh',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_kookmin_hcm.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  HDB: {
    bin: '970437, 970420',
    shortName: 'HDBank',
    name: 'Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/HDB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  TPB: {
    bin: '970423',
    shortName: 'TPBank',
    name: 'Ngân hàng TMCP Tiên Phong',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/TPB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  VPB: {
    bin: '970432',
    shortName: 'VPBank',
    name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/VPB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  Ubank: {
    bin: '546035',
    shortName: 'Ubank',
    name: 'TMCP Việt Nam Thịnh Vượng - Ngân hàng số Ubank by VPBank',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_ubank.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  WOO: {
    bin: '970457',
    shortName: 'Woori',
    name: 'Ngân hàng TNHH MTV Woori Việt Nam',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/WOO.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  MBV: {
    bin: '970414',
    shortName: 'MBV',
    name: 'Ngân hàng TNHH MTV Việt Nam Hiện Đại',
    bankLogoUrl: 'https://static.momocdn.net/files/cGF5bWVudHNkaw==/image/MBV.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  VTLMONEY: {
    bin: '971005',
    shortName: 'ViettelMoney',
    name: 'Viettel Money',
    bankLogoUrl: 'https://img.mservice.com.vn/app/img/payment/VIETTELMONEY.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  SEAB: {
    bin: '970440',
    shortName: 'SeABank',
    name: 'Ngân hàng TMCP Đông Nam Á',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/Seab.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  IBKHCM: {
    bin: '970456',
    shortName: 'IBKHCM',
    name: 'Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh TP. Hồ Chí Minh',
    bankLogoUrl: 'https://img.mservice.com.vn/app/img/payment/IBK.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  COB: {
    bin: '970446',
    shortName: 'COOPBANK',
    name: 'Ngân hàng Hợp tác xã Việt Nam',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_coop_bank.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  MSB: {
    bin: '970426',
    shortName: 'MSB',
    name: 'Ngân hàng TMCP Hàng Hải',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/MSB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  ACB: {
    bin: '970416',
    shortName: 'ACB',
    name: 'Ngân hàng TMCP Á Châu',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/ACB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  NASB: {
    bin: '970409',
    shortName: 'BacABank',
    name: 'Ngân hàng TMCP Bắc Á',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/NASB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  CIMB: {
    bin: '422589',
    shortName: 'CIMB',
    name: 'Ngân hàng TNHH MTV CIMB Việt Nam',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_cimb.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  VCCB: {
    bin: '970454',
    shortName: 'VietCapitalBank',
    name: 'Ngân hàng TMCP Bản Việt',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/VCCB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  KBankHCM: {
    bin: '668888',
    shortName: 'KBank',
    name: 'Ngân hàng Đại chúng TNHH Kasikornbank',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_kbank.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  CTG: {
    bin: '970415',
    shortName: 'VietinBank',
    name: 'Ngân hàng TMCP Công thương Việt Nam',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/CTG.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  UOB: {
    bin: '970458',
    shortName: 'UnitedOverseas',
    name: 'Ngân hàng United Overseas - Chi nhánh TP. Hồ Chí Minh',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/UOB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  HLB: {
    bin: '970442',
    shortName: 'HongLeong',
    name: 'Ngân hàng TNHH MTV Hong Leong Việt Nam',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_hong_leon_bank.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  NAB: {
    bin: '970428',
    shortName: 'NamABank',
    name: 'Ngân hàng TMCP Nam Á',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/NAB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  VIB: {
    bin: '970441',
    shortName: 'VIB',
    name: 'Ngân hàng TMCP Quốc tế Việt Nam',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/VIB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  BVB: {
    bin: '970438',
    shortName: 'BaoVietBank',
    name: 'Ngân hàng TMCP Bảo Việt',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/BVB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  OCB: {
    bin: '970448',
    shortName: 'OCB',
    name: 'Ngân hàng TMCP Phương Đông',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/OCB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  TIMO: {
    bin: '963388',
    shortName: 'Timo',
    name: 'Ngân hàng số Timo by Ban Viet Bank (Timo by Ban Viet Bank)',
    bankLogoUrl: 'https://img.mservice.com.vn/app/img/payment/TIMO.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  NonghyupBankHN: {
    bin: '801011',
    shortName: 'Nonghyup',
    name: 'Ngân hàng Nonghyup - Chi nhánh Hà Nội',
    bankLogoUrl: 'https://img.mservice.io/momo_app_v2/new_version/All_team_/new_logo_bank/ic_nonghyu.png',
    isVietQr: true,
    isNapas: false,
    isDisburse: true
  },
  MAFC: {
    bin: '970468',
    shortName: 'MTV Mirae Asset',
    name: 'Công ty Tài chính TNHH MTV Mirae Asset (Việt Nam)',
    bankLogoUrl: 'https://img.mservice.com.vn/app/img/payment/MAFC.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  SCB: {
    bin: '970429',
    shortName: 'SCB',
    name: 'Ngân hàng TMCP Sài Gòn',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/SCB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  VAB: {
    bin: '970427',
    shortName: 'VietABank',
    name: 'Ngân hàng TMCP Việt Á',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/VAB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  GPB: {
    bin: '970408',
    shortName: 'GPBank',
    name: 'Ngân hàng Thương mại TNHH MTV Dầu Khí Toàn Cầu',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/GPB.png',
    isVietQr: true,
    isNapas: true,
    isDisburse: true
  },
  CITI: {
    bin: '533948',
    shortName: 'CITI',
    name: 'NH Citi',
    bankLogoUrl: 'https://static.momocdn.net/app/img/momo_app_v2/new_version/All_team/bank/ic_citibank.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  VBSP: {
    bin: '999888',
    shortName: 'VBSP',
    name: 'Ngân Hàng Chính Sách Xã Hội',
    bankLogoUrl: 'https://static.momocdn.net/app/img/momo_app_v2/new_version/All_team/bank/ic_vbsp.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  PVcomBankPay: {
    bin: '971133',
    shortName: 'PVcomBank Pay',
    name: 'PVcomBank Pay',
    bankLogoUrl: 'https://img.mservice.com.vn/momo_app_v2/img/PVCB.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  BNPPARIBASHN: {
    bin: '963668',
    shortName: 'BNP PARIBAS HN',
    name: 'Ngân hàng BNP Paribas - CN Hà Nội',
    bankLogoUrl: 'https://static.momocdn.net/app/img/momo_app_v2/new_version/All_team/bank/ic_bnp.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  BNPPARIBASHCM: {
    bin: '963666',
    shortName: 'BNP PARIBAS HCM',
    name: 'Ngân hàng BNP Paribas - CN TP.HCM',
    bankLogoUrl: 'https://static.momocdn.net/app/img/momo_app_v2/new_version/All_team/bank/ic_bnp.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  CUBHCM: {
    bin: '168999',
    shortName: 'Cathay -HCM',
    name: 'Ngân hàng Cathay United - CN TP.HCM',
    bankLogoUrl: 'https://static.momocdn.net/app/img/momo_app_v2/new_version/All_team/bank/ic_cub.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  BIDC: {
    bin: '555666',
    shortName: 'BIDC',
    name: 'Đầu tư và Phát triển Campuchia - Chi nhánh Hà Nội',
    bankLogoUrl: 'https://static.momocdn.net/app/img/momo_app_v2/new_version/All_team/bank/ic_bidc.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  SVFC: {
    bin: '963368',
    shortName: 'Tài chính Shinhan',
    name: 'Công ty Tài chính TNHH MTV Shinhan Việt Nam',
    bankLogoUrl: 'https://static.momocdn.net/app/img/momo_app_v2/new_version/All_team/bank/ic_shinhan_finance.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  BOCHK: {
    bin: '963688',
    shortName: 'Bank of China (HK) - HCM',
    name: 'Ngân hàng Bank of China (Hongkong) Limited – Chi nhánh Hồ Chí Minh',
    bankLogoUrl: 'https://static.momocdn.net/app/img/momo_app_v2/new_version/All_team/bank/ic_bochk.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  VikkiHDBANK: {
    bin: '963311',
    shortName: 'Vikki by HDBank',
    name: 'Vikki by HDBank',
    bankLogoUrl: 'https://static.momocdn.net/app/img/momo_app_v2/new_version/All_team/bank/ic_vikki.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  Umee: {
    bin: '963399',
    shortName: 'Umee',
    name: 'UMEE by Kienlongbank',
    bankLogoUrl: 'https://static.momocdn.net/app/img/momo_app_v2/new_version/All_team/bank/ic_umee.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  Liobank: {
    bin: '963369',
    shortName: 'Liobank',
    name: 'Liobank by OCB',
    bankLogoUrl: 'https://static.momocdn.net/app/img/momo_app_v2/new_version/All_team/bank/ic_lio.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  MVAS: {
    bin: '971032',
    shortName: 'MVAS',
    name: 'Trung tâm Dịch vụ số Mobifone - CN Tổng Công ty viễn thông Mobifone',
    bankLogoUrl: 'https://static.momocdn.net/app/img/momo_app_v2/new_version/All_team/bank/ic_mvas.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: true
  },
  MCREDIT: {
    bin: '970470',
    shortName: 'MB SHINSEI',
    name: 'Công ty Tài chính TNHH MB SHINSEI',
    bankLogoUrl: 'https://static.momocdn.net/app/img/payment_sdk/mcredit.png',
    isVietQr: false,
    isNapas: true,
    isDisburse: false
  },
  MoMo: {
    bin: '971025',
    shortName: 'MoMo',
    name: 'Công ty Dịch vụ đi động trực tuyến M_Service',
    bankLogoUrl: 'https://static.momocdn.net/app/img/payment/logovuong.png',
    isVietQr: false,
    isNapas: false,
    isDisburse: false
  }
};
