/**
 * SchemeSathi – Seed Script (Execution Layer)
 * Populates Firebase Firestore with 12 real Indian government schemes
 *
 * Usage: node execution/seed_schemes.js
 * Run once after setting up Firebase credentials in Backend/.env
 */

require('dotenv').config({ path: '../Backend/.env' });
const admin = require('firebase-admin');

// Initialize Firebase
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
    serviceAccount = require('../Backend/firebase/serviceAccountKey.json');
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const schemes = [
    {
        name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        category: 'Agriculture',
        state: 'all',
        description:
            'Under PM-KISAN, the Central Government provides income support of ₹6,000 per year to all landholding farmer families across the country. The benefit is transferred directly to their bank accounts in three equal installments of ₹2,000 every four months.',
        eligibility: {
            min_age: 18,
            max_age: 0,
            gender: 'any',
            income_limit: 0,
            occupation: 'farmer',
            state: 'all',
        },
        required_documents: ['Aadhaar Card', 'Land Records (Khasra/Khatauni)', 'Bank Passbook', 'Mobile Number'],
        application_process:
            '1. Visit your nearest Common Service Centre (CSC) or the official PM-KISAN portal (pmkisan.gov.in).\n2. Fill the registration form with Aadhaar, bank, and land details.\n3. Village level verification by the Patwari/Revenue officer.\n4. Funds credited directly to bank account after approval.',
        deadlines: 'No fixed deadline – ongoing scheme. Apply anytime.',
        official_link: 'https://pmkisan.gov.in',
        summary:
            '₹6,000/year direct income support to small and marginal farmers in 3 installments of ₹2,000.',
    },
    {
        name: 'PMAY-G (Pradhan Mantri Awas Yojana – Gramin)',
        category: 'Housing',
        state: 'all',
        description:
            'PMAY-G aims to provide pucca houses with basic amenities to homeless and houseless rural families. Beneficiaries receive ₹1.20 lakh in plains and ₹1.30 lakh in hilly/difficult areas for house construction, along with MGNREGA wages for 90 days of unskilled labor.',
        eligibility: {
            min_age: 18,
            max_age: 0,
            gender: 'any',
            income_limit: 200000,
            occupation: 'any',
            state: 'all',
        },
        required_documents: ['Aadhaar Card', 'BPL Certificate', 'Bank Passbook', 'SECC 2011 data enrollment', 'Residence Proof'],
        application_process:
            '1. Beneficiaries are selected from SECC 2011 data by Gram Panchayat.\n2. Register through AwaasSoft portal or Gram Panchayat.\n3. Complete Awaas+ survey.\n4. Funds transferred in installments tied to construction milestones.',
        deadlines: 'Ongoing. Contact local Gram Panchayat for current enrollment periods.',
        official_link: 'https://pmayg.nic.in',
        summary:
            'Financial assistance up to ₹1.30 lakh to build a pucca house for rural BPL families.',
    },
    {
        name: 'Beti Bachao Beti Padhao',
        category: 'Women',
        state: 'all',
        description:
            "Beti Bachao Beti Padhao (BBBP) is a Government of India campaign to address the declining Child Sex Ratio (CSR) and promote the welfare, education, and empowerment of the girl child. It provides financial incentives, awareness campaigns, and educational support for girls across India.",
        eligibility: {
            min_age: 0,
            max_age: 18,
            gender: 'female',
            income_limit: 0,
            occupation: 'any',
            state: 'all',
        },
        required_documents: ['Aadhaar Card of Parent/Guardian', 'Birth Certificate of Girl Child', 'Bank Passbook', 'Income Certificate'],
        application_process:
            '1. Visit nearest Anganwadi Centre or local government office.\n2. Open a Sukanya Samriddhi Account in post office or bank.\n3. Enroll girl child in the scheme.\n4. Benefits and incentives credited periodically.',
        deadlines: 'Ongoing scheme. No specific deadline.',
        official_link: 'https://wcd.nic.in/bbbp-schemes',
        summary:
            'Promotes welfare and education of girl children through financial support and awareness programs across India.',
    },
    {
        name: 'National Scholarship Portal (NSP) Schemes',
        category: 'Education',
        state: 'all',
        description:
            'The National Scholarship Portal (NSP) provides a single platform for various government scholarship schemes for meritorious students from economically weaker sections. Scholarships cover pre-matric, post-matric, and merit-cum-means categories across SC, ST, OBC, and minority communities.',
        eligibility: {
            min_age: 6,
            max_age: 30,
            gender: 'any',
            income_limit: 250000,
            occupation: 'student',
            state: 'all',
        },
        required_documents: ['Aadhaar Card', 'Income Certificate', 'Caste Certificate (if applicable)', 'Bank Passbook', 'Previous Year Marksheet', 'Bonafide Student Certificate'],
        application_process:
            '1. Register on scholarships.gov.in using Aadhaar.\n2. Fill the application form and select the relevant scholarship.\n3. Upload required documents.\n4. Submit and track status through the portal.',
        deadlines: 'Applications typically open August–November each year. Check NSP portal.',
        official_link: 'https://scholarships.gov.in',
        summary:
            'Single portal for central and state government scholarships for students from EWS/SC/ST/OBC/minority backgrounds.',
    },
    {
        name: 'PM Jan Arogya Yojana (Ayushman Bharat – PM-JAY)',
        category: 'Health',
        state: 'all',
        description:
            "PM-JAY is India's flagship health insurance scheme providing health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization. It is the world's largest government-funded healthcare program covering over 10.74 crore poor and vulnerable families.",
        eligibility: {
            min_age: 0,
            max_age: 0,
            gender: 'any',
            income_limit: 200000,
            occupation: 'any',
            state: 'all',
        },
        required_documents: ['Aadhaar Card', 'SECC Database (automatic)', 'Ration Card (BPL)', 'PM-JAY Registration Letter'],
        application_process:
            '1. Check eligibility at pmjay.gov.in using your Aadhaar or ration card.\n2. Visit nearest Ayushman Mitra or empanelled hospital.\n3. Get your e-card generated.\n4. Avail cashless treatment at any empanelled hospital.',
        deadlines: 'No enrollment deadline – ongoing. Verify eligibility anytime.',
        official_link: 'https://pmjay.gov.in',
        summary:
            '₹5 lakh/year Health insurance for low-income families, covering hospitalization at 25,000+ hospitals. Completely cashless.',
    },
    {
        name: 'Sukanya Samriddhi Yojana (SSY)',
        category: 'Women',
        state: 'all',
        description:
            "Sukanya Samriddhi Yojana is a small deposit scheme for the girl child launched as part of the 'Beti Bachao Beti Padhao' campaign. It offers one of the highest interest rates (currently 8.2% p.a.) on deposits and tax benefits under Section 80C, with the maturity amount used for girl's education and marriage.",
        eligibility: {
            min_age: 0,
            max_age: 10,
            gender: 'female',
            income_limit: 0,
            occupation: 'any',
            state: 'all',
        },
        required_documents: ["Girl Child's Birth Certificate", "Parent/Guardian's Aadhaar Card and PAN Card", 'Address Proof', 'Passport-size Photos'],
        application_process:
            '1. Visit nearest post office or authorized bank (SBI, private banks).\n2. Fill SSY account opening form.\n3. Submit documents and initial deposit (minimum ₹250).\n4. Account matures after 21 years from opening or on girl\'s marriage after 18.',
        deadlines: 'Account must be opened before girl child turns 10.',
        official_link: 'https://www.india.gov.in/sukanya-samriddhi-yojna',
        summary:
            'High-interest (8.2% p.a.) savings scheme for girl child education & marriage with tax-free returns.',
    },
    {
        name: 'MGNREGA (Mahatma Gandhi NREGS)',
        category: 'Labor',
        state: 'all',
        description:
            "MGNREGA guarantees 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work. It provides a legally guaranteed right to work and helps create durable assets in rural areas while boosting livelihood security.",
        eligibility: {
            min_age: 18,
            max_age: 0,
            gender: 'any',
            income_limit: 0,
            occupation: 'any',
            state: 'all',
        },
        required_documents: ['Aadhaar Card', 'Job Card (issued by Gram Panchayat)', 'Bank Passbook', 'Residence Proof'],
        application_process:
            '1. Apply for a Job Card at your Gram Panchayat (GP).\n2. Once you have a Job Card, demand work from the GP.\n3. Work will be allocated within 15 days of demand.\n4. Wages paid directly to bank/post office account within 15 days of work.',
        deadlines: 'No deadline. Apply anytime at Gram Panchayat.',
        official_link: 'https://nrega.nic.in',
        summary:
            '100 days guaranteed wage employment per year for rural households. Wages paid directly to bank account.',
    },
    {
        name: 'PM Shram Yogi Maan-dhan (PMSYM)',
        category: 'Labor',
        state: 'all',
        description:
            'PM-SYM is a voluntary and contributory pension scheme for unorganized workers. Workers between 18-40 years with monthly income up to ₹15,000 can enroll. Upon reaching 60, they receive ₹3,000/month as pension. The Government matches the contribution amount.',
        eligibility: {
            min_age: 18,
            max_age: 40,
            gender: 'any',
            income_limit: 180000,
            occupation: 'any',
            state: 'all',
        },
        required_documents: ['Aadhaar Card', 'Bank Passbook / IFSC Code', 'Mobile Number'],
        application_process:
            '1. Visit nearest CSC centre or enroll via maandhan.in.\n2. Provide Aadhaar and savings bank account details.\n3. Monthly contribution amount auto-deducted (₹55–₹200/month based on age).\n4. Government adds equal matching contribution.',
        deadlines: 'Ongoing. Must enroll before age 40.',
        official_link: 'https://maandhan.in',
        summary:
            '₹3,000/month pension after age 60 for unorganized workers. Government matches your monthly contribution.',
    },
    {
        name: 'Kisan Credit Card (KCC)',
        category: 'Agriculture',
        state: 'all',
        description:
            'Kisan Credit Card provides farmers timely and adequate credit to meet agricultural and allied activities needs. It provides revolving credit facility with interest subvention (currently 3% for timely repayment), making effective rate as low as 4% p.a. for up to ₹3 lakh.',
        eligibility: {
            min_age: 18,
            max_age: 75,
            gender: 'any',
            income_limit: 0,
            occupation: 'farmer',
            state: 'all',
        },
        required_documents: ['Aadhaar Card', 'Land Records (Khasra Number)', 'Bank Account', 'Passport-size Photo', 'Application Form from Bank'],
        application_process:
            '1. Visit your nearest cooperative/commercial/regional rural bank.\n2. Fill KCC application form with land and crop details.\n3. Bank assesses and sanctions credit limit.\n4. KCC issued within 14 days of complete application.',
        deadlines: 'No fixed deadline. Apply anytime at your bank branch.',
        official_link: 'https://www.nabard.org/kisan-credit-card.aspx',
        summary:
            'Flexible crop loan at 4% interest (with timely repayment) up to ₹3 lakh for farmers – no collateral for loans up to ₹1.6 lakh.',
    },
    {
        name: 'PM Fasal Bima Yojana (PMFBY)',
        category: 'Agriculture',
        state: 'all',
        description:
            "PMFBY provides comprehensive crop insurance coverage and financial support to farmers suffering crop loss/damage due to unforeseen events like natural calamities, pests and diseases. Premium rates are very low (2% for Kharif, 1.5% for Rabi crops, 5% for commercial/horticultural crops).",
        eligibility: {
            min_age: 18,
            max_age: 0,
            gender: 'any',
            income_limit: 0,
            occupation: 'farmer',
            state: 'all',
        },
        required_documents: ['Aadhaar Card', 'Land Records / Lease Agreement', 'Bank Account', 'Sown Certificate from Patwari'],
        application_process:
            '1. Enroll at nearest bank branch, CSC, or pmfby.gov.in portal before the cut-off date for each season.\n2. Pay minimal premium (2% for Kharif, 1.5% for Rabi).\n3. In case of crop loss, notify within 72 hours via helpline 14447.\n4. Claim assessed and settled directly to bank account.',
        deadlines: 'Enroll before sowing season. For Kharif: July 31. For Rabi: December 31.',
        official_link: 'https://pmfby.gov.in',
        summary:
            'Crop insurance at 2% premium for Kharif & 1.5% for Rabi. Government pays the rest. Claim settled directly to bank.',
    },
    {
        name: 'PM Ujjwala Yojana (PMUY)',
        category: 'Women',
        state: 'all',
        description:
            "PM Ujjwala Yojana provides free LPG connections to women from Below Poverty Line households to protect their health from indoor air pollution caused by burning biomass. Under Ujjwala 2.0, migrants are also eligible with self-declaration as address proof.",
        eligibility: {
            min_age: 18,
            max_age: 0,
            gender: 'female',
            income_limit: 100000,
            occupation: 'any',
            state: 'all',
        },
        required_documents: ['Aadhaar Card', 'BPL Ration Card / SECC 2011 data', 'Bank Passbook', 'Passport Photo', 'Address Proof'],
        application_process:
            '1. Visit nearest LPG distributor (HP Gas, Indane, Bharat Gas).\n2. Fill KYC form (Form B) available at distributor.\n3. Submit documents including BPL certificate.\n4. Free LPG connection with initial refill at subsidized rate.',
        deadlines: 'No fixed deadline. Ongoing scheme.',
        official_link: 'https://www.pmuy.gov.in',
        summary:
            'Free LPG gas connection for BPL women households. Includes first refill at discounted price. Clean cooking fuel for rural women.',
    },
    {
        name: 'National Health Mission (NHM) – Janani Suraksha Yojana',
        category: 'Health',
        state: 'all',
        description:
            'Janani Suraksha Yojana (JSY) under NHM promotes institutional delivery among poor pregnant women. It provides cash incentives to pregnant women who deliver in government health facilities. The scheme focuses on reducing maternal and infant mortality.',
        eligibility: {
            min_age: 14,
            max_age: 45,
            gender: 'female',
            income_limit: 150000,
            occupation: 'any',
            state: 'all',
        },
        required_documents: ['Aadhaar Card', 'Pregnancy Registration Card', 'Bank Passbook', 'BPL Certificate', 'JSY Card (from ASHA worker)'],
        application_process:
            '1. Register pregnancy at nearest Sub-Centre, PHC or CHC.\n2. Contact your ASHA (Accredited Social Health Activist) worker.\n3. Deliver baby at a government hospital or accredited private facility.\n4. Cash incentive (₹1,400 in rural areas) transferred to bank account post-delivery.',
        deadlines: 'Register as early in pregnancy as possible.',
        official_link: 'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=308',
        summary:
            '₹1,400 cash incentive for poor pregnant women who deliver at government hospitals. Promotes safe institutional childbirth.',
    },
];

async function seedSchemes() {
    console.log('🌱 Starting scheme seeding...\n');
    const collection = db.collection('schemes');

    for (const scheme of schemes) {
        try {
            // Use a clean slug-like ID from the scheme name
            const id = scheme.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
                .substring(0, 50);

            await collection.doc(id).set(scheme);
            console.log(`✅ Seeded: ${scheme.name}`);
        } catch (err) {
            console.error(`❌ Failed to seed "${scheme.name}":`, err.message);
        }
    }

    console.log('\n🎉 Seeding complete! Total schemes:', schemes.length);
    process.exit(0);
}

seedSchemes();
