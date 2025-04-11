import React, { useEffect, useState } from 'react';
import ProfileCard from './PerfilCard';
import api from '../../services/api'; // usa o seu `api.ts`

interface User {
  id: number;
  username: string;
}

const PerfilList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const data = await api.get('/user/user'); // Crie essa rota se ainda não existir
      setUsers(data.data);
    };
    fetchProfiles();
  }, []);

  const handleSelect = (user: User) => {
    localStorage.setItem('user_id', String(user.id));
    localStorage.setItem('username', user.username);
    window.location.href = "/home"; // Redireciona para Home
  };

  return (
    <div className="profile-container">
      {users.map(user => (
        <ProfileCard
          key={user.id}
          username={user.username}
          onClick={() => handleSelect(user)}
        />
      ))}
    </div>
  );
};

export default PerfilList;
