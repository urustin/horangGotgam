// API Configuration
export const API_BASE_URL = "https://horang.dev.ericfromkorea.com:50001";

// For local development, uncomment the line below and comment the line above:
// export const API_BASE_URL = "http://localhost:5008";

// Product prices and configuration
export const PRODUCT_PRICES = {
    gotgam: {
        product1: 32000,
        product2: 45000,
        product3: 65000,
        product4: 85000,
        product5: 110000
    },
    durup: {
        durup1: 25000,
        durup2: 15000
    }
};

// Shipping configuration
export const SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 4000;

// Product types
export const PRODUCT_TYPES = "gotgam" ; // "gotgam" or "durup"
export const IS_AVAILABLE = true; // true or false

// Bank account information
export const BANK_INFO = "농협 352-1386-3306-83 이광호";
export const CONTACT_PHONE = "01090609281";

// Site configuration
export const SITE_URL = "https://horang-gotgam.vercel.app";

// Meta tags configuration
export const META_TAGS = {
    gotgam: {
        title: "해청농원 곶감 주문페이지",
        description: "해청농원 곶감 주문하기",
        image: "/images/gotgam/1.jpeg"
    },
    durup: {
        title: "해청농원 두릅 주문페이지",
        description: "해청농원 산두릅(참두릅) 주문하기",
        image: "/images/durup/1_1.jpg"
    }
};
