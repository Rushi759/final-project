import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../Styles/agriFinance.css';
import { MainContext } from '../../context/agroguru_context';
import { FiArrowLeft } from 'react-icons/fi';

const MAHA_SCHEMES = [
  { 
    id: 1, 
    title: "Namo Shetkari Mahasanman", 
    title_mr: "नमो शेतकरी महासन्मान", 
    amount: "₹6,000 / Year", 
    desc: "Additional state grant for PM-Kisan beneficiaries in MH.", 
    desc_mr: "पीएम-किसान लाभार्थ्यांसाठी अतिरिक्त राज्य अनुदान.", 
    match: 98, categories: ['General', 'OBC', 'SC', 'ST', 'VJ/NT'], maxIncome: 1000000, region: 'State',
    docs: ["Aadhaar Card", "7/12 & 8A Land Records", "Aadhaar-Linked Bank Account", "PM-Kisan ID/Status"],
    docs_mr: ["आधार कार्ड", "७/१२ आणि ८अ उतारा", "आधारशी जोडलेले बँक खाते", "पीएम-किसान लाभार्थी स्थिती"]
  },
  { 
    id: 2, 
    title: "Magel Tyala Shet Tale", 
    title_mr: "मागेल त्याला शेततळे", 
    amount: "₹50,000 Grant", 
    desc: "Subsidies for farm pond construction for individual farmers.", 
    desc_mr: "शेततळे बांधण्यासाठी ५०,००० रुपयांचे अनुदान.", 
    match: 92, categories: ['General', 'OBC', 'SC', 'ST', 'VJ/NT'], maxLand: 10, region: 'Drought-Prone',
    docs: ["7/12 & 8A Extract", "Small Farmer Certificate", "Caste Certificate (if applicable)", "Agreement Bond"],
    docs_mr: ["७/१२ आणि ८अ उतारा", "अल्पभूधारक प्रमाणपत्र", "जातीचा दाखला (आवश्यक असल्यास)", "करारनामा"]
  },
  { 
    id: 3, 
    title: "Dr. Ambedkar Krushi Swavalamban", 
    title_mr: "डॉ. आंबेडकर कृषी स्वावलंबन", 
    amount: "Up to ₹2.5 Lakh", 
    desc: "Package for SC farmers for new wells and pump sets.", 
    desc_mr: "अनुसूचित जातीच्या शेतकऱ्यांसाठी नवीन विहिरी आणि पंप संच.", 
    match: 95, categories: ['SC'], maxIncome: 150000, region: 'State',
    docs: ["Caste Certificate (SC)", "Income Certificate (<1.5L)", "7/12 & 8A Extract", "Well/Pump Quotation"],
    docs_mr: ["जातीचा दाखला (SC)", "उत्पन्न दाखला (<१.५ लाख)", "७/१२ आणि ८अ उतारा", "विहीर/पंप कोटेशन"]
  },
  { 
    id: 4, 
    title: "Birsa Munda Krushi Kranti", 
    title_mr: "बिरसा मुंडा कृषी क्रांती", 
    amount: "Up to ₹2.5 Lakh", 
    desc: "Comprehensive strategy for ST farmers for irrigation assets.", 
    desc_mr: "अनुसूचित जमातीच्या शेतकऱ्यांसाठी सिंचन सुविधा योजना.", 
    match: 95, categories: ['ST'], maxIncome: 150000, region: 'State',
    docs: ["Caste Certificate (ST)", "Income Certificate (<1.5L)", "7/12 & 8A Extract", "Asset/Pump Quotation"],
    docs_mr: ["जातीचा दाखला (ST)", "उत्पन्न दाखला (<१.५ लाख)", "७/१२ आणि ८अ उतारा", "मालमत्ता/पंप कोटेशन"]
  },
  { 
    id: 5, 
    title: "PM-KUSUM (Solar Pump)", 
    title_mr: "पीएम-कुसुम (सौर पंप)", 
    amount: "90% Subsidy", 
    desc: "Solar pump installations for reliable irrigation energy.", 
    desc_mr: "शाश्वत सिंचनासाठी ९०% अनुदानावर सौर पंप संच.", 
    match: 88, categories: ['General', 'OBC', 'SC', 'ST', 'VJ/NT'], maxLand: 5, region: 'State',
    docs: ["7/12 Extract", "Water Source Certificate (Well/Bore)", "Aadhaar Card", "Bank Passbook Copy"],
    docs_mr: ["७/१२ उतारा", "पाण्याचा स्त्रोत प्रमाणपत्र (विहीर/बोअरवेल)", "आधार कार्ड", "बँक पासबुक छायांकित प्रत"]
  },
  { 
    id: 6, 
    title: "Micro-Irrigation (Drip/Sprinkler)", 
    title_mr: "सूक्ष्म सिंचन (ठिबक/तुषार)", 
    amount: "80% Subsidy", 
    desc: "Grants for water-saving irrigation technology.", 
    desc_mr: "पाणी बचतीसाठी ठिबक आणि तुषार सिंचन अनुदान योजना.", 
    match: 85, categories: ['General', 'OBC', 'SC', 'ST', 'VJ/NT'], maxLand: 2, region: 'Drought-Prone',
    docs: ["7/12 & 8A Extract", "Aadhaar Card", "Bank Passbook", "Drip/Sprinkler Quotation"],
    docs_mr: ["७/१२ आणि ८अ उतारा", "आधार कार्ड", "बँक पासबुक", "ठिबक/तुषार सिंचन कोटेशन"]
  },
  { 
    id: 7, 
    title: "Agri-Mechanization Support", 
    title_mr: "कृषी यांत्रिकीकरण उप-अभियान", 
    amount: "50% Discount", 
    desc: "Subsidies for Tractors and specialized farm equipment.", 
    desc_mr: "ट्रॅक्टर आणि इतर कृषी अवजारांसाठी ५०% पर्यंत सूट.", 
    match: 80, categories: ['SC', 'ST', 'Small', 'Marginal'], maxIncome: 500000, region: 'State',
    docs: ["Aadhaar Card", "Bank Passbook", "Tractor/Machine Quotation", "7/12 Record"],
    docs_mr: ["आधार कार्ड", "बँक पासबुक", "ट्रॅक्टर/मशिन कोटेशन", "७/१२ उतारा"]
  },
  { 
    id: 8, 
    title: "PM-Kisan Samman Nidhi", 
    title_mr: "पीएम-किसान सन्मान निधी", 
    amount: "₹6,000 / Year", 
    desc: "Central government direct benefit transfer scheme.", 
    desc_mr: "केंद्र सरकारची थेट लाभ हस्तांतरण योजना.", 
    match: 100, categories: ['General', 'OBC', 'SC', 'ST', 'VJ/NT'], maxIncome: 2000000, region: 'State',
    docs: ["Aadhaar Card", "Land Records (7/12)", "Mobile Linked Aadhaar", "Bank Passbook"],
    docs_mr: ["आधार कार्ड", "जमीन रेकॉर्ड (७/१२)", "आधारशी लिंक मोबाईल", "बँक पासबुक"]
  },
  { 
    id: 10, 
    title: "Gopinath Munde Insurance", 
    title_mr: "गोपीनाथ मुंडे शेतकरी विमा", 
    amount: "₹2 Lakh Cover", 
    desc: "Accident insurance scheme for farmers in Maharashtra.", 
    desc_mr: "शेतकऱ्यांसाठी गोपीनाथ मुंडे अपघात विमा योजना.", 
    match: 100, categories: ['General', 'OBC', 'SC', 'ST', 'VJ/NT'], region: 'State',
    docs: ["Accident Report/FIR Copy", "7/12 of Deceased", "Heir Certificate (Waraspanti)", "Aadhaar Card"],
    docs_mr: ["अपघात अहवाल/FIR ची प्रत", "मृत व्यक्तीचा ७/१२ उतारा", "वारस प्रमाणपत्र", "आधार कार्ड"]
  },
];

