import { useParams } from 'react-router-dom';
import { PartnerRegisterPage } from './PartnerRegisterPage';

export function PartnerCardPage() {
  const { id } = useParams();
  return <PartnerRegisterPage mode="detail" partnerId={id} />;
}

