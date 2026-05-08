import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import '../../Styles/market_form_ui.css'
import axios from 'axios'

const MarketForm = () => {
    const [marketImage, setmarketImage] = useState(null);
    const [lgt, setlgt] = useState(0.0);
    const [lgn, setlgn] = useState(0.0);
    const [submitting, setSubmitting] = useState(false);

    const schema = yup.object().shape({
        name: yup.string().required("Market name is required"),
        address: yup.string().required("Address must be provided"),
        phone: yup.string().required("Contact number is required"),
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setlgt(position.coords.longitude);
            setlgn(position.coords.latitude);
        })
    }, [])

    const onSubmit = async (data) => {
        setSubmitting(true);
        const bodyFormData = new FormData();
        bodyFormData.append('marketImage', marketImage)
        bodyFormData.append('name', data.name)
        bodyFormData.append('phone', data.phone)
        bodyFormData.append('address', data.address)

        const axiosConfig = {
            params: {
                lng: JSON.stringify(lgn),
                ltd: JSON.stringify(lgt)
            },
            headers: {
                'Content-Type': "multipart/form-data",
            },
            withCredentials: true
        }

        try {
            await axios.post('/market/register', bodyFormData, axiosConfig);
            alert("Market registered successfully!");
            reset();
            setmarketImage(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to register market.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section id="market_form_page" className="fade-in">
            <Link to="/profile" className="back-link">
                <span className="back-icon">←</span> Back to Dashboard
            </Link>

            <div id="mar_form_cnt">
                <div className="geo-status shadow-sm">
                    <div className="dot"></div>
                    {lgt !== 0 ? "Region Locked" : "Locating Market..."}
                </div>
                <h2>Register Your Market</h2>
                <form id="mar_form" onSubmit={handleSubmit(onSubmit)}>
                    <div className='attri'>
                        <label>Market / Business Name</label>
                        <input type="text" {...register("name")} placeholder='e.g. Central Grain Market' />
                        <p className='err'>{errors.name?.message}</p>
                    </div>
                    
                    <div className='attri'>
                        <label>Physical Location</label>
                        <input type="text" {...register('address')} placeholder='Full market address' />
                        <p className='err'>{errors.address?.message}</p>
                    </div>

                    <div className='attri'>
                        <label>Authority Contact Number</label>
                        <input type="text" {...register("phone")} placeholder='+91 00000 00000' />
                        <p className='err'>{errors.phone?.message}</p>
                    </div>

                    <div className='attri'>
                        <label className="file-label">Market Banner Image</label>
                        <input type='file' id='mar_img_in' onChange={(e) => setmarketImage(e.target.files[0])} />
                    </div>

                    <div className='form-btn'>
                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Authenticating...' : 'Register Market Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export { MarketForm }