const MAHA_DISTRICTS = [
    "Pune (पुणे)", "Nagpur (नागपूर)", "Nashik (नाशिक)", "Ahmednagar (अहमदनगर)", "Aurangabad (औरंगाबाद)", 
    "Satara (सातारा)", "Kolhapur (कोल्हापूर)", "Ratnagiri (रत्नागिरी)", "Sindhudurg (सिंधुदुर्ग)", 
    "Amravati (अमरावती)", "Latur (लातूर)", "Solapur (सोलापूर)", "Jalgaon (जळगाव)", "Raigad (रायगड)"
];

const TRANSLATIONS = {
    en: {
        vault_title: "Maharashtra Subsidy Vault",
        vault_subtitle: "Powered by AgroGuru Neural Link. Instantly unlock Maharashtra State and Central government agricultural grants.",
        return_btn: "Return to Hub",
        portal_title: "Digital Eligibility Portal",
        label_income: "Annual Farm Income (₹)",
        label_land: "Land Size",
        label_caste: "Farmer Category (Caste)",
        label_district: "Select District",
        placeholder_income: "Enter annual income",
        btn_compute: "Secure Eligibility Link",
        btn_official: "View Official Portals",
        classification: "Farmer Classification:",
        precision_warn: "🛡️ Neural Link: Data precision warning. Please enter a realistic annual income (minimum ₹10,000) for accurate matching.",
        requirement_warn: "🛡️ Neural Link requires records. Please enter both your income and land size to unlock matching schemes.",
        no_matches: "No matching schemes found for your current profile.",
        header_matches: "Unlocked Potential Schemes:",
        header_no_matches: "No Eligible Schemes Identified",
        neural_sync: "(Neural Syncing...)",
        loan_title: "Agri-Finance Intelligence",
        emi_label: "Estimated Monthly EMI",
        interest_label: "Total Interest",
        repayment_label: "Total Repayment",
        caste_gen: "General",
        caste_obc: "OBC Category",
        caste_sc: "SC (Scheduled Caste)",
        caste_st: "ST (Scheduled Tribe)",
        caste_vj: "VJ / NT Category",
        btn_passport: "Download Subsidy Passport",
        loan_amount: "Loan Amount",
        interest_rate: "Interest Rate",
        tenure: "Tenure",
        months: "Months",
        passport_title: "SUBSIDY ELIGIBILITY PASSPORT",
        close_passport: "CLOSE PASSPORT",
        btn_print: "PRINT PASSPORT",
        unit_ha: "Hectare",
        unit_gn: "Guntha",
        holder_income: "HOLDER INCOME",
        land_assets: "LAND ASSETS",
        unlocked: "UNLOCKED BENEFITS:",
        scan_pass: "Scan this digital pass at your nearest Seva Kendra or Gram Panchayat for priority processing.",
        sync_msg: "NEURAL DATA SYNC ACTIVE...",
        bypass_msg: "Bypassing MahaDBT Firewall...",
        farmer_marginal: "Marginal Farmer",
        farmer_small: "Small Farmer",
        farmer_large: "Medium/Large Farmer",
        farmer_awaiting: "Awaiting Records",
        label_docs: "Required Documents for Submission:"
    },
    mr: {
        vault_title: "महाराष्ट्र अनुदान तिजोरी",
        vault_subtitle: "अॅग्रोगुरू न्यूरल लिंकद्वारे समर्थित. महाराष्ट्र राज्य आणि केंद्र सरकारी कृषी अनुदाने त्वरित शोधा.",
        return_btn: "मुख्य पेजवर जा",
        portal_title: "डिजिटल पात्रता पोर्टल",
        label_income: "वार्षिक शेती उत्पन्न (₹)",
        label_land: "जमिनीचा आकार",
        label_caste: "शेतकरी श्रेणी (जात)",
        label_district: "जिल्हा निवडा",
        placeholder_income: "वार्षिक उत्पन्न प्रविष्ट करा",
        btn_compute: "पात्रता लिंक तपासा",
        btn_official: "अधिकृत पोर्टल पहा",
        classification: "शेतकऱ्याचे वर्गीकरण:",
        precision_warn: "🛡️ न्यूरल लिंक: डेटा अचूकता चेतावणी. कृपया अचूक जुळणीसाठी वास्तववादी वार्षिक उत्पन्न (किमान ₹१०,०००) प्रविष्ट करा.",
        requirement_warn: "🛡️ न्यूरल लिंकला रेकॉर्ड आवश्यक आहेत. योजना पाहण्यासाठी तुमचे उत्पन्न आणि जमीन दोन्ही प्रविष्ट करा.",
        no_matches: "तुमच्या सध्याच्या प्रोफाईलसाठी कोणत्याही जुळणाऱ्या योजना सापडल्या नाहीत.",
        header_matches: "अनलॉक केलेल्या संभाव्य योजना:",
        header_no_matches: "कोणतीही पात्र योजना आढळली नाही",
        neural_sync: "(न्यूरल सिंकिंग...)",
        loan_title: "कृषी-वित्त बुद्धिमत्ता",
        emi_label: "अंदाजे मासिक EMI",
        interest_label: "एकूण व्याज",
        repayment_label: "एकूण परतफेड",
        caste_gen: "सामान्य (General)",
        caste_obc: "इतर मागास वर्ग (OBC)",
        caste_sc: "अनुसूचित जाती (SC)",
        caste_st: "अनुसूचित जमाती (ST)",
        caste_vj: "व्ही.जे. / एन.टी. (VJ/NT)",
        btn_passport: "अनुदान पासपोर्ट डाउनलोड करा",
        loan_amount: "कर्ज रक्कम",
        interest_rate: "व्याज दर",
        tenure: "कालावधी",
        months: "महिने",
        passport_title: "अनुदान पात्रता पासपोर्ट",
        close_passport: "पासपोर्ट बंद करा",
        btn_print: "दस्तावेज प्रिंट करा",
        unit_ha: "हेक्टर",
        unit_gn: "गुंठा",
        holder_income: "धारकाचे उत्पन्न",
        land_assets: "जमीन मालमत्ता",
        unlocked: "मिळलेले फायदे:",
        scan_pass: "प्राधान्याने प्रक्रियेसाठी हा डिजिटल पास तुमच्या जवळच्या सेवा केंद्रात किंवा ग्रामपंचायतीमध्ये दाखवा.",
        sync_msg: "न्यूरल डेटा सिंक सक्रिय...",
        bypass_msg: "MahaDBT फायरवॉल बायपास करत आहे...",
        farmer_marginal: "अल्पभूधारक शेतकरी",
        farmer_small: "लहान शेतकरी",
        farmer_large: "मध्यम/मोठा शेतकरी",
        farmer_awaiting: "प्रतीक्षेत",
        label_docs: "सादरीकरणासाठी आवश्यक कागदपत्रे:"
    }
};

