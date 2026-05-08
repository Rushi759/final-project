import React, { useEffect, useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import "../Styles/profile_page_ui.css"
import axios from 'axios'
import { MainContext } from '../context/agroguru_context'

const TRANSLATIONS = {
  en: {
    update_title: "Update Your Nursery",
    name_lbl: "Nursery Name",
    phone_lbl: "Contact Number",
    addr_lbl: "Address",
    offday_lbl: "Off-Day",
    offday_ph: "e.g. Sunday",
    save_btn: "Save Nursery Details",
    add_item_title: "Add New Items",
    item_name_lbl: "Item Name",
    item_name_ph: "e.g. Rose Sapling",
    upload_img_lbl: "Upload Item Image",
    upload_btn: "Upload New Item",
    success_update: "Nursery updated successfully",
    success_add: "Item added successfully",
    offday_req: "Off-Day is required"
  },
  mr: {
    update_title: "आपली रोपवाटिका अपडेट करा",
    name_lbl: "रोपवाटिकेचे नाव",
    phone_lbl: "संपर्क क्रमांक",
    addr_lbl: "पत्ता",
    offday_lbl: "सुट्टीचा दिवस",
    offday_ph: "उदा. रविवार",
    save_btn: "रोपवाटिका तपशील जतन करा",
    add_item_title: "नवीन वस्तू जोडा",
    item_name_lbl: "वस्तूचे नाव",
    item_name_ph: "उदा. गुलाबाचे रोप",
    upload_img_lbl: "वस्तूला फोटो अपलोड करा",
    upload_btn: "नवीन वस्तू अपलोड करा",
    success_update: "रोपवाटिका यशस्वीरित्या अपडेट झाली",
    success_add: "वस्तू यशस्वीरित्या जोडली गेली",
    offday_req: "सुट्टीचा दिवस आवश्यक आहे"
  }
}

const ProfileNurAv = ({nursery}) => {
    const { language } = useContext(MainContext);
    const t = TRANSLATIONS[language || 'en'];
    
    const [nur,setNur] = useState(nursery) ;
    const [nurName,setnurName]=useState("");
    const [photo,setphoto]     = useState('');

    const setImage  = ()=> {
        const bodyFormData = new FormData();
        bodyFormData.append('name',nurName);
        bodyFormData.append('photo',photo);
        const  axiosConfig = {
            headers: {
                'Content-Type': "multipart/form-data",
            }
        }
        axios.post('/nursery/itemadd',bodyFormData,axiosConfig,)
        .then((res)=>{
            alert(t.success_add);
        })
        .catch((er)=>{
            console.log(er);
        })
    }
 
    const [toggle, setToggle] = useState(true) ;

    const schema = yup.object().shape({
        name: yup.string(),
        address: yup.string(),
        phone: yup.number(),
        offDay: yup.string().required(t.offday_req),
    })

    const {register, handleSubmit} = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        const  axiosConfig = {
            headers: {
                'Content-Type': "application/json",
            }
        }
        axios.patch('/nursery/nurseryup',data,axiosConfig)
        .then((e)=>{
            alert(t.success_update);
        })
        .catch(err=>{
            console.log(err);
        })
    }

  return (
    <>
      <section className="profile_sec profile_avail" id="sec2">
        <div className="glass-panel-form">
          <div className="profile_sec_avail_text">{t.update_title}</div>
          <div className="profile_info_edit">
            <form className="frms" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid-premium">
                <div className="premium-input-group">
                  <label>{t.name_lbl}</label>
                  <input type='text' name='name' placeholder={nursery.name} {...register('name')} />
                </div>
                <div className="premium-input-group">
                  <label>{t.phone_lbl}</label>
                  <input type='text' name='phone' placeholder={nursery.phone} {...register("phone")}/>
                </div>
              </div>
              <div className="form-grid-premium" style={{marginTop: '2rem'}}>
                <div className="premium-input-group">
                  <label>{t.addr_lbl}</label>
                  <input type='text' name='address' placeholder={nursery.address} {...register('address')}/>
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
            <p className="it_add_text">{t.add_item_title}</p>
            <form className="profile_edit_add_it">
              <div className="form-grid-premium">
                <div className="premium-input-group">
                  <label>{t.item_name_lbl}</label>
                  <input onChange={(e)=>{ setnurName(e.target.value) }} type="text" placeholder={t.item_name_ph}/>
                </div>
                <div className="premium-input-group">
                  <label>{t.upload_img_lbl}</label>
                  <input onChange={(e)=>{ setphoto(e.target.files[0]); }} type="file" style={{padding: '12px'}}/>
                </div>
              </div>
              <div className="it_submit" style={{marginTop: '2.5rem'}}>
                <button className="gradient-action-btn" onClick={(e)=>{
                  e.preventDefault();
                  setImage();
                }}>{t.upload_btn}</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProfileNurAv