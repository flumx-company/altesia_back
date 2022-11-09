import { APP_CONSTANTS } from './common/constants/constants';

export const AppRoutes = {
  AUTH_URL: {
    CLIENT: APP_CONSTANTS.CLIENT_URL_PREFIX,
  },
  ROLE_URL: {
    CLIENT: `${APP_CONSTANTS.CLIENT_URL_PREFIX}/roles`,
    ADMIN: `${APP_CONSTANTS.ADMIN_URL_PREFIX}/roles`,
  },
  USER_URL: (requireApostrophe = false) => {
    const param = requireApostrophe ? 'users' : 'user';
    return {
      CLIENT: `${APP_CONSTANTS.CLIENT_URL_PREFIX}/${param}`,
      ADMIN: `${APP_CONSTANTS.ADMIN_URL_PREFIX}/${param}`,
    };
  },
  USER_FEATURE_URL: {
    CLIENT: `${APP_CONSTANTS.CLIENT_URL_PREFIX}/user-features`,
    ADMIN: `${APP_CONSTANTS.ADMIN_URL_PREFIX}/user-features`,
  },
  COMMUNITY_QUESTION_URL: {
    CLIENT: `${APP_CONSTANTS.CLIENT_URL_PREFIX}/community-questions`,
    ADMIN: `${APP_CONSTANTS.ADMIN_URL_PREFIX}/community-questions`,
  },
  COMMUNITY_CATEGORY_URL: {
    CLIENT: `${APP_CONSTANTS.CLIENT_URL_PREFIX}/community-categories`,
    ADMIN: `${APP_CONSTANTS.ADMIN_URL_PREFIX}/community-categories`,
  },
  COMMUNITY_RESPONSE_URL: {
    CLIENT: `${APP_CONSTANTS.CLIENT_URL_PREFIX}/community-responses`,
    ADMIN: `${APP_CONSTANTS.ADMIN_URL_PREFIX}/community-responses`,
  },
  EVENT_URL: {
    CLIENT: `${APP_CONSTANTS.CLIENT_URL_PREFIX}/events`,
    ADMIN: `${APP_CONSTANTS.ADMIN_URL_PREFIX}/events`,
  },
  OPPORTUNITY_URL: {
    CLIENT: `${APP_CONSTANTS.CLIENT_URL_PREFIX}/opportunities`,
    ADMIN: `${APP_CONSTANTS.ADMIN_URL_PREFIX}/opportunities`,
  },
  OPPORTUNITY_ALERT_URL: {
    CLIENT: `${APP_CONSTANTS.CLIENT_URL_PREFIX}/opportunity-alerts`,
    ADMIN: `${APP_CONSTANTS.ADMIN_URL_PREFIX}/opportunity-alerts`,
  },
  INDUSTRY_URL: {
    CLIENT: `${APP_CONSTANTS.CLIENT_URL_PREFIX}/industries`,
    ADMIN: `${APP_CONSTANTS.ADMIN_URL_PREFIX}/industries`,
  },
  MISSION_URL: {
    CLIENT: `${APP_CONSTANTS.CLIENT_URL_PREFIX}/missions`,
    ADMIN: `${APP_CONSTANTS.ADMIN_URL_PREFIX}/missions`,
  },
  SPECIALTY_URL: {
    CLIENT: `${APP_CONSTANTS.CLIENT_URL_PREFIX}/specialties`,
    ADMIN: `${APP_CONSTANTS.ADMIN_URL_PREFIX}/specialties`,
  },
};
