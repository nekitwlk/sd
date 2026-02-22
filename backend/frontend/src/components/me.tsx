'use client';

import { retrieveLaunchParams } from '@tma.js/sdk-react';

export function Me() {
  let user = null;

  try {
    const { initData } = retrieveLaunchParams();
    user = initData?.user;
  } catch (err) {
    console.warn('No launch params in dev mode:', err);
    // В dev можно показать mock-user или просто текст
    user = {
      id: 123456789,
      first_name: 'Dev',
      last_name: 'User',
      username: 'dev_user',
      language_code: 'ru',
    };
  }

  if (!user) {
    return <div>Запусти в Telegram, чтобы увидеть профиль</div>;
  }

  return (
    <div>
      <h2>Привет, {user.first_name} {user.last_name || ''}!</h2>
      <p>ID: {user.id}</p>
      <p>Username: @{user.username || 'нет'}</p>
    </div>
  );
}