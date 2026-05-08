import React, { useContext, useEffect, useState } from 'react'
import { MainNavbar } from '../../Component/MainNavbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import UserDetail from '../../Component/UserDetail'
import ProfileNurAv from '../../Component/ProfileNurAv'
import ProfileNurNa from '../../Component/ProfileNurNa'
import ProfileMarAv from '../../Component/ProfileMarAv'
import ProfileMarNa from '../../Component/ProfileMarNa'
import ProfileLabAv from '../../Component/ProfileLabAv'
import ProfileLabNa from '../../Component/ProfileLabNa'
import FooterWeb from '../../Component/FooterWeb'
import { MainContext } from '../../context/agroguru_context'

export const Profile = () => {
  const { language } = useContext(MainContext);
  const navigate = useNavigate();
  const [dat, setdat] = useState({});

  const [isNur, setIsNur] = useState(null);
  const [isMar, setIsMar] = useState(null);
  const [isLab, setIsLab] = useState(null);

  const isnursery = () => {
    axios.get('/nursery/usernursery')
      .then((res) => {
        setIsNur(res.data);
      })
      .catch(() => {
        setIsNur(false);
      })
  }

  const islab = () => {
    axios.get('/lab/userlab')
      .then((res) => {
        setIsLab(res.data);
      })
      .catch(() => {
        setIsLab(false);
      })
  }

  const ismarket = () => {
    axios.get('/market/usermarket')
      .then((res) => {
        setIsMar(res.data);
      })
      .catch(() => {
        setIsMar(false);
      })
  }

  const getuser = () => {
    axios.get('/user/getuser')
      .then((res) => {
        setdat(res.data);
      })
      .catch(() => {
        navigate('/');
      })
  }

  useEffect(() => {
    getuser();
    isnursery();
    islab();
    ismarket();
  }, [])

  return (
    <>
      <MainNavbar />
      <div className="profile-dashboard-wrapper fade-in">
        <UserDetail
          name={dat.name}
          email={dat.email}
          phone={dat.phone}
          nur={isNur}
          mar={isMar}
          lab={isLab}
          profilpic={dat.profilpic}
        />

        <section className="management-sections">
          {isNur ? <ProfileNurAv nursery={isNur} /> : <ProfileNurNa />}
          {isMar ? <ProfileMarAv market={isMar} /> : <ProfileMarNa />}
          {isLab ? <ProfileLabAv lab={isLab} /> : <ProfileLabNa />}
        </section>
      </div>
      <FooterWeb />
    </>
  )
}
