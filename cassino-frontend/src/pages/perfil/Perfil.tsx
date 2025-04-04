import React from 'react';
import PerfilList from '../../components/profile/PerfilList';
import '../perfil/Perfil.css'; 

const Perfil: React.FC = () => {
  return (
    <div className="select-profile-page">
      <h1>Quem está jogando?</h1>
      <PerfilList />
    </div>
  );
};

export default Perfil;
