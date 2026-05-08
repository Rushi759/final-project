import React, { useState, useContext, useRef, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import '../../Styles/FertilizerCalc.css'
import { MainContext } from '../../context/agroguru_context'
import { FiSearch, FiLayers, FiCheck, FiX, FiDownload, FiMap, FiMaximize, FiCommand, FiArrowLeft, FiCpu, FiRadio, FiActivity } from 'react-icons/fi'
import { myList } from '../../crop-list'

// FULL 61 CROP DATABASE WITH SCIENTIFIC N-P-K RATIOS
const fertilizerData = {
  // GRAINS
  Rice: { N: 120, P: 60, K: 40, water: 'High', mr_water: 'जास्त', soil: 'Clay/Loamy', mr_soil: 'चिकणमाती/लोमी', tips: 'Apply N in 3 splits', mr_tips: 'नत्र ३ हप्त्यांमध्ये द्या: पेरणीवेळी, फुटवे येताना आणि लोंबी बाहेर पडताना.', cat: 'grains' },
  Wheat: { N: 120, P: 60, K: 40, water: 'Medium', mr_water: 'मध्यम', soil: 'Loamy', mr_soil: 'लोमी', tips: 'Apply half N at sowing', mr_tips: 'अर्धे नत्र पेरणीवेळी आणि अर्धे पहिल्या सिंचनावेळी द्या.', cat: 'grains' },
  Maize: { N: 150, P: 60, K: 40, water: 'Medium', mr_water: 'मध्यम', soil: 'Well-drained loamy', mr_soil: 'निचऱ्याची लोमी जमीन', tips: 'Side-dress N at knee-high stage', mr_tips: 'गुडघा उंचीच्या अवस्थेत नत्राचा दुसरा हप्ता द्या.', cat: 'grains' },
  Barley: { N: 80, P: 40, K: 40, water: 'Medium', mr_water: 'मध्यम', soil: 'Sandy Loam', mr_soil: 'रेताड लोमी', tips: 'Avoid late N application', mr_tips: 'उशिरा नत्र देणे टाळा, जेणेकरून दाण्यांची गुणवत्ता टिकून राहील.', cat: 'grains' },
  'Pearl Millet': { N: 80, P: 40, K: 40, water: 'Low', mr_water: 'कमी', soil: 'Sandy', mr_soil: 'रेताड जमीन', tips: 'Thin early for development', mr_tips: 'सुरुवातीला विरळणी करा जेणेकरून कणीस चांगले भरेल.', cat: 'grains' },
  Sorghum: { N: 100, P: 50, K: 40, water: 'Low', mr_water: 'कमी', soil: 'Clay Loam', mr_soil: 'चिकणमाती लोम', tips: 'Apply basal dose thoroughly', mr_tips: 'पायाभूत खताचा हप्ता पेरणीवेळी नीट द्या.', cat: 'grains' },

  // FRUITS
  Coconut: { N: 100, P: 50, K: 150, water: 'High', mr_water: 'जास्त', soil: 'Sandy/Alluvial', mr_soil: 'रेताड/गाळाची', tips: 'Apply in basin 6ft from trunk', mr_tips: 'खोडापासून ६ फूट अंतरावर आळ्यात खत द्या.', cat: 'fruits' },
  Papaya: { N: 200, P: 200, K: 200, water: 'Medium', mr_water: 'मध्यम', soil: 'Well-drained', mr_soil: 'निचऱ्याची जमीन', tips: 'Heavy feeder, apply monthly', mr_tips: 'हे पीक खताला हपापलेले असते, दरमहा डोस द्या.', cat: 'fruits' },
  Orange: { N: 150, P: 75, K: 100, water: 'Medium', mr_water: 'मध्यम', soil: 'Alluvial', mr_soil: 'गाळाची जमीन', tips: 'Micronutrients are vital', mr_tips: 'सूक्ष्म अन्नद्रव्यांचा वापर फळांची गळती रोखण्यासाठी करा.', cat: 'fruits' },
  Apple: { N: 100, P: 50, K: 100, water: 'Medium', mr_water: 'मध्यम', soil: 'Hilly/Loamy', mr_soil: 'डोंगाळ/लोमी', tips: 'Apply during dormancy', mr_tips: 'सुप्त अवस्थेत खत देणे फळधारणेसाठी फायदेशीर ठरते.', cat: 'fruits' },
  Muskmelon: { N: 80, P: 40, K: 60, water: 'Low', mr_water: 'कमी', soil: 'Sandy', mr_soil: 'रेताड जमीन', tips: 'Stop N before ripening', mr_tips: 'फळ पिकण्यापूर्वी नत्र देणे थांबवा जेणेकरून गोडवा वाढेल.', cat: 'fruits' },
  Watermelon: { N: 100, P: 50, K: 100, water: 'Medium', mr_water: 'मध्यम', soil: 'Sandy Loam', mr_soil: 'रेताड लोमी', tips: 'High K for sweetness', mr_tips: 'गोडव्यासाठी जास्तीत जास्त पोटॅशचा वापर करा.', cat: 'fruits' },
  Grapes: { N: 100, P: 100, K: 200, water: 'Medium', mr_water: 'मध्यम', soil: 'Sandy Loam', mr_soil: 'रेताड लोमी', tips: 'Apply after pruning', mr_tips: 'छाटणीनंतर खताचा मुख्य हप्ता द्या.', cat: 'fruits' },
  Mango: { N: 100, P: 50, K: 100, water: 'Medium', mr_water: 'मध्यम', soil: 'Laterite', mr_soil: 'जांभी जमीन', tips: 'Apply before monsoon', mr_tips: 'पावसाळा सुरू होण्यापूर्वी झाडाच्या परिघात खत टाका.', cat: 'fruits' },
  Banana: { N: 200, P: 60, K: 300, water: 'High', mr_water: 'जास्त', soil: 'Heavy Loam', mr_soil: 'भारी लोमी जमीन', tips: 'Split into 6 doses', mr_tips: 'खताचा डोस ६ समान हप्त्यांमध्ये विभागून द्या.', cat: 'fruits' },
  Pomegranate: { N: 150, P: 80, K: 100, water: 'Medium', mr_water: 'मध्यम', soil: 'Light/Medium', mr_soil: 'हलकी/मध्यम जमीन', tips: 'Conduct soil test yearly', mr_tips: 'फळधारणेसाठी वर्षातून एकदा माती परीक्षण जरूर करा.', cat: 'fruits' },

  // PULSES
  Lentil: { N: 20, P: 40, K: 20, water: 'Low', mr_water: 'कमी', soil: 'Loamy', mr_soil: 'लोमी', tips: 'Rhizobium inoculation needed', mr_tips: 'बीजप्रक्रियेसाठी रायझोबियमचा वापर करा.', cat: 'pulses' },
  Blackgram: { N: 20, P: 50, K: 20, water: 'Low', mr_water: 'कमी', soil: 'Black Soil', mr_soil: 'काळी जमीन', tips: 'Apply P as basal dose', mr_tips: 'स्फुरद खत पेरणीवेळी पायाभूत डोस म्हणून द्या.', cat: 'pulses' },
  Greengram: { N: 20, P: 50, K: 20, water: 'Low', mr_water: 'कमी', soil: 'Loamy', mr_soil: 'लोमी जमीन', tips: 'Keep field weed-free', mr_tips: 'सुरुवातीच्या ३० दिवसांत शेत तणमुक्त ठेवा.', cat: 'pulses' },
  'Moth Beans': { N: 15, P: 40, K: 15, water: 'Very Low', mr_water: 'खूप कमी', soil: 'Sandy', mr_soil: 'रेताड जमीन', tips: 'Extremely drought hardy', mr_tips: 'हे पीक दुष्काळातही तग धरते, खत बेतानेच द्या.', cat: 'pulses' },
  'Pigeon Peas': { N: 25, P: 50, K: 25, water: 'Medium', mr_water: 'मध्यम', soil: 'Deep Black', mr_soil: 'खोल काळी जमीन', tips: 'Long duration crop', mr_tips: 'हे दीर्घकालीन पीक असल्याने फुलोऱ्याच्या वेळी खत द्या.', cat: 'pulses' },
  'Kidney Beans': { N: 40, P: 60, K: 40, water: 'Medium', mr_water: 'मध्यम', soil: 'Silt Loam', mr_soil: 'गाळाची जमीन', tips: 'Sensitive to waterlogging', mr_tips: 'पाणी साचणार नाही याची काळजी घ्या, मुळांना हवा मिळू द्या.', cat: 'pulses' },
  Chickpea: { N: 20, P: 50, K: 20, water: 'Low', mr_water: 'कमी', soil: 'Medium Black', mr_soil: 'मध्यम काळी जमीन', tips: 'Fixes own nitrogen', mr_tips: 'हे पीक हवेतील नत्र शोषते, त्यामुळे जास्त नत्र देऊ नका.', cat: 'pulses' },
  Soybean: { N: 30, P: 80, K: 40, water: 'Medium', mr_water: 'मध्यम', soil: 'Deep Loam', mr_soil: 'खोल लोमी जमीन', tips: 'Apply S for oil content', mr_tips: 'तेलाच्या प्रमाणासाठी गंधकयुक्त खते वापरा.', cat: 'pulses' },
  'Green Peas': { N: 40, P: 60, K: 40, water: 'Medium', mr_water: 'मध्यम', soil: 'Alluvial', mr_soil: 'गाळाची जमीन', tips: 'Apply before winter start', mr_tips: 'हिवाळा सुरू होण्यापूर्वी खत दिल्यास शेंगा जास्त लागतात.', cat: 'pulses' },
  'Horse Gram': { N: 15, P: 30, K: 15, water: 'Very Low', mr_water: 'खूप कमी', soil: 'Marginal', mr_soil: 'हलकी जमीन', tips: 'Good for poor soils', mr_tips: 'हलक्या जमिनीतही हे पीक चांगले येते, मोजकेच खत पुरेसे आहे.', cat: 'pulses' },

  // VEGETABLES
  Potato: { N: 120, P: 80, K: 100, water: 'Medium', mr_water: 'मध्यम', soil: 'Sandy Loam', mr_soil: 'रेताड लोमी', tips: 'Earthing up is mandatory', mr_tips: 'बटाटे हिरवे होऊ नये म्हणून मातीची भर देणे आवश्यक आहे.', cat: 'vegetables' },
  Tomato: { N: 100, P: 100, K: 100, water: 'Medium', mr_water: 'मध्यम', soil: 'Fertile Loam', mr_soil: 'सुपीक लोमी', tips: 'Apply Ca for quality', mr_tips: 'फळ सडणे टाळण्यासाठी कॅल्शियमचा वापर करा.', cat: 'vegetables' },
  Brinjal: { N: 120, P: 60, K: 60, water: 'Medium', mr_water: 'मध्यम', soil: 'Silt Loam', mr_soil: 'सिल्ट लोमी', tips: 'Continuous harvester', mr_tips: 'सतत उत्पादन मिळत असल्याने नत्राचा हप्ता दर ३० दिवसांनी द्या.', cat: 'vegetables' },
  Okra: { N: 100, P: 50, K: 50, water: 'Medium', mr_water: 'मध्यम', soil: 'Loamy', mr_soil: 'लोमी जमीन', tips: 'Soak seeds for germination', mr_tips: 'उगवण चांगली होण्यासाठी बियाणे रात्रभर भिजवा.', cat: 'vegetables' },
  Cabbage: { N: 150, P: 80, K: 80, water: 'Medium', mr_water: 'मध्यम', soil: 'Moist Loam', mr_soil: 'ओलावा असलेली जमीन', tips: 'Avoid heat during heading', mr_tips: 'गड्डा तयार होताना तापमान जास्त असू नये.', cat: 'vegetables' },
  Cauliflower: { N: 120, P: 80, K: 80, water: 'Medium', mr_water: 'मध्यम', soil: 'Heavy Loam', mr_soil: 'भारी लोमी जमीन', tips: 'B deficiency is common', mr_tips: 'बोरोनचे प्रमाण कमी असल्यास गड्डा काळा पडतो, फवारणी करा.', cat: 'vegetables' },
  Carrot: { N: 80, P: 60, K: 100, water: 'Medium', mr_water: 'मध्यम', soil: 'Deep Sandy', mr_soil: 'खोल रेताड जमीन', tips: 'Loose soil for straight roots', mr_tips: 'गाजर वाकडे होऊ नये म्हणून जमीन भुसभुशीत ठेवा.', cat: 'vegetables' },
  Radish: { N: 60, P: 40, K: 40, water: 'Low', mr_water: 'कमी', soil: 'Light Loam', mr_soil: 'हलकी लोमी जमीन', tips: 'Fast crop, harvest small', mr_tips: 'कमी दिवसात येणारे पीक आहे, कोवळे असतानाच काढा.', cat: 'vegetables' },
  Spinach: { N: 100, P: 50, K: 50, water: 'Medium', mr_water: 'मध्यम', soil: 'Rich Loam', mr_soil: 'कसदार लोमी', tips: 'N-rich compost is best', mr_tips: 'जास्त पाल्यासाठी नत्रयुक्त सेंद्रिय खताचा वापर करा.', cat: 'vegetables' },
  Cucumber: { N: 80, P: 60, K: 100, water: 'Medium', mr_water: 'मध्यम', soil: 'Fertile Loam', mr_soil: 'सुपीक लोमी', tips: 'Train on trellis for quality', mr_tips: 'वेलांना आधार दिल्यास फळांची गुणवत्ता चांगली राहते.', cat: 'vegetables' },
  Onion: { N: 100, P: 50, K: 80, water: 'Medium', mr_water: 'मध्यम', soil: 'Sandy Loam', mr_soil: 'रेताड लोमी', tips: 'Stop N 30 days before harvest', mr_tips: 'काढणीपूर्वी नत्र देणे थांबवा, टिकवणक्षमता वाढेल.', cat: 'vegetables' },

  // SPICES
  Turmeric: { N: 150, P: 60, K: 100, water: 'High', mr_water: 'जास्त', soil: 'Deep Loam', mr_soil: 'खोल लोमी', tips: 'Mulching is essential', mr_tips: 'हळदीसाठी आच्छादन (mulching) अत्यंत आवश्यक आहे.', cat: 'spices' },
  Ginger: { N: 100, P: 50, K: 50, water: 'High', mr_water: 'जास्त', soil: 'Sandy Loam', mr_soil: 'रेताड लोमी', tips: 'Raised beds for drainage', mr_tips: 'पाण्याचा निचरा होण्यासाठी गादी वाफे वापरा.', cat: 'spices' },
  Garlic: { N: 100, P: 50, K: 50, water: 'Medium', mr_water: 'मध्यम', soil: 'Sandy Loam', mr_soil: 'रेताड लोमी', tips: 'Avoid storage rot', mr_tips: 'साठवणुकीतील सड टाळण्यासाठी खताचा समतोल ठेवा.', cat: 'spices' },
  Chilli: { N: 150, P: 75, K: 75, water: 'Medium', mr_water: 'मध्यम', soil: 'Well-drained', mr_soil: 'निचऱ्याची जमीन', tips: 'Potash for spice level', mr_tips: 'तिखटपणासाठी पोटॅश खताचा योग्य वापर करा.', cat: 'spices' },
  'Black Pepper': { N: 100, P: 40, K: 140, water: 'High', mr_water: 'जास्त', soil: 'Laterite', mr_soil: 'जांभी जमीन', tips: 'Requires tree support', mr_tips: 'वेलीला आधारासाठी झाडांची गरज असते.', cat: 'spices' },
  Cardamom: { N: 75, P: 75, K: 150, water: 'High', mr_water: 'जास्त', soil: 'Forest Loam', mr_soil: 'जंगलातील लोम जमीन', tips: 'Shade is mandatory', mr_tips: 'सावलीत उत्पादन अधिक चांगले मिळते.', cat: 'spices' },
  Clove: { N: 300, P: 250, K: 750, water: 'High', mr_water: 'जास्त', soil: 'Red Clay', mr_soil: 'लाल चिकणमाती', tips: 'Apply before monsoon', mr_tips: 'पावसाळ्यापूर्वी खताचा डोस देणे योग्य ठरते.', cat: 'spices' },
  Cinnamon: { N: 100, P: 50, K: 100, water: 'High', mr_water: 'जास्त', soil: 'Sandy Loam', mr_soil: 'रेताड लोमी', tips: 'Prune for bark shoots', mr_tips: 'सालीसाठी झाडांची नियमित छाटणी करा.', cat: 'spices' },
  Nutmeg: { N: 250, P: 150, K: 500, water: 'High', mr_water: 'जास्त', soil: 'Deep Red', mr_soil: 'खोल लाल जमीन', tips: 'Separate mace carefully', mr_tips: 'जायफळ आणि जायपत्री वेगळी करताना काळजी घ्या.', cat: 'spices' },
  Vanilla: { N: 40, P: 60, K: 100, water: 'Medium', mr_water: 'मध्यम', soil: 'Rich Humus', mr_soil: 'ह्युमसयुक्त जमीन', tips: 'Hand pollination is key', mr_tips: 'हाताने परागीकरण करणे अत्यंत आवश्यक आहे.', cat: 'spices' },

  // OILSEEDS
  Sunflower: { N: 80, P: 60, K: 40, water: 'Medium', mr_water: 'मध्यम', soil: 'Clay Loam', mr_soil: 'चिकणमाती लोम', tips: 'Track sun for growth', mr_tips: 'चांगल्या वाढीसाठी पूर्ण सूर्यप्रकाश आवश्यक आहे.', cat: 'oilseeds' },
  Mustard: { N: 80, P: 40, K: 40, water: 'Low', mr_water: 'कमी', soil: 'Sandy Loam', mr_soil: 'रेताड लोमी', tips: 'P-rich soil for oil', mr_tips: 'तेलाच्या प्रमाणासाठी स्फुरदयुक्त खते वापरा.', cat: 'oilseeds' },
  Sesame: { N: 60, P: 40, K: 40, water: 'Low', mr_water: 'कमी', soil: 'Light Soil', mr_soil: 'हलकी जमीन', tips: 'Avoid excess water', mr_tips: 'पाणी साचल्यास मुळे सडतात, निचरा ठेवा.', cat: 'oilseeds' },
  Castor: { N: 80, P: 40, K: 40, water: 'Low', mr_water: 'कमी', soil: 'Sandy/Rocky', mr_soil: 'रेताड/खडकाळ', tips: 'Toxic seeds, handle with care', mr_tips: 'बिया विषारी असतात, हाताळताना काळजी घ्या.', cat: 'oilseeds' },
  Groundnut: { N: 20, P: 40, K: 50, water: 'Medium', mr_water: 'मध्यम', soil: 'Sandy Loam', mr_soil: 'रेताड लोमी', tips: 'Gypsum during pegging', mr_tips: 'आरे फुटताना जिप्समचा वापर आवर्जून करा.', cat: 'oilseeds' },

  // FIBER
  Jute: { N: 100, P: 50, K: 50, water: 'High', mr_water: 'जास्त', soil: 'Alluvial', mr_soil: 'गाळाची जमीन', tips: 'Retting process is vital', mr_tips: 'उत्पादनासाठी सडवण्याची प्रक्रिया (Retting) महत्त्वाची आहे.', cat: 'fiber' },
  Cotton: { N: 100, P: 50, K: 50, water: 'Medium', mr_water: 'मध्यम', soil: 'Black Cotton', mr_soil: 'काळी जमीन', tips: 'Apply K for fiber quality', mr_tips: 'धाग्याची लांबी वाढवण्यासाठी पोटॅश वापरा.', cat: 'fiber' },

  // BEVERAGES / PLANTATION
  Tea: { N: 150, P: 60, K: 150, water: 'High', mr_water: 'जास्त', soil: 'Acidic Loam', mr_soil: 'आम्लयुक्त लोम', tips: 'Requires acidic soil', mr_tips: 'चहासाठी जमिनीचा सामू (pH) आम्लयुक्त असावा.', cat: 'plantation' },
  Coffee: { N: 160, P: 60, K: 160, water: 'High', mr_water: 'जास्त', soil: 'Rich Forest', mr_soil: 'कसदार वन जमीन', tips: 'Partial shade needed', mr_tips: 'झाडांना ५०% सावलीची गरज असते.', cat: 'plantation' },
  Rubber: { N: 100, P: 100, K: 100, water: 'High', mr_water: 'जास्त', soil: 'Laterite', mr_soil: 'जांभी जमीन', tips: 'Morning tapping is best', mr_tips: 'चिकासाठी सकाळी लवकर झाडाला चीर पाडा.', cat: 'plantation' },
  'Betel Nut': { N: 100, P: 40, K: 140, water: 'High', mr_water: 'जास्त', soil: 'Laterite', mr_soil: 'जांभी जमीन', tips: 'Sun drying is mandatory', mr_tips: 'सुपारी नीट वाळवणे साठवणुकीसाठी आवश्यक आहे.', cat: 'plantation' },
  Sugarcane: { N: 300, P: 120, K: 150, water: 'Very High', mr_water: 'खूप जास्त', soil: 'Heavy Loam', mr_soil: 'भारी लोमी जमीन', tips: 'Apply in 4 split doses', mr_tips: '४ हप्त्यांमध्ये (लावणीवेळी, तांबडणीवेळी, बांधणीवेळी) खत द्या.', cat: 'plantation' },
  Cocoa: { N: 100, P: 60, K: 140, water: 'High', mr_water: 'जास्त', soil: 'Acidic Loam', mr_soil: 'आम्लयुक्त लोम', tips: 'Best grown under shade', mr_tips: 'केळी किंवा नारळाच्या सावलीत चांगले उत्पादन येते.', cat: 'plantation' },
}

const CATEGORIES = [
  { id: 'all', label: 'All', mr: 'सर्व', icon: '🌈' },
  { id: 'grains', label: 'Grains', mr: 'धान्य', icon: '🌾' },
  { id: 'fruits', label: 'Fruits', mr: 'फळे', icon: '🍎' },
  { id: 'pulses', label: 'Pulses', mr: 'कडधान्य', icon: '🫘' },
  { id: 'vegetables', label: 'Veg', mr: 'भाज्या', icon: '🥗' },
  { id: 'spices', label: 'Spices', mr: 'मसाले', icon: '🌶️' },
  { id: 'oilseeds', label: 'Oilseeds', mr: 'तेलबिया', icon: '🌻' },
  { id: 'fiber', label: 'Fiber', mr: 'धागा', icon: '🧵' },
  { id: 'plantation', label: 'Plantation', mr: 'मळे', icon: '🌳' },
]

const TRANSLATIONS = {
  en: {
    title: "Nutrient Manager Pro",
    subtitle: "Precision N-P-K Intelligence & Organic Strategy",
    back: "Return to Hub",
    land_details: "Field Management",
    select_crop: "Identify Crop",
    search_placeholder: "Type to search 60+ crops...",
    area_label: "Land Area",
    unit_label: "Unit",
    soil_fertility: "Current Soil Health Status",
    fert_low: "Weak Soil",
    fert_med: "Good Soil",
    fert_high: "Rich Soil",
    strategy_label: "Farming Strategy",
    strat_balanced: "Commercial",
    strat_balanced_desc: "Max Yield Potential",
    strat_hybrid: "Eco-Hybrid",
    strat_hybrid_desc: "Balance & Sustainability",
    strat_organic: "Pure Organic",
    strat_organic_desc: "Long-term Soil Health",
    calc_btn: "Execute Prescription",
    reset_btn: "Clear",
    report_title: "Scientific Nutrient Prescription",
    area_report: "Assessment for",
    n_title: "Nitrogen (N)",
    p_title: "Phosphorus (P)",
    k_title: "Potassium (K)",
    urea_lbl: "Urea equivalent",
    dap_lbl: "DAP equivalent",
    mop_lbl: "MOP equivalent",
    cost_title: "Estimated Market Investment",
    cost_avg: "Based on regional price index",
    organic_section: "Organic Alternative (Bio-Boost)",
    organic_desc: "You can replace chemical fertilizers with this organic volume:",
    manure_lbl: "Farm Yard Manure (FYM)",
    savings_lbl: "Potential Cost Savings",
    tips_title: "Technical Guidance",
    guidance: "Intelligence Blueprint",
    tech_id: "DATA-ID",
    sync_status: "SYSTEM OPTIMIZED",
    water: "Water Need",
    soil: "Soil Type",
    download: "📥 Download Strategy",
    choose_crop: "Identify Crop",
    for_text: "assessment for",
    new_report: "New Assessment",
    empty_title: "Enter Field Details",
    empty_desc: "Please fill in your crop and land details above to generate your customized nutrient plan.",
    edit_params: "Edit Parameters",
    return_hub: "Return to Hub",
    generating: "Generating Report...",
    select_variety: "Identify Crop",
    sat_precision: "Field Monitoring",
    climate_sync: "Weather Sync",
    link_active: "Active",
    sync_active: "Syncing..."
  },
  mr: {
    title: "पोषक तत्व व्यवस्थापक प्रो",
    subtitle: "अचूक नत्र-स्फुरद-पालाश नियोजन आणि सेंद्रिय धोरण",
    back: "सेवेकडे परत",
    land_details: "क्षेत्र व्यवस्थापन",
    select_crop: "पीक निवडा",
    search_placeholder: "६०+ पिके शोधा...",
    area_label: "जमीन क्षेत्र",
    unit_label: "एकक",
    soil_fertility: "जमिनीची सद्यस्थिती",
    fert_low: "कमी सुपीक",
    fert_med: "चांगली",
    fert_high: "अत्यंत सुपीक",
    strategy_label: "शेतीची पद्धत",
    strat_balanced: "व्यावसायिक",
    strat_balanced_desc: "जास्तीत जास्त उत्पादन",
    strat_hybrid: "इको-हायब्रिड",
    strat_hybrid_desc: "संतुलित आणि शाश्वत",
    strat_organic: "शुद्ध सेंद्रिय",
    strat_organic_desc: "जमिनीचे आरोग्य",
    calc_btn: "प्रिस्क्रिप्शन कार्यान्वित करा",
    reset_btn: "पुसा",
    report_title: "वैज्ञानिक खत प्रिस्क्रिप्शन",
    area_report: "क्षेत्राचा अहवाल",
    n_title: "नत्र (N)",
    p_title: "स्फुरद (P)",
    k_title: "पालाश (K)",
    urea_lbl: "युरिया प्रमाण",
    dap_lbl: "डीएपी प्रमाण",
    mop_lbl: "एमओपी प्रमाण",
    cost_title: "अंदाजे बाजार गुंतवणूक",
    cost_avg: "प्रादेशिक किंमत निर्देशांकावर आधारित",
    organic_section: "सेंद्रिय पर्याय (बायो-बूस्ट)",
    organic_desc: "तुम्ही रासायनिक खतांच्या जागी हे सेंद्रिय प्रमाण वापरू शकता:",
    manure_lbl: "शेणखत (FYM)",
    savings_lbl: "संभाव्य बचत",
    tips_title: "तांत्रिक मार्गदर्शन",
    guidance: "थेट पीक माहिती",
    tech_id: "डेटा-ID",
    sync_status: "सिस्टम ऑप्टिमाइझ्ड",
    water: "पाण्याची गरज",
    soil: "जमिनीचा प्रकार",
    download: "📥 रणनीती डाउनलोड करा",
    choose_crop: "पीक निवडा",
    for_text: "साठी अहवाल",
    new_report: "नवीन अहवाल",
    empty_title: "शेतीची माहिती भरा",
    empty_desc: "तुमचे सानुकूलित पोषक नियोजन तयार करण्यासाठी कृपया वरील पीक आणि जमिनीचा तपशील भरा.",
    edit_params: "पॅरामीटर्स बदला",
    return_hub: "मुख्य केंद्रावर जा",
    generating: "अहवाल तयार होत आहे...",
    select_variety: "वाण निवडा",
    sat_precision: "सॅटेलाईट सिंक",
    climate_sync: "हवामान सिंक",
    link_active: "सक्रिय",
    sync_active: "सिंक होत आहे..."
  }
}

const FertilizerCalc = () => {
    const { language } = useContext(MainContext);
    const t = TRANSLATIONS[language || 'en'];
    
    // STATE
    const [crop, setCrop] = useState('')
    const [area, setArea] = useState('')
    const [unit, setUnit] = useState('hectare')
    const [fertility, setFertility] = useState('medium')
    const [strategy, setStrategy] = useState('balanced')
    const [result, setResult] = useState(null)

    // PICKER STATE
    const [isPickerOpen, setIsPickerOpen] = useState(false)
    const [pickerSearch, setPickerSearch] = useState('')
    const [activeCat, setActiveCat] = useState('all')
    const [isGenerating, setIsGenerating] = useState(false)
    const pickerRef = useRef();

    // CLOSE PICKER ON OUTSIDE CLICK
    useEffect(() => {
      const handleOutside = (e) => {
        if (pickerRef.current && !pickerRef.current.contains(e.target)) {
          setIsPickerOpen(false)
        }
      }
      document.addEventListener('mousedown', handleOutside);
      return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const filteredCrops = useMemo(() => {
      return Object.keys(fertilizerData).filter(c => {
        const cropMeta = myList.find(m => m.name === c);
        const searchLower = pickerSearch.toLowerCase();
        
        const matchesName = c.toLowerCase().includes(searchLower);
        const matchesMnName = cropMeta?.mr_name?.toLowerCase().includes(searchLower);
        const matchesCat = activeCat === 'all' || fertilizerData[c].cat === activeCat;
        
        return (matchesName || matchesMnName) && matchesCat;
      });
    }, [pickerSearch, activeCat, language]);

    const getDisplayName = (cropName) => {
      if (language !== 'mr') return cropName;
      const cropMeta = myList.find(m => m.name === cropName);
      return cropMeta?.mr_name || cropName;
    };

    const convertToHectare = (value, fromUnit) => {
        const conversions = { 'hectare': 1, 'acre': 0.4047, 'bigha': 0.2529, 'guntha': 0.01012 }
        return value * (conversions[fromUnit] || 1)
    }

    const currentHectares = useMemo(() => {
        return convertToHectare(parseFloat(area) || 0, unit);
    }, [area, unit]);

    const calculate = (e) => {
        e.preventDefault()
        if (!crop || !area || area <= 0) return

        const data = fertilizerData[crop]
        const hectares = convertToHectare(parseFloat(area), unit)
        const scale = { low: 1.25, medium: 1.0, high: 0.8 }[fertility]
        
        const reqN = data.N * hectares * scale;
        const reqP = data.P * hectares * scale;
        const reqK = data.K * hectares * scale;

        // STRATEGY MATH ADJUSTMENT
        let ureaScale = 1.0, dapScale = 1.0, mopScale = 1.0, manureFactor = 0.3;
        
        if (strategy === 'hybrid') {
            ureaScale = 0.5; dapScale = 0.5; mopScale = 0.5; manureFactor = 1.0;
        } else if (strategy === 'organic') {
            ureaScale = 0; dapScale = 0; mopScale = 0; manureFactor = 2.5;
        }

        const manureNeeded = (reqN * manureFactor / 5).toFixed(1);

        setResult({
            crop,
            area: parseFloat(area),
            unit,
            hectares: hectares.toFixed(2),
            n: (reqN * (strategy === 'organic' ? 0 : 1)).toFixed(1),
            p: (reqP * (strategy === 'organic' ? 0 : 1)).toFixed(1),
            k: (reqK * (strategy === 'organic' ? 0 : 1)).toFixed(1),
            urea: (reqN * ureaScale / 0.46).toFixed(1),
            dap: (reqP * dapScale / 0.46).toFixed(1),
            mop: (reqK * mopScale / 0.60).toFixed(1),
            manure: manureNeeded,
            savings: (manureNeeded * 450).toFixed(0),
            totalCost: ((reqN / 0.46) * 7 + (reqP / 0.46) * 28 + (reqK / 0.60) * 34).toFixed(0)
        })
    }

    return (
    <section id="fertilizer-calc" className="fade-in">
      <div className="back-nav-container">
         <Link to="/services" className="elite-back-btn">
            <FiArrowLeft /> {t.back}
         </Link>
      </div>

      <div className="fc-hero-premium">
        <div className="fc-hero-content">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </div>

      <div className="fc-main-grid">
        {/* INPUT PANEL - THE NEURAL FIELD HUB */}
        <div className="fc-input-panel">
          <div className="fc-glass-card highlight-contrast">
            <h2 className="panel-title">
               <FiCpu style={{ color: 'var(--cyber-blue)' }} />
               {t.land_details}
            </h2>

            {/* NEURAL FIELD CANVAS: Reactive Projection */}
            <div className="neural-field-canvas">
                <div className="holographic-grid"></div>
                <div className="field-projection-box" style={{ 
                    '--field-w': `${Math.min(60 + (currentHectares * 25), 240)}px`, 
                    '--field-h': `${Math.min(60 + (currentHectares * 25), 160)}px` 
                }}>
                    <FiMap />
                </div>
                <div style={{ position: 'absolute', bottom: '10px', right: '15px', color: 'var(--emerald-primary)', fontSize: '10px', fontWeight: 900, letterSpacing: '1px' }}>
                    {currentHectares.toFixed(2)} HA LINKED
                </div>
            </div>

            <form onSubmit={calculate}>
              {/* SMART CROP PICKER */}
              <div className="fc-field" style={{ position: 'relative', marginBottom: '1.5rem' }} ref={pickerRef}>
                <label><FiLayers /> {t.select_crop}</label>
                <div 
                  className={`smart-picker-trigger-modern ${crop ? 'selected' : ''}`}
                  onClick={() => setIsPickerOpen(!isPickerOpen)}
                >
                  <FiSearch className="search-pill-icon" />
                  <span className="picker-text-main">{crop ? getDisplayName(crop) : t.choose_crop}</span>
                </div>

                {isPickerOpen && (
                  <div className="smart-picker-dropdown fade-up">
                    <div className="picker-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                       <span style={{ fontWeight: 800, fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase' }}>{t.select_variety}</span>
                       <FiX onClick={() => setIsPickerOpen(false)} style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#dc2626' }} />
                    </div>
                    
                    <div className="picker-search">
                      <FiSearch />
                      <input 
                        type="text" 
                        placeholder={t.search_placeholder} 
                        value={pickerSearch}
                        onChange={(e) => setPickerSearch(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                        autoFocus
                      />
                    </div>

                    <div className="picker-categories">
                      {CATEGORIES.map(cat => (
                        <button 
                          key={cat.id} 
                          type="button" 
                          className={`cat-pill ${activeCat === cat.id ? 'active' : ''}`}
                          onClick={() => setActiveCat(cat.id)}
                        >
                          <span className="icon">{cat.icon}</span>
                          <span className="label">{language === 'mr' ? cat.mr : cat.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="picker-list">
                      {filteredCrops.length > 0 ? filteredCrops.slice(0, 10).map(c => (
                        <div 
                          key={c} 
                          className={`picker-item ${crop === c ? 'active' : ''}`}
                          onClick={() => { setCrop(c); setIsPickerOpen(false); }}
                        >
                          <div className="item-info">
                             <span className="item-name">{getDisplayName(c)}</span>
                             <span className="item-cat">{fertilizerData[c].cat}</span>
                          </div>
                          {crop === c && <FiCheck />}
                        </div>
                      )) : (
                        <div className="picker-no-results">No crops found for "{pickerSearch}"</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* AREA & UNIT - THE CULTIVATION SPAN */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="fc-field">
                  <label><FiMaximize /> {t.area_label}</label>
                  <input 
  type="text" 
  inputMode="decimal"
  value={area} 
  onChange={e => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val) && val.length <= 5) {
      setArea(val);
    }
  }} 
  placeholder="0.0" 
/>
                </div>
                <div className="fc-field">
                  <label>{t.unit_label}</label>
                  <select value={unit} onChange={e => setUnit(e.target.value)}>
                    <option value="hectare">Hectares</option>
                    <option value="acre">Acres</option>
                    <option value="bigha">Bigha</option>
                    <option value="guntha">Guntha</option>
                  </select>
                </div>
              </div>

              {/* DIAGNOSTIC SENSOR ARRAY (FERTILITY) */}
              <div className="fc-field" style={{ marginBottom: '1.5rem' }}>
                <label><FiActivity /> {t.soil_fertility}</label>
                <div className="sensor-node-array">
                   {[
                     { id: 'low', label: t.fert_low },
                     { id: 'medium', label: t.fert_med },
                     { id: 'high', label: t.fert_high }
                   ].map(n => (
                     <div 
                        key={n.id} 
                        className={`sensor-node ${fertility === n.id ? 'active' : ''}`} 
                        data-level={n.id}
                        onClick={() => setFertility(n.id)}
                     >
                        <div className="pulse-dot"></div>
                        <span>{n.label}</span>
                     </div>
                   ))}
                </div>
              </div>

              {/* FARMING STRATEGY (CARDS) */}
              <div className="fc-field" style={{ marginBottom: '2rem' }}>
                <label><FiCommand /> {t.strategy_label}</label>
                <div className="strategy-card-group">
                   {[
                     { id: 'balanced', label: t.strat_balanced, desc: t.strat_balanced_desc, icon: '🚀' },
                     { id: 'hybrid', label: t.strat_hybrid, desc: t.strat_hybrid_desc, icon: '🌿' },
                     { id: 'organic', label: t.strat_organic, desc: t.strat_organic_desc, icon: '🌱' }
                   ].map(s => (
                     <div 
                        key={s.id} 
                        className={`strategy-card ${strategy === s.id ? 'active' : ''}`}
                        onClick={() => setStrategy(s.id)}
                     >
                        <div className="strat-icon">{s.icon}</div>
                        <div className="strat-info">
                           <span className="strat-label">{s.label}</span>
                           <span className="strat-desc">{s.desc}</span>
                        </div>
                        {strategy === s.id && <div className="strat-check">✓</div>}
                     </div>
                   ))}
                </div>
              </div>

              <div className="fc-actions">
                <button type="submit" className="fc-primary-btn">
                   {t.calc_btn}
                </button>
                <button type="button" className="fc-secondary-btn" onClick={() => { setCrop(''); setArea(''); setResult(null); }}>
                   {t.reset_btn}
                </button>
              </div>
            </form>

            {/* INTELLIGENCE STATUS HUB */}
            <div className="intel-status-hub">
               <div className="intel-item">
                  <div className="dot"></div> {t.sat_precision}: {t.link_active}
               </div>
               <div className="intel-item cyber">
                  <div className="dot"></div> {t.climate_sync}: {t.link_active}
               </div>
            </div>
          </div>

          {crop && (
              <div className="fc-crop-spec fade-in">
                <div className="spec-header-with-img">
                   {myList.find(c => c.name === crop) && (
                     <img 
                       src={myList.find(c => c.name === crop).src} 
                       alt={crop} 
                       className="fc-spec-img" 
                     />
                   )}
                    <div className="spec-header-text">
                       <h3 className="spec-title">🌾 {getDisplayName(crop)} {t.guidance}</h3>
                       <p className="spec-cat-badge">{fertilizerData[crop].cat}</p>
                    </div>
                </div>
                <div className="spec-grid">
                   <div className="spec-box">
                      <small>{t.water}</small>
                      <p>{language === 'mr' ? fertilizerData[crop].mr_water : fertilizerData[crop].water}</p>
                   </div>
                   <div className="spec-box">
                      <small>{t.soil}</small>
                      <p>{language === 'mr' ? fertilizerData[crop].mr_soil : fertilizerData[crop].soil}</p>
                   </div>
                   <div className="spec-box-full">
                      <small>💡 {t.tips_title}</small>
                      <p className="tips-text">{language === 'mr' ? fertilizerData[crop].mr_tips : fertilizerData[crop].tips}</p>
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* REPORT PANEL */}
        <div className="fc-report-panel">
          {result ? (
            <div className="fc-report-card fade-in">
              <div className="report-header">
                <div className="header-meta">
                  <div className="authority-badge">✓ {language === 'mr' ? 'अधिकृत पीक प्रिस्क्रिप्शन' : 'Official Crop Prescription'}</div>
                  <h2>{t.report_title} {t.for_text} <span className="highlight-text">{getDisplayName(crop)}</span></h2>
                  <p className="subtitle">{t.area_report}: <strong>{result.area} {unit}</strong> ({result.hectares} ha)</p>
                </div>
                <div className="report-actions" style={{ display: 'flex', gap: '0.8rem', marginTop: '20px', flexWrap: 'wrap' }}>
                   <button onClick={() => { setIsGenerating(true); setTimeout(() => { window.print(); setIsGenerating(false); }, 1500); }} className="fc-primary-btn" style={{ margin: 0, padding: '0.8rem 1.5rem', flex: 1 }}>
                      <FiDownload /> {isGenerating ? t.generating : t.download}
                   </button>
                   <button onClick={() => setResult(null)} className="fc-secondary-btn" style={{ margin: 0, padding: '0.8rem 1.2rem' }}>
                      <FiActivity /> {t.edit_params}
                   </button>
                   <Link to="/services" className="fc-secondary-btn" style={{ margin: 0, padding: '0.8rem 1.2rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <FiArrowLeft /> {t.return_hub}
                   </Link>
                </div>
              </div>

              <div className="nutrient-visual-grid">
                {[
                  { id: 'n', title: t.n_title, val: result.n, lbl: t.urea_lbl, sub: result.urea, color: 'n-card' },
                  { id: 'p', title: t.p_title, val: result.p, lbl: t.dap_lbl, sub: result.dap, color: 'p-card' },
                  { id: 'k', title: t.k_title, val: result.k, lbl: t.mop_lbl, sub: result.mop, color: 'k-card' }
                ].map(item => (
                  <div key={item.id} className={`nutri-card ${item.color}`}>
                    <h4>{item.title}</h4>
                    <span className="val">{item.val} kg</span>
                    <small>{item.lbl}: <b>{item.sub} kg</b></small>
                  </div>
                ))}
              </div>

              <div className="investment-card">
                 <div className="inv-icon">🏛️</div>
                 <div className="inv-info">
                    <h4>{t.cost_title}</h4>
                    <span className="price">₹{parseInt(result.totalCost).toLocaleString('en-IN')}</span>
                    <p className="disclaimer">{t.cost_avg}</p>
                 </div>
              </div>

              <div className="organic-boost-card">
                 <div className="org-badge">🌱 {t.organic_section}</div>
                 <p className="org-msg">{t.organic_desc}</p>
                 <div className="org-stats">
                    <div className="stat">
                       <span className="stat-val">{result.manure} Tons</span>
                       <small className="stat-lbl">{t.manure_lbl}</small>
                    </div>
                    <div className="stat highlight">
                       <span className="stat-val">₹{result.savings}</span>
                       <small className="stat-lbl">{t.savings_lbl}</small>
                    </div>
                 </div>
              </div>

              <div className="report-tips-final" style={{ marginTop: '3rem', padding: '2.5rem', background: 'var(--sage-light)', borderRadius: '24px', border: '1px solid #bbf7d0' }}>
                 <h5 style={{ fontWeight: 950, color: 'var(--emerald-dark)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>💡 {t.tips_title}</h5>
                 <p className="tips-content" style={{ fontSize: '1.1rem', color: '#065f46', lineHeight: '1.8', fontWeight: 500 }}>{language === 'mr' ? fertilizerData[crop].mr_tips : fertilizerData[crop].tips}</p>
              </div>
            </div>
          ) : (
            <div className="fc-empty-state">
              <div className="lottie-placeholder" style={{ fontSize: '5rem', marginBottom: '2rem' }}>📡</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--emerald-dark)', marginBottom: '1rem' }}>{t.empty_title}</h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>{t.empty_desc}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FertilizerCalc
