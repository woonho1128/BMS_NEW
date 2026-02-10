import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import DeliveryPlanApp from '../../../App';

export function DeliveryPlanPage() {
  const { user } = useAuth();
  const userName = user?.name || '홍길동';
  return <DeliveryPlanApp currentUserName={userName} user={user} />;
}