const AgriFinance = () => {
  const { setSpin, language, setLanguage } = useContext(MainContext);
  const resultsRef = useRef(null);
  const [loanAmount, setLoanAmount] = useState(0);
  const [tenure, setTenure] = useState(12);
  const [rate, setRate] = useState(7);

  const [income, setIncome] = useState(0);
  const [landSize, setLandSize] = useState(''); // Always stored in Hectares
  const [landUnit, setLandUnit] = useState('Hectare');
  const [category, setCategory] = useState('General');
  const [district, setDistrict] = useState(MAHA_DISTRICTS[0]);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [showPassport, setShowPassport] = useState(false);
  const [expandedSchemeId, setExpandedSchemeId] = useState(null);

  useEffect(() => {
    if (showPassport) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showPassport]);

  const t = TRANSLATIONS[language];

  // EMI Logic
  const monthlyRate = rate / (12 * 100);
  const emi = loanAmount > 0 ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)) : 0;
  const totalPayable = emi * tenure;
  const interest = totalPayable - loanAmount;

  // handleIncomeChange with "Smart 0" replacement and strict digit cleaning
  const handleIncomeChange = (e) => {
    let raw = e.target.value.replace(/[^0-9]/g, '');
    
    // If current value is 0 and user types a digit, replace the 0
    if (income === 0 && raw.length > 1 && raw.startsWith('0')) {
        raw = raw.substring(1);
    }
    
    setIncome(raw === '' ? 0 : parseInt(raw, 10));
  };

  const handleLandChange = (e) => {
    const val = e.target.value;
    // Allow positive decimals only, max 7 chars for land
    if (/^\d*\.?\d*$/.test(val) && val.length <= 7) {
        setLandSize(val);
    }
  };

  const getDisplayLand = () => {
    if (landSize === '' || landSize === null) return '';
    if (landUnit === 'Guntha' && !isNaN(landSize)) {
        return (parseFloat(landSize) * 98.842).toFixed(2);
    }
    return landSize;
  };

  const blockNegative = (e) => {
    if (e.key === '-' || e.key === 'e') {
        e.preventDefault();
    }
  };

  const computeEligibility = () => {
    // Strict Data Requirement: BOTH Income and Land must be non-zero
    if (Number(income) === 0 || Number(landSize) === 0) {
        setIsAnalyzing(false);
        setShowResults(true);
        setEligibleSchemes([]);
        return;
    }

    // Reality Guard: Prevent unrealistically low income entries (e.g., < ₹10,000)
    if (Number(income) > 0 && Number(income) < 10000) {
        setIsAnalyzing(false);
        setShowResults(true);
        setEligibleSchemes([]);
        return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Cinematic Analysis Delay
    setTimeout(() => {
        const filtered = MAHA_SCHEMES.map(scheme => {
            const currentIncome = Number(income) || 0;
            const currentLand = Number(landSize) || 0;
            
            const incomeOk = !scheme.maxIncome || currentIncome <= scheme.maxIncome;
            const casteOk = scheme.categories.includes(category);
            const landOk = !scheme.maxLand || (currentLand > 0 && currentLand <= scheme.maxLand);
            
            if (incomeOk && casteOk && landOk) {
                // Dynamic Neural Scoring
                let score = 85; // Base Match
                
                // Income Bonus: Lower income = Higher priority
                if (scheme.maxIncome) {
                    const incomeRatio = 1 - (currentIncome / scheme.maxIncome);
                    score += (incomeRatio * 10);
                }
                
                // Land Bonus: Priority for Small/Marginal farmers (under 2 Ha)
                if (currentLand > 0 && currentLand <= 2) {
                    score += 5;
                }
                
                return { ...scheme, match: Math.min(100, Math.round(score)) };
            }
            return null;
        }).filter(s => s !== null);
        
        setEligibleSchemes(filtered);
        setIsAnalyzing(false);
        setShowResults(true);
    }, 600);
  };

  const getFarmerType = () => {
    const size = Number(landSize);
    if (size === 0) return { label: t.farmer_awaiting, color: 'rgba(255,255,255,0.2)', width: '5%' };
    if (size < 1) return { label: t.farmer_marginal, color: '#f59e0b', width: '30%' };
    if (size <= 2) return { label: t.farmer_small, color: '#10b981', width: '60%' };
    return { label: t.farmer_large, color: '#3b82f6', width: '90%' };
  };

  const farmerType = getFarmerType();

  return (
    <>
    <div className={`agri-finance-container fade-in ${language === 'mr' ? 'marathi-mode' : ''}`}>
      <header className="finance-hologram-header">
         <div className="back-nav-container">
            <Link to="/services" className="elite-back-btn">
               <FiArrowLeft /> {t.return_btn}
            </Link>
         </div>

         <h1 className="hologram-title">{t.vault_title}</h1>
         <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto' }}>
            {t.vault_subtitle}
         </p>
      </header>

      <div className="finance-grid-masterpiece">
        <div className="intelligence-cell">
          {isAnalyzing && (
            <div className="finance-scan-mask">
              <div className="scan-ring-finance"></div>
              <h4 style={{ marginTop: '20px', color: 'rgba(255,255,255,0.8)' }}>
                {t.sync_msg}
              </h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                {t.bypass_msg}
              </p>
            </div>
          )}

          <div className="cell-header">
            <i>🛡️</i>
            <h3>{t.portal_title}</h3>
          </div>

          <div className="modern-input-group">
            <label>{t.label_district}</label>
            <div className="premium-input-wrap">
              <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                {MAHA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="modern-input-group">
            <label>{t.label_income}</label>
            <div className="premium-input-wrap">
              <input 
                type="text" 
                inputMode="numeric"
                value={income === 0 ? '' : income.toLocaleString('en-IN')} 
                onChange={handleIncomeChange}
                onKeyDown={blockNegative}
                placeholder={t.placeholder_income} 
              />
            </div>
          </div>

          <div className="modern-input-group">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ margin: 0 }}>{t.label_land} ({landUnit === 'Hectare' ? t.unit_ha : t.unit_gn})</label>
                <div className="unit-toggle-pill">
                    <button className={`unit-btn ${landUnit === 'Hectare' ? 'active' : ''}`} onClick={() => setLandUnit('Hectare')}>HA</button>
                    <button className={`unit-btn ${landUnit === 'Guntha' ? 'active' : ''}`} onClick={() => setLandUnit('Guntha')}>GN</button>
                </div>
            </div>
            <div className="premium-input-wrap">
              <input 
                type="text" 
                inputMode="decimal"
                value={getDisplayLand()} 
                onChange={handleLandChange}
                onKeyDown={blockNegative}
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="modern-input-group">
            <label>{t.label_caste}</label>
            <div className="premium-input-wrap">
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="General">{t.caste_gen}</option>
                <option value="OBC">{t.caste_obc}</option>
                <option value="SC">{t.caste_sc}</option>
                <option value="ST">{t.caste_st}</option>
                <option value="VJ/NT">{t.caste_vj}</option>
              </select>
            </div>
          </div>

          <div className="category-visual-chart">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>{t.classification}</span>
              <span style={{ color: farmerType.color, fontWeight: '800' }}>
                {farmerType.label}
              </span>
            </div>
            <div className="tier-bar">
                <div className="tier-fill" style={{ width: farmerType.width, backgroundColor: farmerType.color }}></div>
            </div>
          </div>

          <button className="compute-btn-hologram" onClick={computeEligibility}>
            {t.btn_compute}
          </button>

          {(isAnalyzing || showResults) && (
            <div className="scheme-vault-results fade-in" ref={resultsRef}>
               <h5 style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {showResults && eligibleSchemes.length === 0 ? t.header_no_matches : t.header_matches} 
                  {isAnalyzing && <span style={{ fontSize: '0.7rem', color: '#f59e0b', animation: 'pulse 1s infinite' }}>{t.neural_sync}</span>}
               </h5>
               
               {showResults && (
                 <>
                  {eligibleSchemes.length > 0 ? (
                    <>
                      {eligibleSchemes.map(scheme => (
                         <div 
                            key={scheme.id} 
                            className={`scheme-card-premium fade-in ${expandedSchemeId === scheme.id ? 'expanded' : ''}`}
                            onClick={() => setExpandedSchemeId(expandedSchemeId === scheme.id ? null : scheme.id)}
                            style={{ cursor: 'pointer' }}
                         >
                            <div className="match-accuracy-dial">{scheme.match}%</div>
                            <div className="scheme-info">
                                <h4>{language === 'mr' ? scheme.title_mr : scheme.title}</h4>
                                <p>{scheme.amount} • {language === 'mr' ? scheme.desc_mr : scheme.desc}</p>
                                
                                {expandedSchemeId === scheme.id && (
                                    <div className="documents-blueprint fade-in">
                                        <h5 style={{ marginTop: '15px', color: '#f59e0b', fontSize: '0.85rem' }}>📋 {t.label_docs}</h5>
                                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                                            {(language === 'mr' ? scheme.docs_mr : scheme.docs).map((doc, idx) => (
                                                <li key={idx} style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', gap: '8px', marginBottom: '5px' }}>
                                                    <span style={{ color: '#f59e0b' }}>✓</span> {doc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                         </div>
                      ))}
                      <button 
                        className="compute-btn-hologram" 
                        onClick={() => setShowPassport(true)}
                        style={{ marginTop: '20px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                      >
                        🏅 {t.btn_passport}
                      </button>
                    </>
                  ) : (
                    <p style={{ fontSize: '0.9rem', opacity: 0.6, background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                        {Number(income) > 0 && Number(income) < 10000 
                          ? t.precision_warn
                          : (Number(income) === 0 || Number(landSize) === 0 
                             ? t.requirement_warn
                             : t.no_matches)
                        }
                    </p>
                  )}
                  <a 
                    href="https://mahadbt.maharashtra.gov.in/Farmer/Login/Login" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="compute-btn-hologram" 
                    style={{ display: 'block', textAlign: 'center', textDecoration: 'none', background: 'rgba(255,255,255,0.05)', marginTop: '20px' }}
                  >
                    {t.btn_official}
                  </a>
                 </>
               )}
            </div>
          )}
        </div>

        <div className="intelligence-cell" style={{ alignSelf: 'flex-start' }}>
          <div className="cell-header">
            <i>🏦</i>
            <h3>{t.loan_title}</h3>
          </div>
          
          <div className="modern-input-group">
            <label>{t.loan_amount}: ₹{loanAmount.toLocaleString()}</label>
            <input type="range" min="0" max="5000000" step="10000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} style={{ width: '100%', accentColor: 'rgba(255, 255, 255, 0.4)' }} />
          </div>

          <div className="modern-input-group">
            <label>{t.interest_rate}: {rate}%</label>
            <input type="range" min="1" max="15" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: '100%', accentColor: 'rgba(255, 255, 255, 0.4)' }} />
          </div>

          <div className="modern-input-group">
            <label>{t.tenure}: {tenure} {t.months}</label>
            <input type="range" min="6" max="120" step="6" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} style={{ width: '100%', accentColor: 'rgba(255, 255, 255, 0.4)' }} />
          </div>

          <div className="emi-result-display" style={{ background: 'rgba(0,0,0,0.3)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>{t.emi_label}</span>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'rgba(255,255,255,0.9)' }}>₹{emi.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ opacity: 0.6 }}>{t.interest_label}</span>
                <span style={{ fontWeight: '700' }}>₹{interest.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '5px' }}>
                <span style={{ opacity: 0.6 }}>{t.repayment_label}</span>
                <span style={{ fontWeight: '700' }}>₹{totalPayable.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    {showPassport && (
        <div className="prediction-scan-overlay" style={{ background: 'rgba(0,0,0,0.95)', position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="passport-card-premium fade-in" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '40px', borderRadius: '30px', border: '3px solid #f59e0b', width: '90%', maxWidth: '600px', position: 'relative', boxShadow: '0 0 50px rgba(245, 158, 11, 0.3)', zIndex: 100000 }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#f59e0b', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>{t.passport_title}</h2>
                    <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>MAHARASHTRA STATE PORTAL • {district}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.7rem', opacity: 0.5, margin: 0 }}>{t.holder_income}</p>
                        <p style={{ fontWeight: 'bold' }}>₹{income.toLocaleString('en-IN')}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.7rem', opacity: 0.5, margin: 0 }}>{t.land_assets}</p>
                        <p style={{ fontWeight: 'bold' }}>{getDisplayLand()} {landUnit === 'Hectare' ? 'HA' : 'GN'}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <p style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '10px' }}>{t.unlocked}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {eligibleSchemes.slice(0, 4).map(s => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderLeft: '2px solid #f59e0b', paddingLeft: '15px' }}>
                                <span>{language === 'mr' ? s.title_mr : s.title}</span>
                                <span style={{ color: '#f59e0b' }}>✓</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '0.7rem', marginBottom: '10px' }}>{t.scan_pass}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="compute-btn-hologram" onClick={() => window.print()} style={{ background: '#f59e0b', color: '#000', flex: 1 }}>
                           🖨️ {t.btn_print}
                        </button>
                        <button className="compute-btn-hologram" onClick={() => setShowPassport(false)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', flex: 1 }}>
                            {t.close_passport}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export default AgriFinance;
