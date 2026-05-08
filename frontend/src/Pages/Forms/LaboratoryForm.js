import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import '../../Styles/laboratory_form_ui.css'
import axios from 'axios'

const LaboratoryForm = () => {
    const [laboratoryImage, setlaboratoryImage] = useState(null);
    const [lgt, setlgt] = useState(0.0);
    const [lgn, setlgn] = useState(0.0);
    const [submitting, setSubmitting] = useState(false);

    const schema = yup.object().shape({
        name: yup.string().required("Laboratory name is required"),
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
        bodyFormData.append('laboratoryImage', laboratoryImage)
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
            await axios.post('/lab/register', bodyFormData, axiosConfig);
            alert("Laboratory registered successfully!");
            reset();
            setlaboratoryImage(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to register laboratory.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section id="lab_form_page" className="fade-in">
            <Link to="/profile" className="back-link">
                <span className="back-icon">←</span> Back to Dashboard
            </Link>
            
            <div id="lab_form_cnt">
                <div className="geo-status shadow-sm">
                    <div className="dot"></div>
                    {lgt !== 0 ? "GPS Tracking Active" : "Detecting Coordinates..."}
                </div>
                <h2>Register Testing Laboratory</h2>
                <form id="lab_form" onSubmit={handleSubmit(onSubmit)}>
                    <div className='attri'>
                        <label>Laboratory Name</label>
                        <input type="text" {...register("name")} placeholder='e.g. AgriScan Research Lab' />
                        <p className='err'>{errors.name?.message}</p>
                    </div>
                    
                    <div className='attri'>
                        <label>Physical Address</label>
                        <input type="text" {...register('address')} placeholder='Complete facility address' />
                        <p className='err'>{errors.address?.message}</p>
                    </div>

                    <div className='attri'>
                        <label>Official Contact Number</label>
                        <input type="text" {...register("phone")} placeholder='+91 00000 00000' />
                        <p className='err'>{errors.phone?.message}</p>
                    </div>

                    <div className='attri'>
                        <label className="file-label">Facility Gallery Photo</label>
                        <input type='file' id='lab_img_in' onChange={(e) => setlaboratoryImage(e.target.files[0])} />
                    </div>

                    <div className='form-btn'>
                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Initiating Registration...' : 'Authorize Laboratory'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export { LaboratoryForm }