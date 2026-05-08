import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import '../../Styles/nursery_form_ui.css'
import axios from 'axios'

const NurseryForm = () => {
    const [nurseryImage, setnurseryImage] = useState(null);
    const [lgt, setlgt] = useState(0.0);
    const [lgn, setlgn] = useState(0.0);
    const [submitting, setSubmitting] = useState(false);

    const schema = yup.object().shape({
        name: yup.string().required("Nursery name is required"),
        address: yup.string().required("Address must be provided"),
        email: yup.string().email("Enter valid email").required("Email is required"),
        phone: yup.string().required("Contact number is required"),
        openTime: yup.string().required("Enter Opening Time"),
        closeTime: yup.string().required("Enter Closing Time"),
        offDay: yup.string().required("Off-Day is required"),
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async function (position) {
            setlgt(position.coords.longitude);
            setlgn(position.coords.latitude);
        })
    }, [])

    const onSubmit = async (data) => {
        setSubmitting(true);
        const bodyFormData = new FormData();
        bodyFormData.append('nurseryImage', nurseryImage)
        bodyFormData.append('name', data.name)
        bodyFormData.append('phone', data.phone)
        bodyFormData.append('address', data.address)
        bodyFormData.append('openTime', data.openTime)
        bodyFormData.append('closeTime', data.closeTime)
        bodyFormData.append('offDay', data.offDay)

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
            await axios.post('/nursery/register', bodyFormData, axiosConfig);
            alert("Nursery registered successfully!");
            reset();
            setnurseryImage(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Internal server error. Are you logged in?");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section id="nursery_page" className="fade-in">
            <Link to="/profile" className="back-link">
                <span className="back-icon">←</span> Back to Dashboard
            </Link>

            <div id="nur_form_cnt">
                <div className="geo-status shadow-sm">
                    <div className="dot"></div>
                    {lgt !== 0 ? "Location Verified" : "Detecting Location..."}
                </div>
                <h2>Register Your Nursery</h2>
                <form id="nur_form" onSubmit={handleSubmit(onSubmit)}>
                    <div className='attri'>
                        <label>Name of Nursery</label>
                        <input type="text" {...register("name")} placeholder='Enter Nursery Name' />
                        <p className='err'>{errors.name?.message}</p>
                    </div>
                    
                    <div className='attri'>
                        <label>Physical Address</label>
                        <input type="text" {...register('address')} placeholder='Enter Full Address' />
                        <p className='err'>{errors.address?.message}</p>
                    </div>

                    <div className='attri'>
                        <label>Contact Email</label>
                        <input type="email" {...register("email")} placeholder='Enter Email' />
                        <p className='err'>{errors.email?.message}</p>
                    </div>

                    <div className='attri'>
                        <label>Contact Number</label>
                        <input type="text" {...register("phone")} placeholder='Enter Phone Number' />
                        <p className='err'>{errors.phone?.message}</p>
                    </div>

                    <div className='attri'>
                        <div id="nur_times">
                            <div>
                                <label>Opening Time</label>
                                <input type="time" {...register("openTime")} />
                            </div>
                            <div>
                                <label>Closing Time</label>
                                <input type="time" {...register("closeTime")} />
                            </div>
                        </div>
                    </div>

                    <div className='attri'>
                        <label>Off-Day</label>
                        <input type="text" {...register("offDay")} placeholder='Enter Off Day (e.g. Sunday)' />
                        <p className='err'>{errors.offDay?.message}</p>
                    </div>

                    <div className='attri'>
                        <label id="nur_img_lab">Upload Nursery Photo</label>
                        <input type='file' id='nur_img_in' onChange={(e) => setnurseryImage(e.target.files[0])} />
                    </div>

                    <div className='form-btn'>
                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Registering...' : 'Register Nursery'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export { NurseryForm }