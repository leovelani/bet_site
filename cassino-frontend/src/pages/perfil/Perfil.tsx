import React, { useEffect } from 'react';
import PerfilList from '../../components/profile/PerfilList';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';

const Perfil: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="select-profile-page">
      <h1>QUEM ESTÁ JOGANDO?</h1>
      <PerfilList />
    </div>
  );
};

export default Perfil;
