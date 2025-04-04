import React from 'react';

interface ProfileCardProps {
  username: string;
  onClick: () => void;
}

const PerfilCard: React.FC<ProfileCardProps> = ({ username, onClick }) => {
  return (
    <div onClick={onClick} className="profile-card">
      <div className="avatar-placeholder">👤</div>
      <p>{username}</p>
    </div>
  );
};

export default PerfilCard;
