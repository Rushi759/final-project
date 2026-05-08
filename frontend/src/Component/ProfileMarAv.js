import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import "../Styles/profile_page_ui.css"
import axios from 'axios'
import { MainContext } from '../context/agroguru_context'

const TRANSLATIONS = {
  en: {
    update_title: "Update Market Info",
    name_lbl: "Market Name",
    name_ph: "Enter Market Name",
    phone_lbl: "Contact Number",
    phone_ph: "Enter Phone",
    addr_lbl: "Address",
    addr_ph: "Enter Address",
    offday_lbl: "Off-Day",
    offday_ph: "e.g. Sunday",
    save_btn: "Save Market Details",
    add_item_title: "Add Inventory Item",
    item_name_lbl: "Item Name",
    item_name_ph: "e.g. Tomato Seeds",
    item_price_lbl: "Item Price (₹)",
    item_price_ph: "e.g. 250",
    submit_btn: "Submit Inventory Item",
    success_update: "Market updated successfully",
    success_add: "Item added successfully",
    offday_req: "Off-Day is required"
  },
  mr: {
    update_title: "मार्केट माहिती अपडेट करा",
    name_lbl: "मार्केटचे नाव",
    name_ph: "मार्केटचे नाव प्रविष्ट करा",
    phone_lbl: "संपर्क क्रमांक",
    phone_ph: "फोन नंबर प्रविष्ट करा",
    addr_lbl: "पत्ता",
    addr_ph: "पत्ता प्रविष्ट करा",
    offday_lbl: "सुट्टीचा दिवस",
    offday_ph: "उदा. रविवार",
    save_btn: "मार्केट तपशील जतन करा",
    add_item_title: "माल साठा आयटम जोडा",
    item_name_lbl: "वस्तूला नाव",
    item_name_ph: "उदा. टोमॅटो बियाणे",
    item_price_lbl: "वस्तूची किंमत (₹)",
    item_price_ph: "उदा. २५०",
    submit_btn: "इन्व्हेंटरी आयटम सबमिट करा",
    success_update: "मार्केट यशस्वीरित्या अपडेट झाले",
    success_add: "आयटम यशस्वीरित्या जोडला",
    offday_req: "सुट्टीचा दिवस आवश्यक आहे"
  }
}

const ProfileMarAv = ({market}) => {
    const { language } = useContext(MainContext);
    const t = TRANSLATIONS[language || 'en'];

    const [item,setitem] = useState('')
    const [price,setprice] = useState('');

    const setitems = ()=>{
        const  axiosConfig = {
            headers: {
                'Content-Type': "application/json",
            }
        }
        axios.post('/market/additems',{item,price},axiosConfig)
        .then((e)=>{
            alert(t.success_add);
        })
        .catch(err=>{
            console.log(err);
        })
    }

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
        axios.patch('/market/marketup',data,axiosConfig)
        .then((e)=>{
            alert(t.success_update);
        })
        .catch(err=>{
            console.log(err);
        })
    }

  return (
    <>
      <section className="profile_sec profile_avail" id="sec4">
        <div className="glass-panel-form">
          <div className="profile_sec_avail_text">{t.update_title}</div>
          <div className="profile_info_edit">
            <form className="frms" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid-premium">
                <div className="premium-input-group">
                  <label>{t.name_lbl}</label>
                  <input type='text' name='name' placeholder={market?.name || t.name_ph} {...register("name")}/>
                </div>
                <div className="premium-input-group">
                  <label>{t.phone_lbl}</label>
                  <input type='text' name='phone' placeholder={market?.phone || t.phone_ph} {...register("phone")}/>
                </div>
              </div>
              <div className="form-grid-premium" style={{marginTop: '2rem'}}>
                <div className="premium-input-group">
                  <label>{t.addr_lbl}</label>
                  <input type='text' name='address' placeholder={market?.address || t.addr_ph} {...register('address')}/>
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
                  <input onChange={(e)=>{setitem(e.target.value)}} placeholder={t.item_name_ph} type="text"/>
                </div>
                <div className="premium-input-group">
                  <label>{t.item_price_lbl}</label>
                  <input onChange={(e)=>{setprice(e.target.value)}} placeholder={t.item_price_ph} type="text"/>
                </div>
              </div>
              <div className="it_submit" style={{marginTop: '2.5rem'}}>
                <button className="gradient-action-btn" onClick={(e)=>{
                  e.preventDefault();
                  setitems();
                }}>{t.submit_btn}</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProfileMarAv