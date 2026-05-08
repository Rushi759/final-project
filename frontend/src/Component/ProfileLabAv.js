import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import "../Styles/profile_page_ui.css"
import axios from 'axios'
import { MainContext } from '../context/agroguru_context'

const TRANSLATIONS = {
  en: {
    update_title: "Update Lab Settings",
    name_lbl: "Lab Name",
    name_ph: "Enter Lab Name",
    phone_lbl: "Contact Number",
    phone_ph: "Enter Phone",
    addr_lbl: "Address",
    addr_ph: "Enter Address",
    offday_lbl: "Off-Day",
    offday_ph: "e.g. Sunday",
    save_btn: "Save Lab Configurations",
    add_service_title: "Add Diagnostic Service",
    service_name_lbl: "Service Name",
    service_name_ph: "e.g. Soil Nutrient Analysis",
    service_img_lbl: "Service Image",
    publish_btn: "Publish Service",
    success_update: "Lab updated successfully",
    success_add: "Service added successfully",
    offday_req: "Off-Day is required"
  },
  mr: {
    update_title: "लॅब सेटिंग्ज अपडेट करा",
    name_lbl: "लॅबचे नाव",
    name_ph: "लॅबचे नाव प्रविष्ट करा",
    phone_lbl: "संपर्क क्रमांक",
    phone_ph: "फोन नंबर प्रविष्ट करा",
    addr_lbl: "पत्ता",
    addr_ph: "पत्ता प्रविष्ट करा",
    offday_lbl: "सुट्टीचा दिवस",
    offday_ph: "उदा. रविवार",
    save_btn: "लॅब कॉन्फिगरेशन जतन करा",
    add_service_title: "निदान सेवा जोडा",
    service_name_lbl: "सेवेचे नाव",
    service_name_ph: "उदा. मातीतील पोषक घटकांचे विश्लेषण",
    service_img_lbl: "सेवेचे फोटो",
    publish_btn: "सेवा प्रकाशित करा",
    success_update: "लॅब यशस्वीरित्या अपडेट झाली",
    success_add: "सेवा यशस्वीरित्या जोडली",
    offday_req: "सुट्टीचा दिवस आवश्यक आहे"
  }
}

const ProfileLabAv = ({lab}) => {
    const { language } = useContext(MainContext);
    const t = TRANSLATIONS[language || 'en'];
    
    const [sname,setName]=useState("");
    const [photo,setphoto]     = useState('');
    
    const schema = yup.object().shape({
        name: yup.string(),
        address: yup.string(),
        phone: yup.number(),
        offDay: yup.string().required(t.offday_req),
    })

    const {register, handleSubmit} = useForm({
        resolver: yupResolver(schema)
    });

    const setImage  = ()=> {
        const bodyFormData = new FormData();
        bodyFormData.append('sname',sname);
        bodyFormData.append('photo',photo);
        const  axiosConfig = {
            headers: {
                'Content-Type': "multipart/form-data",
            }
        }
        axios.post('/lab/itemadd',bodyFormData,axiosConfig,)
        .then((res)=>{
            alert(t.success_add);
        })
        .catch((er)=>{
            console.log(er);
        })
    }

    const onSubmit = (data) => {
        const  axiosConfig = {
            headers: {
                'Content-Type': "application/json",
            }
        }
        axios.patch('/lab/labup',data,axiosConfig)
        .then((e)=>{
            alert(t.success_update);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    return (
    <>
      <section className="profile_sec profile_avail" id="sec3">
        <div className="glass-panel-form">
          <div className="profile_sec_avail_text">{t.update_title}</div>
          <div className="profile_info_edit">
            <form className="frms" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid-premium">
                <div className="premium-input-group">
                  <label>{t.name_lbl}</label>
                  <input type='text' name='name' placeholder={lab?.name || t.name_ph} {...register("name")}/>
                </div>
                <div className="premium-input-group">
                  <label>{t.phone_lbl}</label>
                  <input type='text' name='phone' placeholder={lab?.phone || t.phone_ph} {...register("phone")}/>
                </div>
              </div>
              <div className="form-grid-premium" style={{marginTop: '2rem'}}>
                <div className="premium-input-group">
                  <label>{t.addr_lbl}</label>
                  <input type='text' name='address' placeholder={lab?.address || t.addr_ph} {...register('address')}/>
                </div>
                <div className="premium-input-group">
                  <label>{t.offday_lbl}</label>
                  <input type='text' name='offday' placeholder={t.offday_ph} {...register("offDay")}/>
                </div>
              </div>
              
              <div className="profile_edit_submit" style={{marginTop: '2.5rem'}}>
                <button className="gradient-action-btn">{t.save_btn}</button>
              </div>
            </form>
          </div>

          <div className="item-inventory-section">
            <p className="it_add_text">{t.add_service_title}</p>
            <form className="profile_edit_add_it">
              <div className="form-grid-premium">
                <div className="premium-input-group">
                  <label>{t.service_name_lbl}</label>
                  <input onChange={(e)=>{setName(e.target.value)}} placeholder={t.service_name_ph} type="text"/>
                </div>
                <div className="premium-input-group">
                   <label>{t.service_img_lbl}</label>
                   <input onChange={(e)=>{setphoto(e.target.files[0])}} type="file" style={{padding: '12px'}}/>
                </div>
              </div>
              <div className="it_submit" style={{marginTop: '2.5rem'}}>
                <button className="gradient-action-btn" onClick={(e)=>{
                  e.preventDefault();
                  setImage();
                }}>{t.publish_btn}</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProfileLabAv