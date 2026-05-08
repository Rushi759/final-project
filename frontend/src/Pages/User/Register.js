import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import * as yup from 'yup'
import "../../Styles/auth_modern.css";
import { Link, useNavigate } from 'react-router-dom'
import { MainContext } from "../../context/agroguru_context";

const TRANSLATIONS = {
    en: {
        join_community: "Join the Community",
        start_journey: "Start your precision farming journey today",
        name_lbl: "Full Name",
        name_ph: "John Doe",
        email_lbl: "Email Address",
        email_ph: "farmer@example.com",
        phone_lbl: "Phone Number",
        phone_ph: "+91 XXXX XXX XXX",
        pass_lbl: "Password",
        pass_ph: "••••••••",
        conf_pass_lbl: "Confirm Password",
        conf_pass_ph: "••••••••",
        reg_btn: "Create Account",
        already_acc: "Already have an account?",
        login_link: "Log In",
        success_msg: "Account is created! Please login.",
        exist_msg: "Account already exists. Please login.",
        server_err: "Server error. Please try again later.",
        v_name_req: "Your full name is required !",
        v_email_req: "Email is required",
        v_email_valid: "Enter valid Email",
        v_phone_type: "That does not look like phone number",
        v_phone_int: "Enter valid Integer",
        v_phone_req: "Contact number is required",
        v_pass_min: "Password must be at least 4 characters",
        v_pass_req: "Password is must",
        v_pass_match: "Passwords Don't Match !"
    },
    mr: {
        join_community: "समुदायात सामील व्हा",
        start_journey: "तुमचा अचूक शेतीचा प्रवास आजच सुरू करा",
        name_lbl: "पूर्ण नाव",
        name_ph: "उदा. राहुल पाटील",
        email_lbl: "ईमेल पत्ता",
        email_ph: "उदा. farmer@example.com",
        phone_lbl: "फोन नंबर",
        phone_ph: "उदा. +91 98XXX XXXXX",
        pass_lbl: "पासवर्ड",
        pass_ph: "••••••••",
        conf_pass_lbl: "पासवर्डची पुष्टी करा",
        conf_pass_ph: "••••••••",
        reg_btn: "खाते तयार करा",
        already_acc: "आधीच खाते आहे का?",
        login_link: "लॉग इन करा",
        success_msg: "खाते तयार झाले आहे! कृपया लॉग इन करा.",
        exist_msg: "खाते आधीच अस्तित्वात आहे. कृपया लॉग इन करा.",
        server_err: "सर्व्हर त्रुटी. कृपया नंतर पुन्हा प्रयत्न करा.",
        v_name_req: "तुमचे पूर्ण नाव आवश्यक आहे!",
        v_email_req: "ईमेल आवश्यक आहे",
        v_email_valid: "वैध ईमेल प्रविष्ट करा",
        v_phone_type: "हे फोन नंबरसारखे दिसत नाही",
        v_phone_int: "वैध पूर्णांक प्रविष्ट करा",
        v_phone_req: "संपर्क क्रमांक आवश्यक आहे",
        v_pass_min: "पासवर्ड किमान ४ अक्षरांचा असावा",
        v_pass_req: "पासवर्ड आवश्यक आहे",
        v_pass_match: "पासवर्ड जुळत नाहीत!"
    }
};

const Register = () => {
    const navigate = useNavigate();
    const { language } = useContext(MainContext);
    const t = TRANSLATIONS[language || 'en'];

    const schema = yup.object().shape({
        name: yup.string().required(t.v_name_req),
        email: yup.string().email(t.v_email_valid).required(t.v_email_req),
        phone: yup.number()
            .typeError(t.v_phone_type)
            .positive().integer(t.v_phone_int)
            .required(t.v_phone_req),
        password: yup.string().min(4, t.v_pass_min).max(20).required(t.v_pass_req),
        confirmPassword: yup.string().oneOf([yup.ref("password"), null], t.v_pass_match)
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        let axiosConfig = {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        };

        let errorObj = null;
        let resStatus = 200;
        await axios.post('/user/register', { data }, axiosConfig)
            .then(() => {})
            .catch(err => {
                if (!err.response) {
                    resStatus = 503;
                    errorObj = { response: { data: { detail: "Cannot reach server. Please ensure the 'Starting Python API' window is open." } } };
                } else {
                    resStatus = err.response.status;
                    errorObj = err;
                }
            })

        if (resStatus === 200) {
            alert(t.success_msg);
            navigate('/')
        } else if (resStatus === 409) {
            alert(t.exist_msg);
            navigate('/')
        } else {
            const errorDetail = errorObj?.response?.data?.detail || t.server_err;
            alert(`Registration Error: ${errorDetail}`);
        }
    }

    return (
        <div className={`auth-page-container fade-in ${language === 'mr' ? 'marathi-mode' : ''}`}>
            <div className="auth-glass-card">
                <div className="auth-header">
                   <div className="auth-logo">
                       {language === 'mr' ? (
                         <span className="sp1" style={{color: '#fff', fontSize: '1.8rem'}}>ॲग्रोगुरू</span>
                       ) : (
                         <><span className="sp1">Agro</span><span className="sp2">Guru</span></>
                       )}
                   </div>
                   <h3>{t.join_community}</h3>
                   <p>{t.start_journey}</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="reg-name">{t.name_lbl}</label>
                        <input type="text" id="reg-name" placeholder={t.name_ph} {...register("name")}/>
                        <p className='err'>{errors.name?.message}</p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-email">{t.email_lbl}</label>
                        <input type="email" id="reg-email" placeholder={t.email_ph} {...register("email")}/>
                        <p className='err'>{errors.email?.message}</p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-phone">{t.phone_lbl}</label>
                        <input type="text" id="reg-phone" placeholder={t.phone_ph} {...register("phone")}/>
                        <p className='err'>{errors.phone?.message}</p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-password">{t.pass_lbl}</label>
                        <input type="password" id="reg-password" placeholder={t.pass_ph} {...register("password")}/>
                        <p className='err'>{errors.password?.message}</p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-confpass">{t.conf_pass_lbl}</label>
                        <input type="password" id="reg-confpass" placeholder={t.conf_pass_ph} {...register("confirmPassword")}/>
                        <p className='err'>{errors.confirmPassword?.message}</p>
                    </div>

                    <button className="auth-btn">{t.reg_btn}</button>
                </form>

                <div className="auth-footer">
                    {t.already_acc} <Link to="/login">{t.login_link}</Link>
                </div>
            </div>
        </div>
    )
}

export default Register