const API = {
    AUTH: {
        LOGIN: "/auth/login",
        SIGNUP: "/auth/signup",
        REFRESH: "/auth/refresh",
        LOGOUT: "/auth/logout"
    },
    USER: {
        PROFILE: "/user/profile",
    },
    PRACTICE: {
        START: "/practice/start",
    },

    MOCK: {
        START: "/mock/start",
        SUBMIT: "/mock/submit",
    },

    PAYMENT: {
        CREATE_ORDER: "/payment/create-order",
    },
    DASHBOARD: "/dashboard/summary",
};

export default API;
