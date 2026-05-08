// react dom import 
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

// importing pages

import Login from '../Pages/User/Login';
import Register from '../Pages/User/Register';
import Home from '../Layout/Home';
import Main from '../Layout/Main';
import CropPredict from "../Pages/Main_Pages/CropPredict";
import { Nursery } from "../Pages/Main_Pages/Nursery";
import About from "../Pages/Main_Pages/About";
import { Profile } from "../Pages/User/Profile";
import { NurseryForm } from "../Pages/Forms/NurseryForm";
import { MarketForm } from "../Pages/Forms/MarketForm";
import { Market } from "../Pages/Main_Pages/Market";
import { Laboratory } from "../Pages/Main_Pages/Laboratory";
import { Forms } from "../Layout/Forms";
import { LaboratoryForm } from '../Pages/Forms/LaboratoryForm';
import ForgotPassword from '../Pages/User/ForgotPassword';
import ResetPassword from '../Pages/User/ResetPassword';

import Info from "../Pages/Main_Pages/Info";
import Services from "../Layout/Services";
import RouteMap from "../Component/MapRoute";

// Services Hub & Extension Pages
import ServiceHub from "../Pages/Main_Pages/ServiceHub";
import AgriFinance from "../Pages/Main_Pages/AgriFinance";
import DiseaseScanner from "../Pages/Main_Pages/DiseaseScanner";
import IrrigationCalc from "../Pages/Main_Pages/IrrigationCalc";

// New Feature Pages
import CropEncyclopedia from "../Pages/Main_Pages/CropEncyclopedia";
import SeasonalCalendar from "../Pages/Main_Pages/SeasonalCalendar";
import FertilizerCalc from "../Pages/Main_Pages/FertilizerCalc";
import HomeMain from "../Pages/Main_Pages/HomeMain";
import SmartPriceHub from "../Pages/Main_Pages/SmartPriceHub";
import GovSchemes from "../Pages/Main_Pages/GovSchemes";

// creating react-routers 
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<Home />}></Route>
      <Route exact path='login' element={<Login />} ></Route>
      <Route path='regi' element={<Register />} ></Route>
      <Route path='forgot-password' element={<ForgotPassword />} ></Route>
      <Route path='reset-password/:token' element={<ResetPassword />} ></Route>


      <Route element={<Main />}>
        <Route path='/main' element={<HomeMain />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Route>

      <Route path="/form" element={<Forms />}>
        <Route path="nurf" element={<NurseryForm />}></Route>
        <Route path="marketf" element={<MarketForm />}></Route>
        <Route path="labf" element={<LaboratoryForm />}></Route>
      </Route>



      <Route path="/services" element={<Services />}>
        <Route index element={<ServiceHub />} />
        <Route path='crop' element={<CropPredict />} ></Route>
        <Route path='nur' element={<Nursery />} ></Route>
        <Route path="market" element={<Market />} />
        <Route path="lab" element={<Laboratory />} />
        <Route path="info" element={<Info />} />
        <Route path="crops" element={<CropEncyclopedia />} />
        <Route path="calendar" element={<SeasonalCalendar />} />
        <Route path="fertilizer" element={<FertilizerCalc />} />
        <Route path="finance" element={<AgriFinance />} />
        <Route path="scan" element={<DiseaseScanner />} />
        <Route path="water" element={<IrrigationCalc />} />
        <Route path="price-hub" element={<SmartPriceHub />} />
        <Route path="schemes" element={<GovSchemes />} />
      </Route>

      <Route path="/map/:ltd/:lgt" element={<RouteMap />} />

    </Route>



  )
)

export default router;
